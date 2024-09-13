

document.addEventListener('DOMContentLoaded', () => {
    function showNotification(message, type = 'info', duration = 2000) {
        if (typeof toastr !== 'undefined') {
            toastr.options.timeOut = duration; // Set the duration of the toast
            toastr.options.extendedTimeOut = duration; // Set the extended duration if user hovers over the toast
            toastr.options.positionClass = 'toast-top-right'; // Position the toast
            toastr.options.preventDuplicates = true; // Prevent duplicate messages
            toastr[type](message);
        } else {
            console.error('Toastr is not defined');
        }
    }

    async function fetchWithToken(url, options = {}) {
        const token = localStorage.getItem('authToken');

        if (!token) {
            alert('You need to be logged in to perform this action.');
            showNotification('You need to be logged in to perform this action. Redirecting to login...', 'info', 2000);
            setTimeout(() => {
                window.location.href = '/login.html'; // Ensure the path is correct
            }, 2000); // Redirect after the notification
            return;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    ...options.headers,
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 401) {
                alert('Session expired or invalid. Please log in again.');
                showNotification('Session expired or invalid. Redirecting to login...', 'warning', 2000);
                localStorage.removeItem('authToken');
                setTimeout(() => {
                    window.location.href = '/login.html'; // Ensure the path is correct
                }, 2000); // Redirect after the notification
                return;
            }

            return response;
        } catch (error) {
            console.error('Error making request:', error);
            showNotification('An error occurred while processing your request. Please try again.', 'error', 2000);
            throw error;
        }
    }

    // Expose fetchWithToken to global scope if needed
    window.fetchWithToken = fetchWithToken;
});
