
document.addEventListener('DOMContentLoaded', function() {
    const createBlogLink = document.getElementById('create-blog-link');
    const formContainer = document.getElementById('form-container');
    const tableContainer = document.getElementById('table-container');
    const overviewLink = document.getElementById('overview-link');
    const viewBlogsLink = document.getElementById('view-blogs-link');
    const manageProjectsLink = document.getElementById('manage-projects-link');
    const blogDisplay = document.getElementById('blog-display'); 
    const cardContainer = document.getElementById('card-container');


    formContainer.style.display = 'none';
    tableContainer.style.display = 'none';

    createBlogLink.addEventListener('click', function(event) {
        event.preventDefault();
        formContainer.style.display = 'block';
        tableContainer.style.display = 'none';
        blogDisplay.style.display = 'none'; 
        cardContainer.style.display = 'none'; 
    });


    // overviewLink.addEventListener('click', function() {
    //     formContainer.style.display = 'none';
    //     tableContainer.style.display = 'none'; 
    //     blogDisplay.style.visibility = 'visible';
    //     cardContainer.style.display = 'block'; 
    // });

    viewBlogsLink.addEventListener('click', function() {
        formContainer.style.display = 'none';
        tableContainer.style.display = 'block'; 
        blogDisplay.style.display = 'none';
        cardContainer.style.display = 'none'; 
        loadBlogs(); 
    });

    manageProjectsLink.addEventListener('click', function() {
        formContainer.style.display = 'none';
        tableContainer.style.display = 'none'; 
        blogDisplay.style.display = 'none'; 
        cardContainer.style.display = 'none'; 
    });
});
