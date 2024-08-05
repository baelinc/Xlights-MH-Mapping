document.addEventListener('DOMContentLoaded', () => {
    const correctPassword = 'admin';
    const passwordForm = document.getElementById('password-form');
    const passwordInput = document.getElementById('password');
    const cancelButton = document.getElementById('cancel-button');

    if (passwordForm && passwordInput && cancelButton) {
        passwordForm.addEventListener('submit', function(event) {
            event.preventDefault();
            if (passwordInput.value === correctPassword) {
                window.location.href = 'edit_data.html';
            } else {
                alert('Incorrect password. Please try again.');
                passwordInput.value = '';
            }
        });

        cancelButton.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
    } else {
        console.error('Required elements are missing from the password page.');
    }
});
