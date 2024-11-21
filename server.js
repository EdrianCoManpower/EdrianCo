require('dotenv').config();  // Load environment variables

const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const bodyParser = require('body-parser');

// Initialize Supabase client using environment variables
const supabaseUrl = process.env.SUPABASE_URL;  
const supabaseKey = process.env.SUPABASE_KEY;  
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
