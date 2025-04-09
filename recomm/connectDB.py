from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["elearning"]
courses = db["courses"]

courses.insert_many([
    {
        "title": "Quantum Mechanics",
        "description": "Learn the basics of quantum physics and particle behavior."
    },
    {
        "title": "Physics for Beginners",
        "description": "Covers Newton's laws and classical mechanics."
    },
    {
        "title": "Data Structures",
        "description": "Learn about arrays, linked lists, and trees."
    },
    {
        "title": "Introduction to Python",
        "description": "A beginner-friendly programming course."
    },
    {
        "title": "Calculus I",
        "description": "Fundamentals of derivatives and integrals."
    }
])
