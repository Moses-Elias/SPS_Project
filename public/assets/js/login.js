// Handle the login form submission
document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();  // Prevent the default form submission

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Send the login request to the backend
    fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            password
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.token) {
                console.log('Logged in successfully:', data.token);
                // Store the token in localStorage or sessionStorage
                localStorage.setItem('token', data.token);
                // Redirect or handle success
                window.location.href = 'Home Page.html';  // Redirect to home page or dashboard
            } else {
                alert(data.msg);  // Show error message
            }
        })
        .catch(err => {
            console.error('Error during login:', err);
        });
});
