document.addEventListener('DOMContentLoaded', () => {
    const sourceMovingHeadSelect = document.getElementById('source-moving-head');
    const destMovingHeadSelect = document.getElementById('dest-moving-head');
    const sourceChannelsDiv = document.getElementById('source-channels');
    const destChannelsDiv = document.getElementById('dest-channels');
    const generateButton = document.getElementById('generate-button');
    const editButton = document.getElementById('edit-button');
    const passwordForm = document.getElementById('password-form');
    const cancelButton = document.getElementById('cancel-button');
    const passwordEditPage = document.getElementById('password-edit-page');
    const addMovingHeadForm = document.getElementById('add-moving-head-form');
    const addChannelTypeForm = document.getElementById('add-channel-type-form');
    const movingHeadList = document.getElementById('moving-head-list');
    const channelTypeList = document.getElementById('channel-type-list');

    if (editButton) {
        editButton.addEventListener('click', () => {
            window.location.href = 'password.html';
        });
    }

    if (passwordForm) {
        passwordForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const password = document.getElementById('password').value;
            if (password === 'admin') {
                window.location.href = 'edit.html';
            } else {
                alert('Incorrect password');
            }
        });
    }

    if (cancelButton) {
        cancelButton.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    // Fetch data and populate dropdowns
    fetch('data/moving_heads_channel_types.json')
        .then(response => response.json())
        .then(data => {
            console.log('Data fetched:', data); // Debugging line
            const { moving_heads, channel_types } = data;

            if (moving_heads && moving_heads.length > 0) {
                moving_heads.forEach(movingHead => {
                    const option = document.createElement('option');
                    option.value = movingHead.name;
                    option.textContent = movingHead.name;
                    sourceMovingHeadSelect.appendChild(option);
                    const destOption = option.cloneNode(true);
                    destMovingHeadSelect.appendChild(destOption);
                });
            } else {
                console.error('No moving heads data available');
            }

            if (channel_types && channel_types.length > 0) {
                channel_types.forEach(channelType => {
                    const listItem = document.createElement('li');
                    listItem.textContent = channelType;
                    listItem.addEventListener('dblclick', () => {
                        editChannelType(channelType);
                    });
                    channelTypeList.appendChild(listItem);
                });
            } else {
                console.error('No channel types data available');
            }

            // Update channels based on selected moving head
            const updateChannels = (movingHeadName, channelsDiv) => {
                channelsDiv.innerHTML = '';
                const movingHead = moving_heads.find(mh => mh.name === movingHeadName);
                if (movingHead) {
                    movingHead.channels.forEach((channel, index) => {
                        const div = document.createElement('div');
                        div.textContent = `Channel ${index + 1}: ${channel}`;
                        channelsDiv.appendChild(div);
                    });
                }
            };

            sourceMovingHeadSelect.addEventListener('change', (event) => {
                updateChannels(event.target.value, sourceChannelsDiv);
            });

            destMovingHeadSelect.addEventListener('change', (event) => {
                updateChannels(event.target.value, destChannelsDiv);
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

    if (generateButton) {
        generateButton.addEventListener('click', () => {
            const sourceMovingHead = sourceMovingHeadSelect.value;
            const destMovingHead = destMovingHeadSelect.value;
            const sourceMovingHeadChannels = sourceChannelsDiv.querySelectorAll('div');
            const destMovingHeadChannels = destChannelsDiv.querySelectorAll('div');

            let mappings = [];
            sourceMovingHeadChannels.forEach((sourceChannelDiv, index) => {
                const sourceChannel = sourceChannelDiv.textContent.split(': ')[1];
                const destChannelDiv = destMovingHeadChannels[index];
                const destChannel = destChannelDiv ? destChannelDiv.textContent.split(': ')[1] : `Channel ${99 - index}`;
                mappings.push(`Channel ${index + 1},${destChannel},1.0,0`);
            });

            // Create and download the .xdmxmap file
            const blob = new Blob([mappings.join('\n')], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'mapping.xdmxmap';
            document.body.appendChild(a);
            a.click();
            URL.revokeObjectURL(url);
        });
    }

    if (addMovingHeadForm) {
        addMovingHeadForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const name = document.getElementById('moving-head-name').value;
            const channels = [];
            for (let i = 1; i <= parseInt(document.getElementById('num-channels').value, 10); i++) {
                const channelType = document.getElementById(`channel-${i}`).value;
                channels.push(channelType);
            }
            // Add moving head to the data
            addMovingHead(name, channels);
        });
    }

    if (addChannelTypeForm) {
        addChannelTypeForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const newChannelType = document.getElementById('new-channel-type').value;
            // Add channel type to the data
            addChannelType(newChannelType);
        });
    }

    function addMovingHead(name, channels) {
        fetch('data/moving_heads_channel_types.json')
            .then(response => response.json())
            .then(data => {
                data.moving_heads.push({ name, channels });
                return fetch('data/moving_heads_channel_types.json', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            })
            .then(() => {
                alert('Moving head added successfully!');
                window.location.reload();
            });
    }

    function addChannelType(newChannelType) {
        fetch('data/moving_heads_channel_types.json')
            .then(response => response.json())
            .then(data => {
                data.channel_types.push(newChannelType);
                return fetch('data/moving_heads_channel_types.json', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            })
            .then(() => {
                alert('Channel type added successfully!');
                window.location.reload();
            });
    }

    function editChannelType(channelType) {
        const newChannelType = prompt('Edit channel type:', channelType);
        if (newChannelType) {
            fetch('data/moving_heads_channel_types.json')
                .then(response => response.json())
                .then(data => {
                    const index = data.channel_types.indexOf(channelType);
                    if (index > -1) {
                        data.channel_types[index] = newChannelType;
                        return fetch('data/moving_heads_channel_types.json', {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(data)
                        });
                    }
                })
                .then(() => {
                    alert('Channel type updated successfully!');
                    window.location.reload();
                });
        }
    }
});
