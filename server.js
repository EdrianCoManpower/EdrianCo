require('dotenv').config();
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const bodyParser = require('body-parser');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;  // Use env variable
const supabaseKey = process.env.SUPABASE_KEY;  // Use env variable
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Set up body parser to handle JSON requests
app.use(bodyParser.json());

// Serve static files from the 'public' folder
app.use(express.static('public'));

// Serve the index.html file on root route
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Serve a login form on the /login route
app.get('/login', (req, res) => {
    res.send(`
        <h1>Login Page</h1>
        <form action="/login" method="POST">
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required><br>
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required><br>
            <button type="submit">Login</button>
        </form>
    `);
});

// Handle login functionality using Supabase
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Attempt to log in with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Login successful', user: data.user });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

// Global error handlers
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err, origin) => {
    console.error('Uncaught Exception thrown:', err);
});
