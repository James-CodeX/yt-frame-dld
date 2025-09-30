import requests

url = "http://localhost:8001/extract_frame_720p"
payload = {
    "youtube_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "timestamp": "00:30"
}

response = requests.post(url, json=payload)
print(response.status_code)
print(response.json())
