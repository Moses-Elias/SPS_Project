document.getElementById("registerForm").addEventListener("submit", async function (e) {
    e.preventDefault(); // Prevent the form from reloading the page

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    try {
        const response = await fetch("http://localhost:5000/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password,
                role: role, // e.g., 'student' or 'teacher'
            }),
        });

        const data = await response.json();

        if (response.ok) {
            alert("Registration successful!");
            window.location.href = "Dashboard.html"; // Redirect after successful registration
        } else {
            alert(data.msg); // Show any error message
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong. Please try again.");
    }
});
