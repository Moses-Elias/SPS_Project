import json
data = [
    {
        "id": "C001",
        "title": "Introduction to Data Science",
        "category": "Data Science",
        "difficulty": "Beginner",
        "description": "Learn how to work with data, explore datasets, and use Python libraries like pandas and matplotlib."
    },
    {
        "id": "C002",
        "title": "Machine Learning Fundamentals",
        "category": "Data Science",
        "difficulty": "Intermediate",
        "description": "Understand supervised and unsupervised learning techniques using scikit-learn."
    },
    {
        "id": "C003",
        "title": "Web Development with HTML & CSS",
        "category": "Web Development",
        "difficulty": "Beginner",
        "description": "Build websites from scratch using HTML, CSS, and responsive design techniques."
    },
    {
        "id": "C004",
        "title": "JavaScript and DOM Manipulation",
        "category": "Web Development",
        "difficulty": "Intermediate",
        "description": "Learn how to make interactive websites with JavaScript and manipulate the DOM."
    },
    {
        "id": "C005",
        "title": "Basic Mathematics for Beginners",
        "category": "Mathematics",
        "difficulty": "Beginner",
        "description": "Understand numbers, arithmetic, and basic math concepts used in everyday life."
    },
    {
        "id": "C006",
        "title": "Calculus I: Limits and Derivatives",
        "category": "Mathematics",
        "difficulty": "Intermediate",
        "description": "Explore the core concepts of calculus including limits, derivatives, and their applications."
    }
]


# Convert to JSON string
json_data = json.dumps(data, indent=4)
print(json_data)
