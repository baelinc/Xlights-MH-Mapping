document.addEventListener('DOMContentLoaded', () => {
    const correctPassword = 'admin';
    const passwordForm = document.getElementById('password-form');
    const passwordInput = document.getElementById('password');
    const cancelButton = document.getElementById('cancel-button');

    if (passwordForm && passwordInput && cancelButton) {
        passwordForm.addEventListener('submit', function(event) {
            event.preventDefault();
            console.log('Form submitted');
            if (passwordInput.value === correctPassword) {
                console.log('Password correct');
                window.location.href = 'edit_data.html';
            } else {
                console.log('Password incorrect');
                alert('Incorrect password. Please try again.');
                passwordInput.value = '';
            }
        });

        cancelButton.addEventListener('click', function() {
            console.log('Cancel button clicked');
            window.location.href = 'index.html';
        });
    } else {
        console.error('Required elements are missing from the password page.');
    }
});
