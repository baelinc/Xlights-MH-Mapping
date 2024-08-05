document.addEventListener('DOMContentLoaded', () => {
    const channelTypesDropdowns = document.querySelectorAll('.channel-type-dropdown');
    let channelTypes = [];

    // Fetch channel types from the JSON file
    fetch('data/moving_heads_channel_types.json')
        .then(response => response.json())
        .then(data => {
            channelTypes = data;
            // Populate dropdowns with the initial data
            populateDropdowns();
            // Set up initial dropdowns state
            updateDropdowns();
        })
        .catch(error => console.error('Error fetching channel types:', error));

    function populateDropdowns() {
        channelTypesDropdowns.forEach(dropdown => {
            dropdown.innerHTML = '';
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Select Channel Type';
            dropdown.appendChild(defaultOption);

            channelTypes.forEach(type => {
                const option = document.createElement('option');
                option.value = type;
                option.textContent = type;
                dropdown.appendChild(option);
            });
        });
    }

    function updateDropdowns() {
        const selectedTypes = Array.from(channelTypesDropdowns).map(dropdown => dropdown.value);

        channelTypesDropdowns.forEach(dropdown => {
            const options = Array.from(dropdown.querySelectorAll('option'));

            options.forEach(option => {
                if (selectedTypes.includes(option.value) && option.value !== '') {
                    option.style.display = 'none';
                } else {
                    option.style.display = '';
                }
            });
        });
    }

    document.getElementById('num-channels').addEventListener('change', (event) => {
        const numChannels = parseInt(event.target.value);
        if (isNaN(numChannels) || numChannels < 1) return;

        const container = document.getElementById('channels-container');
        container.innerHTML = '';

        for (let i = 1; i <= numChannels; i++) {
            const channelDiv = document.createElement('div');
            channelDiv.classList.add('channel-row');
            channelDiv.innerHTML = `
                <label>Channel ${i}:</label>
                <select class="channel-type-dropdown">
                    <!-- Options will be populated dynamically -->
                </select>
            `;
            container.appendChild(channelDiv);
        }

        // Populate dropdowns after creating them
        populateDropdowns();
    });

    document.getElementById('channels-container').addEventListener('change', (event) => {
        if (event.target.classList.contains('channel-type-dropdown')) {
            updateDropdowns();
        }
    });

    document.getElementById('save-button').addEventListener('click', () => {
        const movingHeadName = document.getElementById('moving-head-name').value;
        const numChannels = document.getElementById('num-channels').value;
        const selectedChannelTypes = Array.from(document.querySelectorAll('.channel-type-dropdown')).map(dropdown => dropdown.value);

        // Save the data logic here

        console.log({
            movingHeadName,
            numChannels,
            selectedChannelTypes
        });
    });

    document.getElementById('cancel-button').addEventListener('click', () => {
        window.history.back();
    });
});
