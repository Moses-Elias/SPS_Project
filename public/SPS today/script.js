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

