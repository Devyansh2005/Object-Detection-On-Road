from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import datetime

SQL_DATABASE_URL = "sqlite:///./traffic_system_v2.db"

engine = create_engine(SQL_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String) # 'authority' or 'operator'

class Alert(Base):
    __tablename__ = "alerts"
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    type = Column(String) # 'High density', 'Congestion', etc.
    priority = Column(String) # 'High', 'Medium', 'Low'
    msg = Column(String)
    location = Column(String)
    confidence = Column(Float)
    acknowledged = Column(Integer, default=0)

class TrafficLog(Base):
    __tablename__ = "traffic_logs"
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    car_count = Column(Integer)
    pedestrian_count = Column(Integer)
    bike_count = Column(Integer)
    truck_count = Column(Integer)
    bus_count = Column(Integer)
    avg_confidence = Column(Float)
    fps = Column(Float)

def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
