document.addEventListener('DOMContentLoaded', () => {
    const dataFilePath = 'data/moving_heads_channel_types.json'; // Ensure this path is correct
    let movingHeads = [];
    let channelTypes = [];

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
                movingHeads.sort((a, b) => a.name.localeCompare(b.name)); // Sort moving heads alphabetically
                updateDropdowns();
            })
            .catch(error => {
                console.error('Error loading data:', error);
                alert('Failed to load data. Please check the console for errors.');
            });
    }

    function updateDropdowns() {
        const sourceDropdown = document.getElementById('source-moving-head');
        const destinationDropdown = document.getElementById('destination-moving-head');

        if (sourceDropdown && destinationDropdown) {
            sourceDropdown.innerHTML = '<option value="">Select Source Moving Head</option>';
            destinationDropdown.innerHTML = '<option value="">Select Destination Moving Head</option>';

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
            }
        } else {
            console.error('Channels div is missing.');
        }
    }

    function generateXDMXMap() {
        const sourceDropdown = document.getElementById('source-moving-head');
        const destinationDropdown = document.getElementById('destination-moving-head');

        const sourceMovingHead = movingHeads.find(head => head.name === sourceDropdown.value);
        const destinationMovingHead = movingHeads.find(head => head.name === destinationDropdown.value);

        if (sourceMovingHead && destinationMovingHead) {
            let csvContent = '';

            sourceMovingHead.channels.forEach((sourceChannel, index) => {
                const destIndex = destinationMovingHead.channels.indexOf(sourceChannel);
                const destChannel = destIndex !== -1 ? `Channel ${destIndex + 1}` : `Channel ${48 - index}`;
                csvContent += `Channel ${index + 1},${destChannel},1.00,0\n`;
            });

            downloadFile('mapping.xdmxmap', csvContent);
        } else {
            alert('Please select both source and destination moving heads.');
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

    // Setup event listeners
    document.getElementById('generate-button')?.addEventListener('click', generateXDMXMap);
    document.getElementById('edit-button')?.addEventListener('click', () => window.location.href = 'password.html');

    // Load data when page loads
    loadData();
});
