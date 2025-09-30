from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import cv2
import yt_dlp
import re
import os
from datetime import datetime
from minio import Minio
from dotenv import load_dotenv
import io
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI()

# Add CORS middleware
allowed_origins = os.getenv(
    "ALLOWED_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MinIO client setup
minio_client = Minio(
    os.getenv("MINIO_ENDPOINT"),
    access_key=os.getenv("MINIO_ACCESS_KEY"),
    secret_key=os.getenv("MINIO_SECRET_KEY"),
    secure=os.getenv("MINIO_SECURE", "false").lower() == "true"
)
bucket_name = os.getenv("MINIO_BUCKET_NAME")


class VideoRequest(BaseModel):
    youtube_url: str
    timestamp: str


def parse_timestamp(timestamp: str) -> float:
    """Convert timestamp (e.g., '00:30' or '00:03:14') to seconds."""
    try:
        parts = timestamp.split(":")
        parts = [float(part) for part in parts]
        if len(parts) == 2:  # mm:ss
            return parts[0] * 60 + parts[1]
        elif len(parts) == 3:  # hh:mm:ss
            return parts[0] * 3600 + parts[1] * 60 + parts[2]
        else:
            raise ValueError("Invalid timestamp format")
    except (ValueError, AttributeError):
        raise HTTPException(
            status_code=400, detail="Invalid timestamp format. Use mm:ss or hh:mm:ss")


def get_video_stream_url(youtube_url: str) -> str:
    """Get direct video stream URL using yt-dlp."""
    ydl_opts = {
        'format': 'best[ext=mp4]',  # Prefer MP4 for compatibility
        'quiet': True,
    }
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(youtube_url, download=False)
            return info['url']
    except Exception as e:
        raise HTTPException(
            status_code=400, detail=f"Failed to fetch video stream: {str(e)}")


def extract_frame(video_url: str, timestamp: float, object_name: str) -> str:
    """Extract a single frame at the specified timestamp and upload to MinIO."""
    try:
        cap = cv2.VideoCapture(video_url)
        if not cap.isOpened():
            raise Exception("Could not open video stream")

        # Set video position to timestamp (in milliseconds)
        cap.set(cv2.CAP_PROP_POS_MSEC, timestamp * 1000)

        ret, frame = cap.read()
        if not ret:
            raise Exception("Could not read frame at specified timestamp")

        # Encode frame to JPEG
        success, encoded_image = cv2.imencode('.jpg', frame)
        if not success:
            raise Exception("Failed to encode frame")

        # Upload to MinIO
        image_bytes = io.BytesIO(encoded_image.tobytes())
        minio_client.put_object(
            bucket_name,
            object_name,
            image_bytes,
            length=image_bytes.getbuffer().nbytes,
            content_type='image/jpeg'
        )
        cap.release()
        return object_name
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to extract frame: {str(e)}")


@app.post("/extract_frame")
async def extract_frame_endpoint(request: VideoRequest):
    """API endpoint to extract a frame from a YouTube video at a given timestamp."""
    # Validate timestamp format
    if not re.match(r"^\d{2}:\d{2}(:\d{2})?$", request.timestamp):
        raise HTTPException(
            status_code=400, detail="Timestamp must be in mm:ss or hh:mm:ss format")

    # Parse timestamp to seconds
    timestamp_seconds = parse_timestamp(request.timestamp)

    # Get video stream URL
    video_url = get_video_stream_url(request.youtube_url)

    # Generate unique object name
    timestamp_str = datetime.now().strftime("%Y%m%d_%H%M%S")
    object_name = f"frame_{timestamp_str}.jpg"

    # Extract and upload frame
    extract_frame(video_url, timestamp_seconds, object_name)

    # Generate MinIO URL
    file_url = minio_client.presigned_get_object(bucket_name, object_name)

    return {
        "message": "Frame extracted and uploaded successfully",
        "file_url": file_url,
        "timestamp": request.timestamp
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
