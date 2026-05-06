import cv2
import os

video_path = 'traffic.mp4'
print(f"Checking {video_path}...")
print(f"File exists: {os.path.exists(video_path)}")

cap = cv2.VideoCapture(video_path)
if not cap.isOpened():
    print("Error: Could not open video file.")
else:
    print("Success: Video opened.")
    ret, frame = cap.read()
    if ret:
        print(f"Frame read successfully. Shape: {frame.shape}")
    else:
        print("Error: Could not read frame.")
cap.release()
