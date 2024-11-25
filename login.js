import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js';

// Initialize Supabase client with your Supabase URL and anon key
const supabase = createClient(
    'https://dtxxdcrfsdgntufwjlab.supabase.co', // Replace with your Supabase URL
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0eHhkY3Jmc2RnbnR1ZndqbGFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIxNDk0NjIsImV4cCI6MjA0NzcyNTQ2Mn0.oXINP_MH4CUDOiBmCz_GaZE_Q9lwGkvzi8qj2N-rXF4' // Replace with your Supabase anon key
);

// Listen for the form submission event
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent the form from submitting and refreshing the page

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        // Use Supabase to authenticate the user with email and password
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        // Check if there was an error
        if (error) {
            alert('You are not authorized to access this page.');
            return;
        }

        // Check if the user is an admin (you can add logic for your admin check here)
        if (data) {
            // Assuming the user has a "role" field in the user metadata (you should set this up in your Supabase project)
            const user = data.user;
            if (user && user.email === email) {
                // Login is successful, redirect to the admin dashboard page
                window.location.href = '/managejobs.html'; // Redirect to the admin panel or dashboard
            } else {
                // In case the user is not an admin (you could perform a check based on user metadata or email)
                alert('You are not authorized to access this page.');
            }
        }
    } catch (error) {
        console.error('Error:', error);
        // Display a generic error message if something goes wrong
        alert('Something went wrong! Please try again later.');
    }
});
