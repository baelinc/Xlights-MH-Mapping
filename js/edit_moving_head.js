document.addEventListener('DOMContentLoaded', () => {
    const channelTypes = []; // Load this from your data
    const channelsContainer = document.getElementById('channels-container');
    const saveButton = document.getElementById('save-button');
    const cancelButton = document.getElementById('cancel-button');

    let numChannels = 0;
    let movingHeadName = '';
    let availableChannelTypes = [...channelTypes]; // Copy of channel types

    function generateChannelRows() {
        channelsContainer.innerHTML = '';
        availableChannelTypes = [...channelTypes]; // Reset available types

        for (let i = 0; i < numChannels; i++) {
            const row = document.createElement('div');
            row.className = 'channel-row';

            const label = document.createElement('label');
            label.textContent = `Channel ${i + 1}:`;
            row.appendChild(label);

            const select = document.createElement('select');
            select.className = 'channel-select';
            select.id = `channel-${i + 1}`;

            const placeholderOption = document.createElement('option');
            placeholderOption.value = '';
            placeholderOption.textContent = 'Select Channel Type';
            select.appendChild(placeholderOption);

            availableChannelTypes.forEach(type => {
                const option = document.createElement('option');
                option.value = type;
                option.textContent = type;
                select.appendChild(option);
            });

            select.addEventListener('change', updateAvailableTypes);
            row.appendChild(select);

            channelsContainer.appendChild(row);
        }
    }

    function updateAvailableTypes() {
        const selectedTypes = new Set();

        for (let i = 0; i < numChannels; i++) {
            const select = document.getElementById(`channel-${i + 1}`);
            if (select.value) {
                selectedTypes.add(select.value);
            }
        }

        availableChannelTypes = channelTypes.filter(type => !selectedTypes.has(type));
        updateDropdownOptions();
    }

    function updateDropdownOptions() {
        for (let i = 0; i < numChannels; i++) {
            const select = document.getElementById(`channel-${i + 1}`);
            if (select) {
                const currentValue = select.value;
                select.innerHTML = '';

                const placeholderOption = document.createElement('option');
                placeholderOption.value = '';
                placeholderOption.textContent = 'Select Channel Type';
                select.appendChild(placeholderOption);

                availableChannelTypes.forEach(type => {
                    const option = document.createElement('option');
                    option.value = type;
                    option.textContent = type;
                    select.appendChild(option);
                });

                if (currentValue && availableChannelTypes.includes(currentValue)) {
                    select.value = currentValue;
                }
            }
        }
    }

    function loadMovingHeadData() {
        // Retrieve and set moving head data
        // For example, use URL parameters or an API call to get the moving head data

        movingHeadName = 'Example Moving Head'; // Replace with actual data
        numChannels = 10; // Replace with actual data

        document.getElementById('moving-head-name').value = movingHeadName;
        generateChannelRows();
    }

    function saveMovingHeadData() {
        const name = document.getElementById('moving-head-name').value;
        const channels = [];

        for (let i = 0; i < numChannels; i++) {
            const select = document.getElementById(`channel-${i + 1}`);
            channels.push(select.value);
        }

        if (name && channels.length === numChannels && !channels.includes('')) {
            // Save the data (send to server or update local storage)
            console.log('Saving data:', { name, channels });
            alert('Data saved successfully.');
        } else {
            alert('Please fill out all fields.');
        }
    }

    function cancelEditing() {
        window.location.href = 'edit_data.html';
    }

    saveButton.addEventListener('click', saveMovingHeadData);
    cancelButton.addEventListener('click', cancelEditing);

    loadMovingHeadData();
});
