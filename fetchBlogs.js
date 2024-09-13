
document.addEventListener('DOMContentLoaded', () => {
    const blogTableBody = document.getElementById('blog-table-body');
    const messageContainer = document.getElementById('message');
    const createBlogForm = document.querySelector('.form');
    const blogTitleInput = document.getElementById('blogTitle');
    const authorInput = document.getElementById('author');
    const descriptionInput = document.getElementById('description');
    const uploadImageInput = document.getElementById('uploadImage');

    // Helper function to show a message
    function showMessage(message, type) {
        if (messageContainer) {
            messageContainer.textContent = message;
            messageContainer.className = `message ${type}`;
            messageContainer.style.display = 'block'; // Show the message container
        }
    }

    // Helper function to hide the message
    function hideMessage() {
        if (messageContainer) {
            messageContainer.style.display = 'none'; // Hide the message container
        }
    }
        
    async function fetchBlogs() {
        const token = localStorage.getItem('authToken');

        if (!token) {
            showMessage('No authentication token found.', 'error');
            return;
        }

        const headers = new Headers({
            'Content-Type': 'application/json'
        });

        try {
            const response = await fetch('https://blogs-backend-backup.onrender.com/api/blogs', {
                method: 'GET'
        
            });

            const blogs = await response.json();

            if (response.ok) {
                blogTableBody.innerHTML = '';

                blogs.forEach((blog, index) => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <th scope="row">${index + 1}</th>
                        <td>${blog.title}</td>
                        <td>${blog.author}</td>
                        <td>${blog.content}</td>
                        <td>${new Date(blog.date).toLocaleString()}</td>
                        <td><img src="${blog.image}" alt="${blog.title}" style="width: 100px; height: auto;"></td>
                        <td>
                    <button class="btn btn-warning btn-sm" data-id="${blog._id}" data-action="edit">Edit</button>
                    <button class="btn btn-danger btn-sm ms-2" data-id="${blog._id}" data-action="delete">Delete</button>
                </td>
                    `;
                    blogTableBody.appendChild(row);
                });

                // showMessage('Blogs loaded successfully!', 'success');
            } else {
                // showMessage(`Failed to load blogs: ${blogs.message || 'Unknown error'}`, 'error');
            }
        } catch (error) {
            showMessage('An unexpected error occurred.', 'error');
            console.error('Error:', error);
        }
        
        
    }
// Delete blog function
async function deleteBlog(blogId) {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
        showMessage('No authentication token found.', 'error');
        return;
    }
    
    const confirmation = confirm('Are you sure you want to delete this blog?');
    if (!confirmation) return;
    
    try {
        const response = await fetch(`https://blogs-backend-backup.onrender.com/api/blogs/${blogId}`, {
            method: 'DELETE',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': token 
            })
        });

        if (response.ok) {
            showMessage('Blog deleted successfully!', 'success');
            fetchBlogs(); 
        } else {
            const result = await response.json();
            showMessage(`Failed to delete blog: ${result.message || 'Unknown error'}`, 'error');
        }
    } catch (error) {
        showMessage('An unexpected error occurred.', 'error');
        console.error('Error:', error);
    }
}


// Fetch blog data and populate modal
async function editBlog(blogId) {
    const token = localStorage.getItem('authToken');

    if (!token) {
        showMessage('No authentication token found.', 'error');
        return;
    }

    try {
        const response = await fetch(`https://blogs-backend-backup.onrender.com/api/blogs/${blogId}`, {
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': token // Ensure the token is prefixed with 'Bearer'
            })
        });

        const blog = await response.json();

        if (response.ok) {
            // Populate the modal fields with blog data
            document.getElementById('editBlogId').value = blog._id;
            document.getElementById('editBlogTitle').value = blog.title;
            document.getElementById('editAuthor').value = blog.author;
            document.getElementById('editDescription').value = blog.content;
            // For image, you can provide a preview or a default image if needed
            // document.getElementById('editImage').value = '';

            // Show the modal
            const editBlogModal = new bootstrap.Modal(document.getElementById('editBlogModal'));
            editBlogModal.show();
        } else {
            showMessage(`Failed to load blog: ${blog.message || 'Unknown error'}`, 'error');
        }
    } catch (error) {
        showMessage('An unexpected error occurred.', 'error');
        console.error('Error:', error);
    }
}

// Handle button clicks for edit and delete
blogTableBody.addEventListener('click', event => {
    const target = event.target;
    
    if (target.tagName === 'BUTTON') {
        const blogId = target.getAttribute('data-id');
        const action = target.getAttribute('data-action');
        
        if (action === 'delete') {
            deleteBlog(blogId);
        } else if (action === 'edit') {
            // Call editBlog function (make sure this function is defined elsewhere)
            editBlog(blogId);
        }
    }
});

    
    ////////////////////////////////////////////////////////////////////////
    

// Handle the form submission for editing
async function handleEditFormSubmit(event) {
    event.preventDefault();

    const token = localStorage.getItem('authToken');

    if (!token) {
        showMessage('No authentication token found.', 'error');
        return;
    }

    const editBlogId = document.getElementById('editBlogId').value;
    const updatedData = {
        title: document.getElementById('editBlogTitle').value,
        author: document.getElementById('editAuthor').value,
        content: document.getElementById('editDescription').value
    };

    try {
        const response = await fetch(`https://blogs-backend-backup.onrender.com/api/blogs/${editBlogId}`, {
            method: 'PATCH',
            headers: new Headers({
                'Authorization': token, // Add Bearer prefix for the token
                'Content-Type': 'application/json' // Set content type to JSON
            }),
            body: JSON.stringify(updatedData) // Convert updated data to JSON
        });

        const result = await response.json();

        if (response.ok) {
            showMessage('Blog updated successfully!', 'success');
            fetchBlogs(); // Refresh the blog list
            const editBlogModal = bootstrap.Modal.getInstance(document.getElementById('editBlogModal'));
            editBlogModal.hide(); // Hide the modal
        } else {
            showMessage(`Failed to update blog: ${result.message || 'Unknown error'}`, 'error');
        }
    } catch (error) {
        showMessage('An unexpected error occurred.', 'error');
        console.error('Error:', error);
    }
}

// Add event listener for the edit form
document.getElementById('editBlogForm').addEventListener('submit', handleEditFormSubmit);


    async function handleFormSubmit(event) {
        event.preventDefault();

        const token = localStorage.getItem('authToken');

        if (!token) {
            showMessage('No authentication token found.', 'error');
            return;
        }

        const formData = new FormData();
        formData.append('title', blogTitleInput.value);
        formData.append('author', authorInput.value);
        formData.append('content', descriptionInput.value);
        formData.append('image', uploadImageInput.files[0]);

        const headers = new Headers({
            'Authorization': token 
        });

        try {
            const response = await fetch('https://blogs-backend-backup.onrender.com/api/blogs', {
                method: 'POST',
                headers: headers,
                body: formData
            });

            const result = await response.json();

            if (response.ok) {
                showMessage('Blog created successfully!', 'success');
                fetchBlogs(); 
                createBlogForm.reset(); 
                setTimeout(hideMessage, 3000);
            } else {
                showMessage(`Failed to create blog: ${result.message || 'Unknown error'}`, 'error');
            }
        } catch (error) {
            showMessage('An unexpected error occurred.', 'error');
            console.error('Error:', error);
        }
    }

    if (createBlogForm) {
        createBlogForm.addEventListener('submit', handleFormSubmit);
    }

    fetchBlogs(); // Initial fetch of blogs on page load
});
