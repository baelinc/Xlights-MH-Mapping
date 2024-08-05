document.addEventListener('DOMContentLoaded', () => {
    const dataFilePath = 'data/moving_heads_channel_types.json';
    let channelTypes = [];
    let movingHeadName = '';

    // Fetch data file
    function fetchData() {
        fetch(dataFilePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok.');
                }
                return response.json();
            })
            .then(data => {
                channelTypes = data.channel_types || [];
                setupPage();
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                alert('Failed to load data. Please check the console for errors.');
            });
    }

    function setupPage() {
        const form = document.getElementById('moving-head-form');
        const nameInput = document.getElementById('moving-head-name');
        const channelsContainer = document.getElementById('channels-container');
        const saveButton = document.getElementById('save-button');
        const cancelButton = document.getElementById('cancel-button');

        // Check for saved data in local storage
        const storedName = localStorage.getItem('movingHeadName');
        const storedChannels = JSON.parse(localStorage.getItem('channels'));

        if (storedName) {
            nameInput.value = storedName;
            movingHeadName = storedName;

            // Load stored channels
            if (storedChannels) {
                storedChannels.forEach((type, index) => {
                    addChannelRow(index + 1, type);
                });
            } else {
                for (let i = 1; i <= 10; i++) {
                    addChannelRow(i);
                }
            }
        } else {
            for (let i = 1; i <= 10; i++) {
                addChannelRow(i);
            }
        }

        // Add event listeners
        saveButton.addEventListener('click', saveData);
        cancelButton.addEventListener('click', () => window.location.href = 'edit_data.html');
    }

    function addChannelRow(channelNumber, selectedType = '') {
        const channelsContainer = document.getElementById('channels-container');

        const row = document.createElement('div');
        row.className = 'channel-row';
        row.innerHTML = `
            <span>Channel ${channelNumber}</span>
            <select class="channel-type-dropdown" data-channel="${channelNumber}">
                <option value="">Select Type</option>
                ${channelTypes.map(type => `<option value="${type}" ${type === selectedType ? 'selected' : ''}>${type}</option>`).join('')}
            </select>
        `;
        channelsContainer.appendChild(row);
    }

    function saveData() {
        const nameInput = document.getElementById('moving-head-name');
        const channelTypeDropdowns = document.querySelectorAll('.channel-type-dropdown');

        movingHeadName = nameInput.value;

        if (!movingHeadName) {
            alert('Please enter a moving head name.');
            return;
        }

        const selectedTypes = Array.from(channelTypeDropdowns).map(dropdown => dropdown.value);
        const uniqueTypes = [...new Set(selectedTypes)];

        if (selectedTypes.length !== uniqueTypes.length) {
            alert('Each channel type must be unique.');
            return;
        }

        // Save data to local storage
        localStorage.setItem('movingHeadName', movingHeadName);
        localStorage.setItem('channels', JSON.stringify(selectedTypes));

        // Redirect or show success message
        alert('Data saved successfully!');
        window.location.href = 'edit_data.html';
    }

    fetchData();
});
