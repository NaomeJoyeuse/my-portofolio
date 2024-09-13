
document.addEventListener('DOMContentLoaded', function() {
    const createBlogLink = document.getElementById('create-blog-link');
    const formContainer = document.getElementById('form-container');
    const tableContainer = document.getElementById('table-container');
    const overviewLink = document.getElementById('overview-link');
    const viewBlogsLink = document.getElementById('view-blogs-link');
    const manageProjectsLink = document.getElementById('manage-projects-link');

    // Initially hide the table and show the form
    formContainer.style.display = 'none';
    tableContainer.style.display = 'none';

    // Show the form and hide the table when clicking "Create Blog"
    createBlogLink.addEventListener('click', function(event) {
        event.preventDefault();
        formContainer.style.display = 'block';
        tableContainer.style.display = 'none';
    });

    // Show the table and hide the form when clicking "Overview", "View All Blogs", or "Manage Projects"
    overviewLink.addEventListener('click', function() {
        formContainer.style.display = 'none';
        tableContainer.style.display = 'none'; // Hide the table in the overview section
    });

    viewBlogsLink.addEventListener('click', function() {
        formContainer.style.display = 'none';
        tableContainer.style.display = 'block'; // Show the table when viewing blogs
        loadBlogs(); // Load blogs when the table is shown
    });

    manageProjectsLink.addEventListener('click', function() {
        formContainer.style.display = 'none';
        tableContainer.style.display = 'none'; // Hide the table in the manage projects section
    });
});
