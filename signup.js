document.getElementById('signupForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const responseMessageElement = document.getElementById('responseMessage');

    try {
        const response = await fetch('https://blogs-backend-backup.onrender.com/api/users/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const result = await response.json();

        if (response.ok) {
            responseMessageElement.innerHTML = `<p style="color: green;">${result.message}</p>`;
            document.getElementById('signupForm').reset(); // Clear form fields
        } else {
            responseMessageElement.innerHTML = `<p style="color: red;">${result.message}</p>`;
            if (result.error) {
                result.error.forEach(err => {
                    responseMessageElement.innerHTML += `<p style="color: red;">${err.message}</p>`;
                });
            }
        }
    } catch (error) {
        console.error('Error during fetch:', error); // Debugging line
        responseMessageElement.innerHTML = `<p style="color: red;">An error occurred: ${error.message}</p>`;
    }
});
