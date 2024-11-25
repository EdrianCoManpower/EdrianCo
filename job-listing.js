import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  'https://dtxxdcrfsdgntufwjlab.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0eHhkY3Jmc2RnbnR1ZndqbGFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIxNDk0NjIsImV4cCI6MjA0NzcyNTQ2Mn0.oXINP_MH4CUDOiBmCz_GaZE_Q9lwGkvzi8qj2N-rXF4'
);

let currentPage = 1;
const jobsPerPage = 6;
let totalJobs = 0; // Track total number of jobs
let currentSortOrder = 'desc'; // Default to 'newest to oldest'

document.addEventListener('DOMContentLoaded', () => {
  // Fetch and display existing jobs from Supabase
async function loadJobs() {
    const { data: jobs, error, count } = await supabase
        .from('jobs')
        .select('*', { count: 'exact' }) // Get exact count of jobs
        .order('posted_date', { ascending: currentSortOrder === 'asc' }) // Sort by posted_date based on the current order
        .range((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage - 1); // Pagination logic

    if (error) {
        console.error('Error fetching jobs:', error);
        return;
    }

    totalJobs = count; // Set the total job count

    // Clear the existing job list in the UI before displaying the new jobs
    const jobsList = document.getElementById('jobsList');
    jobsList.innerHTML = '';

    if (jobs.length === 0) {
        // Display "No jobs available" if the list is empty
        jobsList.innerHTML = `<div class="no-jobs">No jobs available at the moment.</div>`;
    } else {
        // Display the jobs on the page
        jobs.forEach(job => {
            displayJob(job);
        });
    }

    // Update pagination controls
    updatePagination();
}




function displayJob(job) {
  const jobElement = document.createElement('div');
  jobElement.className = 'col-lg-4 mb-5';  // Ensure the card has the correct width
  jobElement.dataset.id = job.id; // Store the job ID for future reference
  
  jobElement.innerHTML = `
      <div class="job-content">
        <h3> Job Title: ${job.title}</h3>
        <p><strong>Description: </strong><span class="job-description"> ${job.description}</span></p>
        <p><strong>Location:</strong> <span class="job-location">${job.location}</span></p>
        <p><small>Posted on: ${new Date(job.posted_date).toLocaleString()}</small></p>
        ${job.jobLink ? `<p><a href="${job.jobLink}" target="_blank">Apply Now</a></p>` : ''}
      </div>
    
    `;

  // Append the new job to the jobs list on the page
  document.getElementById('jobsList').appendChild(jobElement);
}


  // Update pagination controls
  function updatePagination() {
    const totalPages = Math.ceil(totalJobs / jobsPerPage);
    const pageNumber = document.getElementById('page-number');

    // Update the page number text
    pageNumber.textContent = `Page ${currentPage} of ${totalPages}`;

    // Disable/Enable buttons based on current page and total jobs
    document.getElementById('prev-btn').disabled = currentPage === 1;
    document.getElementById('next-btn').disabled = currentPage >= totalPages;
  }

  // Handle "Previous" page button
  function prevPage() {
    if (currentPage > 1) {
      currentPage--;
      loadJobs(); // Reload jobs for the new page
    }
  }

  // Handle "Next" page button
  function nextPage() {
    const totalPages = Math.ceil(totalJobs / jobsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      loadJobs(); // Reload jobs for the new page
    }
  }

  // Call loadJobs to display existing jobs when the page is loaded
  loadJobs();

  // Toggle sort order when clicking the sort button
  document.getElementById('sortButton').addEventListener('click', () => {
    currentSortOrder = currentSortOrder === 'desc' ? 'asc' : 'desc';
    loadJobs(); // Reload jobs with the new sort order
  });

  // Expose the nextPage and prevPage functions globally for HTML to access
  window.nextPage = nextPage;
  window.prevPage = prevPage;
});
