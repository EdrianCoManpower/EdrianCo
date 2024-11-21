// footer.js

fetch('footer.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('footer').innerHTML = data;
    })
    .catch(error => console.error('Error loading the footer:', error));


    
// navbar.js
fetch('navbar.html')
.then(response => response.text())
.then(data => {
    document.getElementById('navbar').innerHTML = data;
})
.catch(error => console.error('Error loading the navbar:', error));

// navbar.js
fetch('navbar-admin.html')
.then(response => response.text())
.then(data => {
    document.getElementById('navbar-admin').innerHTML = data;
})
.catch(error => console.error('Error loading the navbar:', error));
