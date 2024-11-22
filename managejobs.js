import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  'https://dtxxdcrfsdgntufwjlab.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0eHhkY3Jmc2RnbnR1ZndqbGFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIxNDk0NjIsImV4cCI6MjA0NzcyNTQ2Mn0.oXINP_MH4CUDOiBmCz_GaZE_Q9lwGkvzi8qj2N-rXF4'
);

let currentPage = 1;
const jobsPerPage = 4;
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

    // Display the jobs on the page
    jobs.forEach(job => {
      displayJob(job);
    });

    // Update pagination controls
    updatePagination();
  }

// Function to display a job
function displayJob(job) {
    const jobElement = document.createElement('div');
    jobElement.className = 'job-item';
    jobElement.dataset.id = job.id; // Store the job ID for future reference
  
    jobElement.innerHTML = `
      <div class="job-content">
        <h3>${job.title}</h3>
        <p><strong>Description: </strong><span class="job-description">${job.description}</span></p>
        <p><strong>Location:</strong> <span class="job-location">${job.location}</span></p>
        <p><small>Posted on: ${new Date(job.posted_date).toLocaleString()}</small></p>
        ${job.jobLink ? `<p><a href="${job.jobLink}" target="_blank">Apply Now</a></p>` : ''}
      </div>
      <div class="job-buttons">
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      </div>
    `;
  
    // Handle the Delete Button click
    const deleteButton = jobElement.querySelector('.delete-btn');
    deleteButton.addEventListener('click', async function () {
      const confirmDelete = confirm('Are you sure you want to delete this job?');
      if (!confirmDelete) return;
  
      try {
        // Delete job from Supabase by ID
        const { error } = await supabase
          .from('jobs')
          .delete()
          .eq('id', job.id); // Use the job's ID to delete it
  
        if (error) throw error;
  
        // Remove the job element from the page
        jobElement.remove();
  
        // Adjust the current page if necessary
        const totalPages = Math.ceil((totalJobs - 1) / jobsPerPage);
        if (currentPage > totalPages) {
          currentPage = totalPages; // Move to the last valid page
        }
  
        // Reload the jobs to ensure consistent pagination
        loadJobs();
      } catch (err) {
        console.error('Error deleting job:', err);
      }
    });
  
    // Handle the Edit Button click
    const editButton = jobElement.querySelector('.edit-btn');
    const jobContent = jobElement.querySelector('.job-content');
    const jobTitle = jobContent.querySelector('h3');
    const jobDescription = jobContent.querySelector('.job-description');
    const jobLocation = jobContent.querySelector('.job-location');
  
    let isEditing = false;
  
    editButton.addEventListener('click', async () => {
      if (isEditing) {
        // If we are in editing mode, save the updated job to the database
        const updatedTitle = jobContent.querySelector('.edit-title').value;
        const updatedDescription = jobContent.querySelector('.edit-description').value;
        const updatedLocation = jobContent.querySelector('.edit-location').value;
  
        try {
          // Save the updates to Supabase
          const { error } = await supabase
            .from('jobs')
            .update({
              title: updatedTitle,
              description: updatedDescription,
              location: updatedLocation,
            })
            .eq('id', job.id); // Use job ID to update specific job
  
          if (error) throw error;
  
          // Update the UI with the new values
          jobTitle.innerHTML = updatedTitle;
          jobDescription.innerHTML = updatedDescription;
          jobLocation.innerHTML = updatedLocation;
  
          // Change the button text back to "Edit"
          editButton.textContent = 'Edit';
          isEditing = false;
        } catch (err) {
          console.error('Error saving job:', err);
        }
      } else {
        
       // Enter editing mode
        jobTitle.innerHTML = `
        <input type="text" class="edit-title" value="${jobTitle.textContent}" 
            style="width: 100%; padding: 8px; margin: 5px 0; border-radius: 4px; border: 1px solid #ccc;">
        `;

        jobDescription.innerHTML = `
        <textarea class="edit-description" style="width: 100%; padding: 8px; margin: 5px 0; border-radius: 4px; border: 1px solid #ccc; height: 100px;">
        ${jobDescription.textContent}
        </textarea>
        `;

        jobLocation.innerHTML = `
        <input type="text" class="edit-location" value="${jobLocation.textContent}" 
            style="width: 100%; padding: 8px; margin: 5px 0; border-radius: 4px; border: 1px solid #ccc;">
        `;

        // Change the button text to "Save"
        editButton.textContent = 'Save';
        isEditing = true;
      }
    });
  
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

  // Handle form submission to add a new job
  document.getElementById('addJobForm').addEventListener('submit', async function (e) {
    e.preventDefault(); // Prevent default form submission behavior

    // Get form data
    const jobTitle = document.getElementById('jobName').value;
    const jobDesc = document.getElementById('jobDescription').value;
    const location = document.getElementById('location').value;
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString(); // Format the date as ISO string
    const jobLink = document.getElementById('jobLink').value; // Get the job application link

    // Check if fields are not empty
    if (!jobTitle || !jobDesc || !location) {
      return; // Skip if fields are empty
    }

    try {
      // Insert job into Supabase
      const { data, error } = await supabase
        .from('jobs')
        .insert([{
          title: jobTitle,
          description: jobDesc,
          location: location,
          posted_date: formattedDate,
          jobLink: jobLink // Store the application link
        }]);

      if (error) {
        console.error('Error inserting job:', error);
        return;
      }

      // Log the result for debugging
      console.log('Job inserted:', data);

      // Reload the jobs
      loadJobs();

    } catch (error) {
      console.error('Error inserting job:', error);
    }

    // Reset the form
    this.reset();
  });

  // Toggle sort order when clicking the sort button
  document.getElementById('sortButton').addEventListener('click', () => {
    currentSortOrder = currentSortOrder === 'desc' ? 'asc' : 'desc';
    loadJobs(); // Reload jobs with the new sort order
  });

  // Expose the nextPage and prevPage functions globally for HTML to access
  window.nextPage = nextPage;
  window.prevPage = prevPage;
});
