from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)

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
        user_id = data.get("user_id")  # For storing preferences later

        if not user_input:
            return {"error": "No user input provided"}

        courses = list(courses_collection.find({}, {"title": 1, "description": 1}))
        if not courses:
            return {"error": "No courses found in the database"}

        corpus = [f"{c['title']} {c.get('description', '')}" for c in courses]
        vectorizer = TfidfVectorizer()
        tfidf_matrix = vectorizer.fit_transform(corpus + [user_input])

        similarities = cosine_similarity(tfidf_matrix[-1], tfidf_matrix[:-1]).flatten()
        sorted_indices = similarities.argsort()[::-1]

        top_courses = []
        for idx in sorted_indices[:3]:
            if similarities[idx] > 0:
                top_courses.append(courses[idx]["title"])

        # Save user interest to MongoDB
        if user_id:
            db["user_profiles"].update_one(
                {"user_id": user_id},
                {"$addToSet": {"interests": user_input}},
                upsert=True
            )

        return {"recommended_courses": top_courses or ["No relevant courses found"]}

    except Exception as e:
        logging.error(f"Error: {str(e)}")
        return {"error": f"An error occurred: {str(e)}"}
    
@app.post("/user/start-course/")
async def start_course(request: Request):
    try:
        data = await request.json()
        user_id = data.get("user_id")
        course_title = data.get("course_title")

        if not user_id or not course_title:
            return {"error": "Missing user_id or course_title"}

        db["user_profiles"].update_one(
            {"user_id": user_id},
            {"$addToSet": {"history": course_title}},
            upsert=True
        )

        return {"message": "Course added to user history"}

    except Exception as e:
        logging.error(f"Error in start_course: {str(e)}")
        return {"error": "Failed to update course history"}
