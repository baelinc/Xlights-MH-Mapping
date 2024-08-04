document.addEventListener('DOMContentLoaded', () => {
    // Password Protection
    const passwordForm = document.getElementById('password-form');
    const passwordInput = document.getElementById('password');
    const cancelButton = document.getElementById('cancel-button');
    const correctPassword = 'admin';

    if (passwordForm) {
        passwordForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const enteredPassword = passwordInput.value;

            if (enteredPassword === correctPassword) {
                window.location.href = 'edit.html';
            } else {
                alert('Incorrect password. Please try again.');
                passwordInput.value = ''; // Clear the input field
            }
        });

        cancelButton.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    // Main Page Functionality
    const generateButton = document.getElementById('generate-button');
    const sourceDropdown = document.getElementById('source-dropdown');
    const destinationDropdown = document.getElementById('destination-dropdown');
    const sourceChannels = document.getElementById('source-channels');
    const destinationChannels = document.getElementById('destination-channels');

    if (generateButton) {
        generateButton.addEventListener('click', generateXDMXMapFile);
    }

    if (sourceDropdown && destinationDropdown) {
        sourceDropdown.addEventListener('change', () => {
            updateChannels(sourceDropdown, sourceChannels);
        });
        destinationDropdown.addEventListener('change', () => {
            updateChannels(destinationDropdown, destinationChannels);
        });
    }

    // Edit Page Functionality
    const passwordEditForm = document.getElementById('password-edit-form');
    const passwordEditInput = document.getElementById('password-edit');
    const cancelEditButton = document.getElementById('cancel-edit-button');

    if (passwordEditForm) {
        passwordEditForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const enteredPassword = passwordEditInput.value;

            if (enteredPassword === correctPassword) {
                window.location.href = 'edit.html';
            } else {
                alert('Incorrect password. Please try again.');
                passwordEditInput.value = ''; // Clear the input field
            }
        });

        cancelEditButton.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    // Functions
    function loadJSON(filePath) {
        return fetch(filePath)
            .then(response => response.json())
            .catch(err => console.error('Error loading JSON:', err));
    }

    function updateDropdowns() {
        loadJSON('data/moving_heads_channel_types.json').then(data => {
            const sourceDropdown = document.getElementById('source-dropdown');
            const destinationDropdown = document.getElementById('destination-dropdown');

            if (sourceDropdown && destinationDropdown) {
                const movingHeads = data.moving_heads;
                sourceDropdown.innerHTML = '<option value="">Select Source Moving Head</option>';
                destinationDropdown.innerHTML = '<option value="">Select Destination Moving Head</option>';

                movingHeads.forEach(movingHead => {
                    const option = document.createElement('option');
                    option.value = movingHead.name;
                    option.textContent = movingHead.name;
                    sourceDropdown.appendChild(option);

                    const clone = option.cloneNode(true);
                    destinationDropdown.appendChild(clone);
                });
            }
        });
    }

    function updateChannels(dropdown, channelsContainer) {
        const movingHeadName = dropdown.value;

        if (movingHeadName) {
            loadJSON('data/moving_heads_channel_types.json').then(data => {
                const movingHead = data.moving_heads.find(mh => mh.name === movingHeadName);
                
                if (movingHead) {
                    channelsContainer.innerHTML = '';
                    movingHead.channels.forEach((channel, index) => {
                        const div = document.createElement('div');
                        div.textContent = `Channel ${index + 1}: ${channel}`;
                        channelsContainer.appendChild(div);
                    });
                }
            });
        }
    }

    function generateXDMXMapFile() {
        const sourceMovingHead = sourceDropdown.value;
        const destinationMovingHead = destinationDropdown.value;

        if (sourceMovingHead && destinationMovingHead) {
            loadJSON('data/moving_heads_channel_types.json').then(data => {
                const source = data.moving_heads.find(mh => mh.name === sourceMovingHead);
                const destination = data.moving_heads.find(mh => mh.name === destinationMovingHead);

                if (source && destination) {
                    let output = '';

                    source.channels.forEach((sourceChannel, index) => {
                        const sourceChannelNumber = index + 1;
                        const destinationChannelNumber = destination.channels.indexOf(sourceChannel) + 1;
                        const outputLine = `Channel ${sourceChannelNumber},Channel ${destinationChannelNumber !== -1 ? destinationChannelNumber : 99},1.00,0\n`;

                        output += outputLine;
                    });

                    downloadFile('mapping.xdmxmap', output);
                }
            });
        }
    }

    function downloadFile(filename, content) {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

    updateDropdowns();
});
