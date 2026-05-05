import cv2
import numpy as np
from ultralytics import YOLO
import base64
import time
import asyncio
import json

class TrafficDetector:
    def __init__(self, model_path='yolov8n.pt'):
        self.model = YOLO(model_path)
        self.classes = [0, 1, 2, 3, 5, 7, 9, 10] # person, bicycle, car, motorcycle, bus, truck, traffic light, stop sign
        self.class_names = self.model.names
        self.is_running = False
        self.confidence_threshold = 0.25

    async def detect_stream(self, websocket, camera_id=0):
        cap = cv2.VideoCapture(camera_id)
        if not cap.isOpened():
            print("Error: Could not open camera.")
            return

        self.is_running = True
        try:
            while self.is_running:
                success, frame = cap.read()
                if not success:
                    break

                start_time = time.time()
                
                # Run YOLOv8 inference
                results = self.model(frame, classes=self.classes, conf=self.confidence_threshold, verbose=False)
                
                # Annotate frame
                annotated_frame = results[0].plot()
                
                # Calculate metrics
                fps = 1.0 / (time.time() - start_time)
                counts = results[0].boxes.cls.unique().tolist()
                detection_data = {
                    "fps": round(fps, 2),
                    "counts": {},
                    "objects": []
                }

                # Count objects
                for cls in results[0].boxes.cls:
                    name = self.class_names[int(cls)]
                    detection_data["counts"][name] = detection_data["counts"].get(name, 0) + 1

                # Extract boxes for frontend (if needed separately)
                for box in results[0].boxes:
                    detection_data["objects"].append({
                        "class": self.class_names[int(box.cls)],
                        "conf": float(box.conf),
                        "bbox": box.xyxy[0].tolist()
                    })

                # Encode frame to base64
                _, buffer = cv2.imencode('.jpg', annotated_frame)
                frame_base64 = base64.b64encode(buffer).decode('utf-8')

                # Send frame and data via WebSocket
                await websocket.send_json({
                    "image": frame_base64,
                    "data": detection_data
                })

                await asyncio.sleep(0.01) # Short delay to allow other tasks

        finally:
            cap.release()
            self.is_running = False

    def stop(self):
        self.is_running = False

detector = TrafficDetector()
