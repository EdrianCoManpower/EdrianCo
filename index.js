
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
                    document.getElementById('jobsList').innerHTML = `
                        <div class="no-jobs">No jobs available at the moment.</div>`;
                    return;
                }

                // Shuffle jobs randomly and limit to 4
                const featuredJobs = jobs.sort(() => Math.random() - 0.5).slice(0, 3);

                // Clear previous content
                document.getElementById('jobsList').innerHTML = '';

                // Render each job
                featuredJobs.forEach(job => displayJob(job));
            } catch (err) {
                console.error('Unexpected error:', err);
            }
        }

        // Function to display a single job
        function displayJob(job) {
            const jobElement = document.createElement('div');
            jobElement.className = 'col-lg-4 mb-5';  // Ensure the card has the correct width

            jobElement.innerHTML = `
                <div class="card h-100 shadow border-0">
                    <div class="card-body p-4">
                        <a class="text-decoration-none link-dark stretched-link" href="#!">
                            <h5 class="card-title mb-3">${job.title}</h5>
                        </a>
                        <p class="card-text mb-0">${job.description}</p>
                    </div>
                    <div class="card-footer p-4 pt-0 bg-transparent border-top-0">
                        <div class="d-flex align-items-end justify-content-between">
                            <div class="d-flex align-items-center">
                                <div class="small">
                                    <p class="fw-bold"> Location: ${job.location}</p>
                                    <div class="text-muted">Posted on: ${new Date(job.posted_date).toLocaleDateString()}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            document.getElementById('jobsList').appendChild(jobElement);
        }

        // Load jobs on page load
        loadJobs();
    });

