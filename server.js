// 1. Import necessary dependencies
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const bodyParser = require('body-parser');

// 2. Initialize Supabase client
const supabaseUrl = 'https://dtxxdcrfsdgntufwjlab.supabase.co';  // Replace with your actual Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0eHhkY3Jmc2RnbnR1ZndqbGFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIxNDk0NjIsImV4cCI6MjA0NzcyNTQ2Mn0.oXINP_MH4CUDOiBmCz_GaZE_Q9lwGkvzi8qj2N-rXF4';  // Replace with your actual Supabase anon key
const supabase = createClient(supabaseUrl, supabaseKey);

// 3. Initialize Express app
const app = express();
const port = 3000;

// 4. Set up body parser to handle JSON requests
app.use(bodyParser.json());

// 5. Define a route for the root
app.get('/', (req, res) => {
    res.send('<h1>Welcome to the Home Page</h1>');
});

// 6. Define a route for the login page
app.get('/login', (req, res) => {
    res.send('<h1>Login Page</h1>');
});

// 7. Define a route to handle login functionality (using Supabase authentication)
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

// 8. Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

// 9. Global error handlers
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
