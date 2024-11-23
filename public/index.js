import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  'https://dtxxdcrfsdgntufwjlab.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0eHhkY3Jmc2RnbnR1ZndqbGFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIxNDk0NjIsImV4cCI6MjA0NzcyNTQ2Mn0.oXINP_MH4CUDOiBmCz_GaZE_Q9lwGkvzi8qj2N-rXF4'
);

document.addEventListener('DOMContentLoaded', () => {
    // Function to load jobs
    async function loadJobs() {
      try {
          // Fetch all jobs
          const { data: jobs, error } = await supabase
              .from('jobs')
              .select('*');
  
          if (error) {
              console.error('Error fetching jobs:', error);
              return;
          }
  
          if (!jobs || jobs.length === 0) {
              document.getElementById('jobsList').innerHTML = `<div class="no-jobs">No jobs available at the moment.</div>`;
              return;
          }
  
          // Shuffle jobs randomly
          const shuffledJobs = jobs.sort(() => Math.random() - 0.5);
  
          // Limit to 3 random jobs
          const featuredJobs = shuffledJobs.slice(0, 3);
  
          // Display the jobs
          document.getElementById('jobsList').innerHTML = ''; // Clear previous content
          featuredJobs.forEach(job => displayJob(job));
      } catch (err) {
          console.error('Unexpected error:', err);
      }
  }
  

    // Function to display a single job
    function displayJob(job) {
        const jobElement = document.createElement('div');
        jobElement.className = 'job-item';
        jobElement.dataset.id = job.id; // Store the job ID for future reference

        jobElement.innerHTML = `
            <div class="job-content">
                <h3>${job.title}</h3>
                <p><strong>Description:</strong> <span class="job-description">${job.description}</span></p>
                <p><strong>Location:</strong> <span class="job-location">${job.location}</span></p>
                <p><small>Posted on: ${new Date(job.posted_date).toLocaleString()}</small></p>
            </div>
        `;

        // Append the job to the jobs list container
        document.getElementById('jobsList').appendChild(jobElement);
    }

    // Load jobs when the page is loaded
    loadJobs();
});
