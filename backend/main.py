from fastapi import FastAPI, WebSocket, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from . import database, auth, vision
import uvicorn
import asyncio

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

@app.get("/")
def read_root():
    return {"message": "AI Traffic Detection System API"}

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

@app.websocket("/ws/stream")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        await vision.detector.detect_stream(websocket)
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        vision.detector.stop()

@app.get("/api/analytics")
async def get_analytics(db: Session = Depends(database.SessionLocal)):
    # Return mock analytics data for now
    return {
        "today_stats": {
            "cars": 452,
            "pedestrians": 124,
            "bikes": 58,
            "trucks": 42
        },
        "hourly_data": [
            {"hour": "08:00", "count": 20},
            {"hour": "09:00", "count": 45},
            {"hour": "10:00", "count": 30},
            {"hour": "11:00", "count": 25},
            {"hour": "12:00", "count": 40},
            {"hour": "13:00", "count": 55},
        ]
    }

@app.get("/api/alerts")
async def get_alerts():
    return [
        {"id": 1, "time": "10:30 AM", "type": "High Density", "priority": "High", "location": "Camera 01"},
        {"id": 2, "time": "11:15 AM", "type": "Unauthorized Blockage", "priority": "Medium", "location": "Camera 03"},
    ]

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
