# AI-Based Real-Time Traffic Object Detection System

This is a complete AI-powered real-time traffic monitoring and object detection web application. It uses YOLOv8 for detecting multiple road objects (cars, pedestrians, bikes, etc.) and provides a modern, dark-themed dashboard for traffic management.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Framer Motion, Recharts, Lucide Icons.
- **Backend**: FastAPI, WebSockets, Python, YOLOv8 (Ultralytics), OpenCV.
- **Database**: SQLite (SQLAlchemy).

## Features

- **Live Camera Feed**: Real-time video processing with YOLOv8 bounding boxes.
- **Object Counting**: Live counters for cars, pedestrians, bikes, and trucks.
- **Smart Alerts**: Automated detection of high-density or unsafe conditions.
- **Analytics**: Historical traffic data visualization with charts.
- **Secure Login**: Modern glassmorphism UI for Traffic Authorities and Operators.

## Installation & Running

### 1. Prerequisites
- Python 3.8+
- Node.js & npm

### 2. Backend Setup
1. Open a terminal in the `backend` folder.
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the FastAPI server:
   ```bash
   python main.py
   ```
   The backend will run on `http://localhost:8000`.

### 3. Frontend Setup
1. Open a terminal in the `frontend` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the Vite development server:
   ```bash
   npm run dev
   ```
   Open the provided local URL (usually `http://localhost:5173`) in your browser.

### 4. Login Credentials
- **Username**: `admin`
- **Password**: `admin`

## Project Structure

```
traffic_detection/
├── backend/
│   ├── main.py        # FastAPI Entry Point
│   ├── vision.py      # YOLOv8 & OpenCV Logic
│   ├── database.py    # SQLite Models
│   ├── auth.py        # Authentication Utils
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── App.jsx
    │   └── main.jsx
    ├── tailwind.config.js
    └── package.json
```
