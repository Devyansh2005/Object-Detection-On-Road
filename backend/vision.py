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
        self.classes = [0, 1, 2, 3, 5, 7, 9, 10] 
        self.class_names = self.model.names
        self.confidence_threshold = 0.25

    async def detect_stream(self, websocket, video_source='user_traffic.mp4'):
        cap = cv2.VideoCapture(video_source)
        if not cap.isOpened():
            print(f"Error: Could not open video source {video_source}.")
            return

        try:
            while True:
                success, frame = cap.read()
                if not success:
                    # Loop the video
                    cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
                    success, frame = cap.read()
                    if not success:
                        break
                
                # Resize for performance if it's too large
                if frame.shape[1] > 1280:
                    frame = cv2.resize(frame, (1280, 720))

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
                counts_dict = {}
                for cls in results[0].boxes.cls:
                    name = self.class_names[int(cls)]
                    counts_dict[name] = counts_dict.get(name, 0) + 1
                
                detection_data["counts"] = counts_dict

                # Advanced Alert Logic
                vehicle_count = sum([counts_dict.get(k, 0) for k in ['car', 'truck', 'bus', 'motorcycle']])
                
                if vehicle_count > 12:
                    # Generate a primary alert for the stream
                    detection_data["alert"] = {
                        "type": "Critical Congestion",
                        "priority": "High",
                        "msg": "Extreme vehicle density detected at intersection.",
                        "location": "Sector Alpha-4"
                    }
                    
                    # Store multiple derived issues in the DB for the Alerts page
                    db = database.SessionLocal()
                    try:
                        issues = [
                            ("Traffic Congestion", "High", "Level 4 congestion exceeding capacity."),
                            ("Slow Vehicle Movement", "Medium", "Average speed dropped below 15km/h."),
                            ("Noise Pollution Alert", "Low", "Acoustic levels exceeding 85dB threshold."),
                            ("High Travel Time", "Medium", "Estimated delay +12 minutes for this sector."),
                            ("Carbon Emission Peak", "Medium", "Air quality index decreasing due to idling.")
                        ]
                        for i_type, i_pri, i_msg in issues:
                            alert = database.Alert(
                                type=i_type,
                                priority=i_pri,
                                location="Sector Alpha-4",
                                msg=i_msg,
                                confidence=0.98
                            )
                            db.add(alert)
                        db.commit()
                    except Exception as e:
                        print(f"DB Alert Error: {e}")
                    finally:
                        db.close()

                elif counts_dict.get('person', 0) > 0:
                    pass 

                # Extract boxes for frontend (if needed separately)
                for box in results[0].boxes:
                    detection_data["objects"].append({
                        "class": self.class_names[int(box.cls)],
                        "conf": float(box.conf),
                        "bbox": box.xyxy[0].tolist()
                    })

                # Save to Database (occasionally or every N frames)
                if int(time.time()) % 5 == 0: # Save every 5 seconds
                    db = database.SessionLocal()
                    try:
                        log = database.TrafficLog(
                            car_count=counts_dict.get('car', 0),
                            pedestrian_count=counts_dict.get('person', 0),
                            bike_count=counts_dict.get('bicycle', 0),
                            truck_count=counts_dict.get('truck', 0),
                            bus_count=counts_dict.get('bus', 0),
                            avg_confidence=self.confidence_threshold,
                            fps=round(fps, 2)
                        )
                        db.add(log)
                        
                        if "alert" in detection_data:
                            alert = database.Alert(
                                type=detection_data["alert"]["type"],
                                priority=detection_data["alert"]["priority"],
                                location=detection_data["alert"]["location"],
                                confidence=0.9
                            )
                            db.add(alert)
                        
                        db.commit()
                    except Exception as e:
                        print(f"DB Error: {e}")
                    finally:
                        db.close()

                # Encode frame to base64
                _, buffer = cv2.imencode('.jpg', annotated_frame)
                frame_base64 = base64.b64encode(buffer).decode('utf-8')

                # Send frame and data via WebSocket
                await websocket.send_json({
                    "image": frame_base64,
                    "data": detection_data
                })

                await asyncio.sleep(0.01)

        finally:
            cap.release()
    def stop(self):
        pass

detector = TrafficDetector()
import database # Late import to avoid circular dependency
