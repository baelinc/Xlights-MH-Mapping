document.addEventListener('DOMContentLoaded', () => {
    const correctPassword = 'admin';
    const passwordForm = document.getElementById('password-form');
    const passwordInput = document.getElementById('password-input');
    const cancelButton = document.getElementById('cancel-button');

    // Handle password form submission
    if (passwordForm && passwordInput && cancelButton) {
        passwordForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent the form from submitting the traditional way
            if (passwordInput.value === correctPassword) {
                window.location.href = 'index.html'; // Redirect to index page
            } else {
                alert('Incorrect password. Please try again.');
                passwordInput.value = ''; // Clear the password field
            }
        });

        // Handle cancel button click
        cancelButton.addEventListener('click', function() {
            window.location.href = 'index.html'; // Redirect to index page
        });
    } else {
        console.error('Required elements are missing from the password page.');
    }

    const dataFilePath = 'data/moving_heads_channel_types.json';
    let movingHeads = [];
    let channelTypes = [];

    // Function to load data from JSON file
    function loadData() {
        fetch(dataFilePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok.');
                }
                return response.json();
            })
            .then(data => {
                movingHeads = data.moving_heads || [];
                channelTypes = data.channel_types || [];
                updateDropdowns();
            })
            .catch(error => {
                console.error('Error loading data:', error);
                alert('Failed to load data. Please check the console for errors.');
            });
    }

    // Function to update dropdowns with moving head options
    function updateDropdowns() {
        const sourceDropdown = document.getElementById('source-moving-head');
        const destinationDropdown = document.getElementById('destination-moving-head');

        if (sourceDropdown && destinationDropdown) {
            sourceDropdown.innerHTML = '<option value="" disabled selected>Select Source Moving Head</option>';
            destinationDropdown.innerHTML = '<option value="" disabled selected>Select Destination Moving Head</option>';

            movingHeads.forEach(movingHead => {
                const option = document.createElement('option');
                option.value = movingHead.name;
                option.textContent = movingHead.name;
                sourceDropdown.appendChild(option.cloneNode(true));
                destinationDropdown.appendChild(option);
            });

            sourceDropdown.addEventListener('change', () => updateChannels('source'));
            destinationDropdown.addEventListener('change', () => updateChannels('destination'));
        } else {
            console.error('Dropdown elements are missing.');
        }
    }

    // Function to update channel lists based on the selected moving head
    function updateChannels(type) {
        const dropdown = document.getElementById(`${type}-moving-head`);
        const channelsDiv = document.getElementById(`${type}-channels`);
        const selectedMovingHead = movingHeads.find(head => head.name === dropdown.value);

        if (channelsDiv) {
            channelsDiv.innerHTML = '';
            if (selectedMovingHead) {
                selectedMovingHead.channels.forEach((channel, index) => {
                    const p = document.createElement('p');
                    p.textContent = `Channel ${index + 1}: ${channel}`;
                    channelsDiv.appendChild(p);
                });
            } else {
                channelsDiv.textContent = 'No channels available';
            }
        } else {
            console.error('Channels div is missing.');
        }
    }

    // Function to generate the XDMXMap file
    function generateXDMXMap() {
        const sourceDropdown = document.getElementById('source-moving-head');
        const destinationDropdown = document.getElementById('destination-moving-head');

        const sourceMovingHead = movingHeads.find(head => head.name === sourceDropdown.value);
        const destinationMovingHead = movingHeads.find(head => head.name === destinationDropdown.value);

        if (sourceMovingHead && destinationMovingHead) {
            let csvContent = '';

            sourceMovingHead.channels.forEach((sourceChannel, index) => {
                const destIndex = destinationMovingHead.channels.indexOf(sourceChannel);
                const destChannel = destIndex !== -1 ? `Channel ${destIndex + 1}` : `Channel ${99 - index}`;
                csvContent += `Channel ${index + 1}, ${destChannel}, 1.00, 0\n`;
            });

            downloadFile('mapping.xdmxmap', csvContent);
        } else {
            alert('Please select both source and destination moving heads.');
        }
    }

    // Function to download the generated file
    function downloadFile(filename, content) {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

    // Initialize the page
    if (document.getElementById('source-moving-head') && document.getElementById('destination-moving-head')) {
        loadData();
    }

    document.getElementById('generate-button')?.addEventListener('click', generateXDMXMap);
    document.getElementById('edit-button')?.addEventListener('click', () => {
        // Redirect to password page before accessing edit.html
        window.location.href = 'password.html';
    });
});
