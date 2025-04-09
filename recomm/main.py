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

        # Get all courses from DB
        courses = list(courses_collection.find({}, {"title": 1, "description": 1}))
        if not courses:
            return {"error": "No courses found in the database"}

        course_list = "\n".join(
            [f"- {c['title']}: {c.get('description', 'No description')}" for c in courses]
        )

        prompt = f"""
You are a helpful course recommender for an e-learning platform.

Here is a list of courses:
{course_list}

The user said they are interested in: "{user_input}"

Recommend 3 courses from the list that best match their interest. Only return course titles.
"""

        # Generate response from OpenAI API
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}]
        )

        reply = response.choices[0].message.content
        recommendations = [line.strip("- ") for line in reply.split("\n") if line.strip()]
        recommendations = recommendations[:3]  # Ensure 3 recommendations

        return {"recommended_courses": recommendations}

    except Exception as e:
        logging.error(f"Error: {str(e)}")
        return {"error": f"An error occurred: {str(e)}"}

@app.get("/")
def root():
    return {"message": "Server is running!"}
