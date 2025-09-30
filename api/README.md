# YouTube Frame Extractor API

This API provides endpoints to extract frames from YouTube videos at specific timestamps and upload them to a MinIO bucket. It supports different resolutions: HD (720p) and UHD (best available).

## Files

- `main-hd.py`: FastAPI server for extracting HD (720p) frames.
- `main-uhd.py`: FastAPI server for extracting UHD frames (best available resolution).
- `test.py`: Test script to verify the API functionality.
- `requirements.txt`: Python dependencies.
- `.env`: Environment variables for MinIO configuration.
- `frame_*.jpg`: Example extracted frames (local copies, if any).

## Installation

1. Install Python dependencies:

   ```
   pip install -r requirements.txt
   ```

2. Set up MinIO server and configure `.env` file with your MinIO credentials.

## Configuration

Edit the `.env` file with your MinIO settings:

```
MINIO_ENDPOINT=your-minio-endpoint:port
MINIO_ACCESS_KEY=your-access-key
MINIO_SECRET_KEY=your-secret-key
MINIO_BUCKET_NAME=your-bucket-name
MINIO_SECURE=true  # or false
```

## Usage

### Running the Servers

- For HD frames:

  ```
  python main-hd.py
  ```

  Server runs on `http://localhost:8001`

- For UHD frames:
  ```
  python main-uhd.py
  ```
  Server runs on `http://localhost:8000`

### API Endpoints

#### Extract HD Frame

- **URL**: `POST /extract_frame_720p`
- **Body**:
  ```json
  {
    "youtube_url": "https://www.youtube.com/watch?v=VIDEO_ID",
    "timestamp": "00:30"
  }
  ```
- **Response**:
  ```json
  {
    "message": "720p Frame extracted and uploaded successfully",
    "file_url": "https://minio-endpoint/bucket/frame_720p_YYYYMMDD_HHMMSS.jpg?presigned-url",
    "timestamp": "00:30"
  }
  ```

#### Extract UHD Frame

- **URL**: `POST /extract_frame`
- **Body**: Same as above.
- **Response**: Similar, with UHD resolution.

### Testing

Run the test script:

```
python test.py
```

This will test the API endpoints with sample data.

## Dependencies

- fastapi
- uvicorn
- pydantic
- opencv-python
- yt-dlp
- minio
- python-dotenv

## Notes

- Timestamps should be in `mm:ss` or `hh:mm:ss` format.
- Frames are uploaded to MinIO and a presigned URL is returned.
- Ensure your MinIO bucket exists and is accessible.
- Ensure you have permission to access YouTube videos.
