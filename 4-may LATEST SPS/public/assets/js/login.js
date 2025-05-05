document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault(); // Prevent the form from reloading the page

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            // Store the token in localStorage or cookies
            localStorage.setItem("token", data.token);
            alert("Login successful!");
            window.location.href = "Dashboard.html"; // Redirect to a dashboard page after login
        } else {
            alert(data.msg); // Display any errors (e.g., "Invalid Credentials")
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong. Please try again.");
    }
});