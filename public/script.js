// Function to toggle between the login and sign-up forms
function toggleForm() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (loginForm.style.display === 'none') {
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
    } else {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
    }
}

// Form validation for Login
function validateLoginForm(event) {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!username || !password) {
        alert('Both fields are required.');
        event.preventDefault(); // Prevent form submission
    } else {
        // Optionally, you could do more validation here (e.g., check email format, password strength)
        console.log('Login successful');
    }
}

// Form validation for SignUp
function validateSignUpForm(event) {
    const newUsername = document.getElementById('new-username').value;
    const email = document.getElementById('email').value;
    const newPassword = document.getElementById('new-password').value;

    // Basic email format validation (simple regex)
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    if (!newUsername || !email || !newPassword) {
        alert('All fields are required.');
        event.preventDefault(); // Prevent form submission
    } else if (!emailPattern.test(email)) {
        alert('Please enter a valid email address.');
        event.preventDefault(); // Prevent form submission
    } else {
        // Optionally, you could add password strength validation or more
        console.log('Sign Up successful');
    }
}

// Add event listeners to the forms
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('#loginForm form');
    const signUpForm = document.querySelector('#signupForm form');

    // Handle form validation on submit
    if (loginForm) {
        loginForm.addEventListener('submit', validateLoginForm);
    }
    if (signUpForm) {
        signUpForm.addEventListener('submit', validateSignUpForm);
    }
});

/* Script For Populations*/
document.addEventListener('DOMContentLoaded', function() {
    // Get form and chart elements
    const form = document.getElementById('population-form');
    const populationList = document.getElementById('population-list');
    const ctx = document.getElementById('populationChart').getContext('2d');
    
    // Data structure to store population info
    let populationData = {
        male: 0,
        female: 0
    };
    
    // Create the initial chart
    let populationChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Male', 'Female'],
            datasets: [{
                data: [0, 0],
                backgroundColor: ['#FF0000', '#FFF5E1'],
                hoverOffset: 4
            }]
        }
    });

    // Handle form submission
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        // Get form data
        const animalId = document.getElementById('animal-id').value.trim();
        const gender = document.getElementById('animal-gender').value;
        const count = parseInt(document.getElementById('animal-count').value);

        if (animalId && !isNaN(count) && count > 0) {
            // Update population data
            if (gender === 'male') {
                populationData.male += count;
            } else {
                populationData.female += count;
            }

            // Update the chart data
            populationChart.data.datasets[0].data = [populationData.male, populationData.female];
            populationChart.update();

            // Add the new entry to the population list
            const listItem = document.createElement('li');
            listItem.textContent = `Animal ID: ${animalId} | Gender: ${gender} | Count: ${count}`;
            populationList.appendChild(listItem);

            // Reset the form
            form.reset();
        } else {
            alert('Please fill in all fields correctly!');
        }
    });
});

/*Health Script Code*/
document.getElementById("health-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form submission from reloading the page

    let animalId = document.getElementById("animal-id").value;

    // Simulated data (this can be replaced with actual data from the database later)
    let animalData = getAnimalHealthData(animalId);

    // If data is found, populate the table
    if (animalData) {
        populateHealthTable(animalData);
    } else {
        alert("Animal ID not found.");
    }
});

function getAnimalHealthData(animalId) {
    // This function simulates fetching data. Replace it with an API call or database query
    let sampleData = {
        "A001": {
            gender: "Female",
            health: "Good",
            breeding: "Yes",
            weight: 400,
            vaccinated: "Yes",
            avgHealthScore: 85,
            healthCost: 120,
            vetVisits: 2,
            age: 3
        },
        "A002": {
            gender: "Male",
            health: "Average",
            breeding: "No",
            weight: 350,
            vaccinated: "No",
            avgHealthScore: 75,
            healthCost: 80,
            vetVisits: 1,
            age: 4
        }
        // Add more animal IDs and data as needed
    };

    // Return data based on animal ID or null if not found
    return sampleData[animalId] || null;
}

function populateHealthTable(data) {
    let table = document.getElementById("health-table");
    let tbody = table.getElementsByTagName("tbody")[0];

    // Clear any existing rows
    tbody.innerHTML = "";

    // Create a new row with the animal data
    let row = tbody.insertRow();

    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    let cell4 = row.insertCell(3);
    let cell5 = row.insertCell(4);
    let cell6 = row.insertCell(5);
    let cell7 = row.insertCell(6);
    let cell8 = row.insertCell(7);
    let cell9 = row.insertCell(8);

    // Populate the cells with data
    cell1.textContent = data.gender;
    cell2.textContent = data.health;
    cell3.textContent = data.breeding;
    cell4.textContent = data.weight;
    cell5.textContent = data.vaccinated;
    cell6.textContent = data.avgHealthScore;
    cell7.textContent = data.healthCost;
    cell8.textContent = data.vetVisits;
    cell9.textContent = data.age;

    // Show the table
    table.style.display = "block";
}

/* Script gfpr the calender*/
// Store tasks in localStorage to persist them
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

document.addEventListener('DOMContentLoaded', function () {
    createCalendar();
    displayTasksForToday();
    addTaskFormListener();
});

// Create the calendar grid
function createCalendar() {
    const calendarContainer = document.getElementById('calendar');
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);

    // Create grid for the calendar
    for (let i = 1; i <= lastDay.getDate(); i++) {
        const taskDate = new Date(currentYear, currentMonth, i);
        const day = taskDate.getDay();
        const taskCell = document.createElement('div');
        
        taskCell.textContent = i;
        taskCell.dataset.date = taskDate.toISOString().split('T')[0]; // Store date in ISO format

        taskCell.addEventListener('click', function () {
            showTasksForDate(taskCell.dataset.date);
        });

        calendarContainer.appendChild(taskCell);
    }
}

// Show tasks for the selected day
function showTasksForDate(date) {
    const taskDetailList = document.getElementById('task-detail-list');
    taskDetailList.innerHTML = ''; // Clear the existing list

    const tasksForDate = tasks.filter(task => task.date === date);

    tasksForDate.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.innerHTML = `
            <span><strong>${task.name}</strong></span><br>
            <span>Gender: ${task.gender}</span><br>
            <span>Weight: ${task.weight}</span><br>
            <span>Vaccinated this season: ${task.vaccinated}</span><br>
            <span>Vet Visits: ${task.vetVisits}</span><br>
            <span>Age: ${task.age} years</span>
        `;
        taskDetailList.appendChild(taskItem);
    });
}

// Display tasks for today
function displayTasksForToday() {
    const today = new Date().toISOString().split('T')[0];
    showTasksForDate(today);
}

// Add new task to the list


/* Java for the food tracker*/
// Array to store the food items and their stock levels
let foodInventory = [];

// Function to update the inventory table and low stock list
function updateInventory() {
    const inventoryList = document.getElementById('inventory-list').getElementsByTagName('tbody')[0];
    const lowStockList = document.getElementById('low-stock-list');
    const lowStockWarning = document.getElementById('low-stock-warning');

    // Clear the current lists
    inventoryList.innerHTML = '';
    lowStockList.innerHTML = '';
    lowStockWarning.innerHTML = ''; // Clear the low stock warning section

    let lowStockMessage = '';

    // Loop through the food inventory to create table rows and check low stock
    foodInventory.forEach(foodItem => {
        // Create table row for food inventory
        const inventoryRow = document.createElement('tr');
        inventoryRow.innerHTML = `
            <td>${foodItem.name}</td>
            <td>${foodItem.stockLevel}</td>
        `;
        inventoryList.appendChild(inventoryRow);

        // Check if stock level is below 10 and add to low stock list
        if (foodItem.stockLevel < 10) {
            const lowStockItem = document.createElement('li');
            lowStockItem.textContent = `${foodItem.name}: ${foodItem.stockLevel} units`;
            lowStockList.appendChild(lowStockItem);

            // Add warning message for each item that is low on stock
            lowStockMessage += `${foodItem.name} stock is running low: ${foodItem.stockLevel} units left.<br>`;
        }
    });

    // Display the low stock warning if there are any items with stock below 10
    if (lowStockMessage) {
        lowStockWarning.innerHTML = lowStockMessage;
    } else {
        lowStockWarning.innerHTML = 'All items have sufficient stock.';
    }
}

// Handle the form submission
document.getElementById('food-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Get the food name and stock level from the form
    const foodName = document.getElementById('food-name').value.trim();
    const stockLevel = parseInt(document.getElementById('stock-level').value, 10);

    // Basic validation for input
    if (!foodName || isNaN(stockLevel) || stockLevel < 0) {
        alert('Please enter valid food name and stock level.');
        return;
    }

    // Add the food item to the inventory
    foodInventory.push({
        name: foodName,
        stockLevel: stockLevel
    });

    // Clear the form fields
    document.getElementById('food-name').value = '';
    document.getElementById('stock-level').value = '';

    // Update the inventory list and low stock list
    updateInventory();

    
        async function getRecommendations() {
            const userInput = document.getElementById("interest-input").value;
            const resultDiv = document.getElementById("recommendation-result");
            resultDiv.innerHTML = "Loading...";

            try {
                const response = await fetch("http://127.0.0.1:8000/ai-recommend/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ user_input: userInput })
                });

                const data = await response.json();

                if (data.recommended_courses) {
                    resultDiv.innerHTML = "<h3>Recommended Courses:</h3>";
                    data.recommended_courses.forEach(course => {
                        const div = document.createElement("div");
                        div.className = "recommended-course";
                        div.textContent = course;
                        resultDiv.appendChild(div);
                    });
                } else {
                    resultDiv.innerHTML = `<p style="color: red;">${data.error || "No recommendations found."}</p>`;
                }

            } catch (error) {
                resultDiv.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
            }
        }
    
});

