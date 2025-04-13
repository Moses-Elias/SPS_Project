from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from pymongo import MongoClient
from dotenv import load_dotenv
import os
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)

# Load environment variables from .env file
load_dotenv()

# Debug print to confirm if API key is loading
api_key = os.getenv("OPENAI_API_KEY")
print("Loaded API key:", api_key)

if not api_key:
    raise ValueError("OPENAI_API_KEY not found in .env file")

# Initialize OpenAI client
client = OpenAI(api_key=api_key)

# MongoDB setup
mongo_client = MongoClient("mongodb://localhost:27017/")
db = mongo_client["elearning"]
courses_collection = db["courses"]

# FastAPI app
app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # React dev server
        "http://localhost:5500",  # Local static HTML server
        "http://127.0.0.1:5500"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/ai-recommend/")
async def ai_recommendation(request: Request):
    try:
        data = await request.json()
        user_input = data.get("user_input")
        if not user_input:
            return {"error": "No user input provided"}

        # Get courses
        courses = list(courses_collection.find({}, {"title": 1, "description": 1}))
        if not courses:
            return {"error": "No courses found in the database"}

        print("Courses from DB:", courses)
        print("User input:", user_input)

        # Preprocess input
        user_keywords = set(user_input.lower().split())

        # Score courses by keyword match
        def score_course(course):
            text = f"{course.get('title', '')} {course.get('description', '')}".lower()
            return sum(1 for word in user_keywords if word in text)

        scored_courses = sorted(
            courses,
            key=lambda c: score_course(c),
            reverse=True
        )

        top_courses = [course['title'] for course in scored_courses if score_course(course) > 0][:3]

        return {
            "recommended_courses": top_courses or ["No relevant courses found"]
        }

    except Exception as e:
        logging.error(f"Error: {str(e)}")
        return {"error": f"An error occurred: {str(e)}"}

