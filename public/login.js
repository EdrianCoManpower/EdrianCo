// Listen for the form submission event
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent the form from submitting and refreshing the page

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        // Send login data to the backend (Node.js server)
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        // Check if the response was successful
        if (response.ok) {
            // Login is successful, redirect to dashboard.html
            window.location.href = '/managejobs.html'; // This redirects the user
        } else {
            // If the login fails, display an error message
            alert('Login failed: ' + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong! Please try again later.');
    }
});
