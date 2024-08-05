document.addEventListener('DOMContentLoaded', () => {
    const editButton = document.getElementById('edit-button');
    const generateButton = document.getElementById('generate-button');

    if (editButton) {
        editButton.addEventListener('click', () => window.location.href = 'password.html');
    }

    if (generateButton) {
        generateButton.addEventListener('click', () => {
            // Add code to generate the XDMX map here
        });
    }
});
