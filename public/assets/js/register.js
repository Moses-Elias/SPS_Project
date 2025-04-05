// Handle signup form submission
document.getElementById('signupFormElement').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent the form from submitting the traditional way

    const username = document.getElementById('new-username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('new-password').value;

    // Send data to the backend using fetch
    try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
        });

        const data = await response.json();
        if (response.ok) {
            alert('Signup successful!');
            // Optionally, you can automatically switch to the login form here
            toggleForm();
        } else {
            alert(data.msg || 'Something went wrong!');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong!');
    }
});
