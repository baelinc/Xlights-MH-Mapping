// edit_moving_head.js

document.addEventListener('DOMContentLoaded', () => {
    const channelTypes = []; // Array to hold channel types
    const channelsContainer = document.getElementById('channels-container');
    const numChannelsInput = document.getElementById('num-channels');
    const saveButton = document.getElementById('save-button');
    const cancelButton = document.getElementById('cancel-button');

    // Load channel types from a JSON file
    const loadChannelTypes = () => {
        return fetch('data.json') // Update this URL to your actual data source
            .then(response => response.json())
            .then(data => {
                if (data.channelTypes) {
                    channelTypes.push(...data.channelTypes);
                } else {
                    console.error('No channelTypes found in data.');
                }
            })
            .catch(error => console.error('Error loading channel types:', error));
    };

    // Populate dropdown with channel types
    const populateChannelTypes = (channelSelect) => {
        channelSelect.innerHTML = ''; // Clear existing options
        channelTypes.forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            channelSelect.appendChild(option);
        });
    };

    // Generate the channel form dynamically
    const generateChannels = (numChannels) => {
        channelsContainer.innerHTML = ''; // Clear existing channels
        for (let i = 1; i <= numChannels; i++) {
            const channelRow = document.createElement('div');
            channelRow.classList.add('channel-row');

            const label = document.createElement('label');
            label.textContent = `Channel ${i}:`;
            channelRow.appendChild(label);

            const channelSelect = document.createElement('select');
            channelSelect.id = `channel-${i}`;
            populateChannelTypes(channelSelect);
            channelRow.appendChild(channelSelect);

            channelsContainer.appendChild(channelRow);
        }
    };

    // Event listener for number of channels input
    numChannelsInput.addEventListener('input', (event) => {
        const numChannels = parseInt(event.target.value, 10);
        if (numChannels > 0) {
            generateChannels(numChannels);
        }
    });

    // Event listener for save button
    saveButton.addEventListener('click', () => {
        const movingHeadName = document.getElementById('moving-head-name').value;
        const numChannels = parseInt(numChannelsInput.value, 10);

        if (movingHeadName && numChannels > 0) {
            // Collect selected channel types
            const selectedChannelTypes = [];
            for (let i = 1; i <= numChannels; i++) {
                const channelSelect = document.getElementById(`channel-${i}`);
                const selectedType = channelSelect.value;
                if (selectedType) {
                    selectedChannelTypes.push(selectedType);
                }
            }

            // Check for duplicate channel types
            if (new Set(selectedChannelTypes).size !== selectedChannelTypes.length) {
                alert('Each channel type must be unique.');
                return;
            }

            // Save data (implement actual saving logic here)
            console.log('Saving moving head:', movingHeadName);
            console.log('Number of channels:', numChannels);
            console.log('Selected channel types:', selectedChannelTypes);

            alert('Moving head configuration saved successfully!');
            // Optionally redirect or clear form
        } else {
            alert('Please enter all required information.');
        }
    });

    // Event listener for cancel button
    cancelButton.addEventListener('click', () => {
        window.location.href = 'edit_data.html'; // Redirect to edit_data.html
    });

    // Initial load
    loadChannelTypes().then(() => {
        // Optionally handle what happens after loading
        numChannelsInput.disabled = false; // Enable number of channels input
    });
});
