from fastapi import FastAPI, WebSocket, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
import database, auth, vision
import uvicorn
import asyncio
import os

app = FastAPI(title="AI Traffic Detection API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize DB on startup
@app.on_event("startup")
def startup():
    database.init_db()

@app.post("/token")
async def login(form_data: dict):
    # Dummy login for MVP
    if form_data.get("username") == "admin" and form_data.get("password") == "admin":
        access_token = auth.create_access_token(data={"sub": "admin", "role": "authority"})
        return {"access_token": access_token, "token_type": "bearer", "role": "authority"}
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Incorrect username or password",
        headers={"WWW-Authenticate": "Bearer"},
    )

@app.websocket("/ws/stream/{camera_id}")
async def websocket_endpoint(websocket: WebSocket, camera_id: int):
    await websocket.accept()
    sources = {
        1: "user_traffic.mp4",
        2: "camera_2.mp4",
        3: "camera_3.mp4",
        4: "camera_4.mp4"
    }
    video_source = sources.get(camera_id, "user_traffic.mp4")
    try:
        await vision.detector.detect_stream(websocket, video_source=video_source)
    except Exception as e:
        print(f"WebSocket error on camera {camera_id}: {e}")
    finally:
        vision.detector.stop()

@app.get("/api/analytics")
async def get_analytics(db: Session = Depends(database.get_db)):
    logs = db.query(database.TrafficLog).order_by(database.TrafficLog.timestamp.desc()).limit(10).all()
    
    # Format for charts
    return {
        "today_stats": {
            "cars": sum([l.car_count for l in logs]) if logs else 0,
            "pedestrians": sum([l.pedestrian_count for l in logs]) if logs else 0,
            "bikes": sum([l.bike_count for l in logs]) if logs else 0,
            "trucks": sum([l.truck_count for l in logs]) if logs else 0
        },
        "hourly_data": [{"hour": l.timestamp.strftime("%H:%M"), "count": l.car_count} for l in reversed(logs)]
    }

@app.get("/api/alerts")
async def get_alerts(db: Session = Depends(database.get_db)):
    alerts = db.query(database.Alert).order_by(database.Alert.timestamp.desc()).limit(5).all()
    return [{
        "id": a.id,
        "time": a.timestamp.strftime("%H:%M"),
        "type": a.type,
        "priority": a.priority,
        "msg": a.msg,
        "location": a.location
    } for a in alerts]

@app.get("/api/reports")
async def get_reports(db: Session = Depends(database.get_db)):
    logs = db.query(database.TrafficLog).order_by(database.TrafficLog.timestamp.desc()).limit(50).all()
    return [{
        "id": l.id,
        "timestamp": l.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
        "cars": l.car_count,
        "pedestrians": l.pedestrian_count,
        "trucks": l.truck_count,
        "fps": l.fps
    } for l in logs]

# Mount frontend static files
# We check multiple possible locations depending on how it's deployed
frontend_path = os.path.join(os.path.dirname(__file__), "static")
if not os.path.exists(frontend_path):
    frontend_path = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")

if os.path.exists(frontend_path):
    app.mount("/", StaticFiles(directory=frontend_path, html=True), name="frontend")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
