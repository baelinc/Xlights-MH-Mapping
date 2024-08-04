document.addEventListener('DOMContentLoaded', () => {
    const correctPassword = 'admin';
    const passwordForm = document.getElementById('password-form');
    const passwordInput = document.getElementById('password');
    const cancelButton = document.getElementById('cancel-button');

    if (passwordForm && passwordInput && cancelButton) {
        passwordForm.addEventListener('submit', function(event) {
            event.preventDefault();
            if (passwordInput.value === correctPassword) {
                window.location.href = 'index.html';
            } else {
                alert('Incorrect password. Please try again.');
                passwordInput.value = '';
            }
        });

        cancelButton.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
    } else {
        console.error('Required elements are missing from the password page.');
    }

    const dataFilePath = 'data/moving_heads_channel_types.json';
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
                updateDropdowns();
                updateChannelTypesList();
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

    function updateChannelTypesList() {
        const listbox = document.getElementById('channel-types-list');
        if (listbox) {
            listbox.innerHTML = '';

            channelTypes.forEach(type => {
                const listItem = document.createElement('li');
                listItem.textContent = type;
                listItem.addEventListener('dblclick', () => editChannelType(type));
                listbox.appendChild(listItem);
            });
        } else {
            console.error('Channel types list is missing.');
        }
    }

    function addMovingHead(name, numChannels) {
        movingHeads.push({
            name,
            channels: Array.from({ length: numChannels }, (_, i) => `Channel ${i + 1}`)
        });
        updateDropdowns();
    }

    function addChannelType(type) {
        channelTypes.push(type);
        updateChannelTypesList();
    }

    function editChannelType(oldType) {
        const newType = prompt('Enter new channel type:', oldType);
        if (newType && newType !== oldType) {
            const index = channelTypes.indexOf(oldType);
            if (index !== -1) {
                channelTypes[index] = newType;
                updateChannelTypesList();
            }
        }
    }

    function deleteChannelType(type) {
        const index = channelTypes.indexOf(type);
        if (index !== -1) {
            channelTypes.splice(index, 1);
            updateChannelTypesList();
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
                const destChannel = destIndex !== -1 ? `Channel ${destIndex + 1}` : `Channel ${99 - index}`;
                csvContent += `Channel ${index + 1}, ${destChannel}, 1.00, 0\n`;
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

    if (document.getElementById('source-moving-head') && document.getElementById('destination-moving-head')) {
        loadData();
    }

    document.getElementById('generate-button')?.addEventListener('click', generateXDMXMap);
    document.getElementById('edit-button')?.addEventListener('click', () => window.location.href = 'edit.html');
});
