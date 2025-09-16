from fastapi import FastAPI, APIRouter, HTTPException, Depends, Response, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone, timedelta
import socketio
import os
import logging
import uuid
from pathlib import Path
from bson import ObjectId
import requests

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Socket.IO setup for real-time features
sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins="*",
    logger=True
)
socket_app = socketio.ASGIApp(sio, app)

# Pydantic Models
class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, field_schema):
        field_schema.update(type="string")

class User(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    email: str
    name: str
    username: str
    avatar: Optional[str] = ""  # base64 encoded image
    bio: Optional[str] = ""
    external_link: Optional[str] = ""
    follower_count: int = 0
    following_count: int = 0
    rooms: List[PyObjectId] = []
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    session_token: Optional[str] = None
    session_expires: Optional[datetime] = None

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class UserCreate(BaseModel):
    username: str
    bio: Optional[str] = ""
    external_link: Optional[str] = ""

class UserUpdate(BaseModel):
    username: Optional[str] = None
    bio: Optional[str] = None
    external_link: Optional[str] = None
    avatar: Optional[str] = None

class Room(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    user_id: PyObjectId
    name: str
    color: str
    post_count: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class RoomCreate(BaseModel):
    name: str
    color: str

class Post(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    user_id: PyObjectId
    room_id: PyObjectId
    title: str
    description: str
    media: Optional[str] = ""  # base64 encoded
    media_type: Optional[str] = "image"  # "image" or "video"
    tags: List[str] = []
    external_link: Optional[str] = ""
    recommendation_type: str  # "recommend" or "not_recommend"
    action_type: str  # "buy", "listen", "watch", "read"
    like_count: int = 0
    comment_count: int = 0
    repost_count: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class PostCreate(BaseModel):
    room_id: str
    title: str
    description: str
    media: Optional[str] = ""
    media_type: Optional[str] = "image"
    tags: List[str] = []
    external_link: Optional[str] = ""
    recommendation_type: str
    action_type: str

class Follow(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    follower_id: PyObjectId
    following_id: PyObjectId
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class Like(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    user_id: PyObjectId
    post_id: PyObjectId
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class Comment(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    user_id: PyObjectId
    post_id: PyObjectId
    content: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class CommentCreate(BaseModel):
    post_id: str
    content: str

class Message(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    sender_id: PyObjectId
    receiver_id: PyObjectId
    content: str
    media: Optional[str] = ""
    message_type: str = "text"  # "text" or "image"
    read: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class MessageCreate(BaseModel):
    receiver_id: str
    content: str
    media: Optional[str] = ""
    message_type: str = "text"

# Authentication helper functions
async def get_current_user(request: Request) -> User:
    """Get current user from session token (cookie or header)"""
    # First check for session token in cookies
    session_token = request.cookies.get("session_token")
    
    # Fallback to Authorization header
    if not session_token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            session_token = auth_header.split("Bearer ")[1]
    
    if not session_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    # Find user with valid session
    user_doc = await db.users.find_one({
        "session_token": session_token,
        "session_expires": {"$gt": datetime.now(timezone.utc)}
    })
    
    if not user_doc:
        raise HTTPException(status_code=401, detail="Session expired or invalid")
    
    return User(**user_doc)

# Authentication endpoints
@api_router.post("/auth/process-session")
async def process_session(request: Request, response: Response):
    """Process session ID from Emergent Auth"""
    data = await request.json()
    session_id = data.get("session_id")
    
    if not session_id:
        raise HTTPException(status_code=400, detail="Session ID required")
    
    # Call Emergent Auth API to get user data
    try:
        headers = {"X-Session-ID": session_id}
        auth_response = requests.get(
            "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
            headers=headers
        )
        auth_response.raise_for_status()
        user_data = auth_response.json()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid session: {str(e)}")
    
    # Check if user exists
    existing_user = await db.users.find_one({"email": user_data["email"]})
    
    if existing_user:
        # Update session for existing user
        session_token = user_data["session_token"]
        session_expires = datetime.now(timezone.utc) + timedelta(days=7)
        
        await db.users.update_one(
            {"email": user_data["email"]},
            {
                "$set": {
                    "session_token": session_token,
                    "session_expires": session_expires
                }
            }
        )
        user = User(**existing_user)
    else:
        # Create new user
        session_token = user_data["session_token"]
        session_expires = datetime.now(timezone.utc) + timedelta(days=7)
        
        # Generate unique username
        base_username = user_data["name"].lower().replace(" ", "")
        username = base_username
        counter = 1
        while await db.users.find_one({"username": username}):
            username = f"{base_username}{counter}"
            counter += 1
        
        new_user = User(
            email=user_data["email"],
            name=user_data["name"],
            username=username,
            avatar=user_data.get("picture", ""),
            session_token=session_token,
            session_expires=session_expires
        )
        
        result = await db.users.insert_one(new_user.dict(by_alias=True, exclude={"id"}))
        new_user.id = result.inserted_id
        user = new_user
    
    # Set session cookie
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=False,  # Set to True in production with HTTPS
        samesite="lax",
        max_age=7 * 24 * 60 * 60,  # 7 days
        path="/"
    )
    
    return {
        "user": {
            "id": str(user.id),
            "email": user.email,
            "name": user.name,
            "username": user.username,
            "avatar": user.avatar,
            "bio": user.bio,
            "external_link": user.external_link,
            "follower_count": user.follower_count,
            "following_count": user.following_count
        },
        "session_token": session_token
    }

@api_router.post("/auth/logout")
async def logout(response: Response, current_user: User = Depends(get_current_user)):
    """Logout current user"""
    # Clear session from database
    await db.users.update_one(
        {"_id": current_user.id},
        {"$unset": {"session_token": "", "session_expires": ""}}
    )
    
    # Clear cookie
    response.delete_cookie(key="session_token", path="/")
    
    return {"message": "Logged out successfully"}

@api_router.get("/auth/me")
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user information"""
    return {
        "id": str(current_user.id),
        "email": current_user.email,
        "name": current_user.name,
        "username": current_user.username,
        "avatar": current_user.avatar,
        "bio": current_user.bio,
        "external_link": current_user.external_link,
        "follower_count": current_user.follower_count,
        "following_count": current_user.following_count
    }

# User endpoints
@api_router.put("/users/profile")
async def update_profile(user_update: UserUpdate, current_user: User = Depends(get_current_user)):
    """Update current user's profile"""
    update_data = {}
    
    if user_update.username:
        # Check if username is already taken
        existing = await db.users.find_one({
            "username": user_update.username,
            "_id": {"$ne": current_user.id}
        })
        if existing:
            raise HTTPException(status_code=400, detail="Username already taken")
        update_data["username"] = user_update.username
    
    if user_update.bio is not None:
        update_data["bio"] = user_update.bio
    
    if user_update.external_link is not None:
        update_data["external_link"] = user_update.external_link
    
    if user_update.avatar is not None:
        update_data["avatar"] = user_update.avatar
    
    if update_data:
        await db.users.update_one(
            {"_id": current_user.id},
            {"$set": update_data}
        )
    
    # Return updated user
    updated_user = await db.users.find_one({"_id": current_user.id})
    return {
        "id": str(updated_user["_id"]),
        "email": updated_user["email"],
        "name": updated_user["name"],
        "username": updated_user["username"],
        "avatar": updated_user["avatar"],
        "bio": updated_user["bio"],
        "external_link": updated_user["external_link"],
        "follower_count": updated_user["follower_count"],
        "following_count": updated_user["following_count"]
    }

@api_router.get("/users/{username}")
async def get_user_by_username(username: str):
    """Get user by username"""
    user = await db.users.find_one({"username": username})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "id": str(user["_id"]),
        "name": user["name"],
        "username": user["username"],
        "avatar": user["avatar"],
        "bio": user["bio"],
        "external_link": user["external_link"],
        "follower_count": user["follower_count"],
        "following_count": user["following_count"]
    }

# Room endpoints
@api_router.post("/rooms")
async def create_room(room_data: RoomCreate, current_user: User = Depends(get_current_user)):
    """Create a new room"""
    room = Room(
        user_id=current_user.id,
        name=room_data.name,
        color=room_data.color
    )
    
    result = await db.rooms.insert_one(room.dict(by_alias=True, exclude={"id"}))
    room.id = result.inserted_id
    
    # Add room to user's rooms list
    await db.users.update_one(
        {"_id": current_user.id},
        {"$push": {"rooms": room.id}}
    )
    
    return {
        "id": str(room.id),
        "name": room.name,
        "color": room.color,
        "post_count": room.post_count,
        "created_at": room.created_at.isoformat()
    }

@api_router.get("/rooms/my")
async def get_my_rooms(current_user: User = Depends(get_current_user)):
    """Get current user's rooms"""
    rooms = await db.rooms.find({"user_id": current_user.id}).to_list(100)
    
    return [
        {
            "id": str(room["_id"]),
            "name": room["name"],
            "color": room["color"],
            "post_count": room["post_count"],
            "created_at": room["created_at"].isoformat()
        }
        for room in rooms
    ]

@api_router.get("/users/{username}/rooms")
async def get_user_rooms(username: str):
    """Get rooms for a specific user"""
    user = await db.users.find_one({"username": username})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    rooms = await db.rooms.find({"user_id": user["_id"]}).to_list(100)
    
    return [
        {
            "id": str(room["_id"]),
            "name": room["name"],
            "color": room["color"],
            "post_count": room["post_count"],
            "created_at": room["created_at"].isoformat()
        }
        for room in rooms
    ]

# Basic health check
@api_router.get("/")
async def root():
    return {"message": "i-Recommend API is running"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now(timezone.utc).isoformat()}

# Include the router in the main app
app.include_router(api_router)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

# Socket.IO events for real-time features (Phase 4)
@sio.event
async def connect(sid, environ):
    logger.info(f"Client {sid} connected")

@sio.event
async def disconnect(sid):
    logger.info(f"Client {sid} disconnected")

# Export the ASGI app for uvicorn
asgi_app = socket_app