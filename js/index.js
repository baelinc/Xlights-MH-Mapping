document.addEventListener('DOMContentLoaded', () => {
    const dataFilePath = 'data/moving_heads_channel_types.json';

    function loadData() {
        fetch(dataFilePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok.');
                }
                return response.json();
            })
            .then(data => {
                // Process and display data
                displayData(data);
            })
            .catch(error => {
                console.error('Error loading data:', error);
                alert('Failed to load data. Please check the console for errors.');
            });
    }

    function displayData(data) {
        // Example: Displaying moving heads and channel types
        const movingHeadsList = document.getElementById('moving-heads-list');
        const channelTypesList = document.getElementById('channel-types-list');

        if (movingHeadsList && channelTypesList) {
            movingHeadsList.innerHTML = '';
            channelTypesList.innerHTML = '';

            data.moving_heads.forEach(movingHead => {
                const option = document.createElement('option');
                option.value = movingHead.name;
                option.textContent = movingHead.name;
                movingHeadsList.appendChild(option);
            });

            data.channel_types.forEach(channelType => {
                const option = document.createElement('option');
                option.value = channelType;
                option.textContent = channelType;
                channelTypesList.appendChild(option);
            });
        }
    }

    loadData();
});
