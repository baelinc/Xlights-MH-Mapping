document.addEventListener('DOMContentLoaded', () => {
    const dataFilePath = 'data/moving_heads_channel_types.json';
    let channelTypes = [];
    const numChannelsInput = document.getElementById('num-channels');
    const channelsContainer = document.getElementById('channels-container');
    const nameInput = document.getElementById('moving-head-name');
    const saveButton = document.getElementById('save-button');
    const cancelButton = document.getElementById('cancel-button');

    // Fetch channel types from JSON file
    function fetchChannelTypes() {
        fetch(dataFilePath)
            .then(response => response.json())
            .then(data => {
                channelTypes = data.channel_types || [];
                numChannelsInput.addEventListener('change', updateChannels);
                saveButton.addEventListener('click', saveData);
                cancelButton.addEventListener('click', () => window.location.href = 'edit_data.html');
                updateChannels(); // Initialize channels based on current number
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                alert('Failed to load channel types. Please check the console for errors.');
            });
    }

    // Update channels display based on number of channels
    function updateChannels() {
        const numChannels = parseInt(numChannelsInput.value, 10) || 0;
        channelsContainer.innerHTML = ''; // Clear previous channels
        for (let i = 1; i <= numChannels; i++) {
            addChannelRow(i);
        }
    }

    // Add a row for each channel
    function addChannelRow(channelNumber, selectedType = '') {
        const row = document.createElement('div');
        row.className = 'channel-row';
        row.innerHTML = `
            <label for="channel-${channelNumber}">Channel ${channelNumber}:</label>
            <select id="channel-${channelNumber}" class="channel-type-dropdown">
                <option value="">Select Type</option>
                ${channelTypes.map(type => `<option value="${type}" ${type === selectedType ? 'selected' : ''}>${type}</option>`).join('')}
            </select>
        `;
        channelsContainer.appendChild(row);
    }

    // Save data and redirect
    function saveData() {
        const movingHeadName = nameInput.value;
        const channelTypeDropdowns = document.querySelectorAll('.channel-type-dropdown');

        if (!movingHeadName) {
            alert('Please enter a moving head name.');
            return;
        }

        const selectedTypes = Array.from(channelTypeDropdowns).map(dropdown => dropdown.value);
        const uniqueTypes = [...new Set(selectedTypes.filter(type => type))];

        if (selectedTypes.length !== uniqueTypes.length) {
            alert('Each channel type must be unique.');
            return;
        }

        // Save data to local storage or server
        localStorage.setItem('movingHeadName', movingHeadName);
        localStorage.setItem('channels', JSON.stringify(selectedTypes));

        // Redirect or show success message
        alert('Data saved successfully!');
        window.location.href = 'edit_data.html';
    }

    fetchChannelTypes();
});
