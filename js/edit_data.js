document.addEventListener('DOMContentLoaded', () => {
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
                updateLists();
            })
            .catch(error => {
                console.error('Error loading data:', error);
                alert('Failed to load data. Please check the console for errors.');
            });
    }

    function updateLists() {
        const movingHeadsList = document.getElementById('moving-heads-list');
        const channelTypesList = document.getElementById('channel-types-list');

        if (movingHeadsList && channelTypesList) {
            movingHeadsList.innerHTML = '';
            channelTypesList.innerHTML = '';

            movingHeads.forEach(movingHead => {
                const option = document.createElement('option');
                option.value = movingHead.name;
                option.textContent = movingHead.name;
                movingHeadsList.appendChild(option);
            });

            channelTypes.forEach(channelType => {
                const option = document.createElement('option');
                option.value = channelType;
                option.textContent = channelType;
                channelTypesList.appendChild(option);
            });

            movingHeadsList.addEventListener('change', () => toggleEditDeleteButtons('moving-heads-list'));
            channelTypesList.addEventListener('change', () => toggleEditDeleteButtons('channel-types-list'));
        } else {
            console.error('List elements are missing.');
        }
    }

    function toggleEditDeleteButtons(listId) {
        const selectedValue = document.getElementById(listId).value;
        const editButtonId = listId === 'moving-heads-list' ? 'edit-moving-head-button' : 'edit-channel-type-button';
        const deleteButtonId = listId === 'moving-heads-list' ? 'delete-moving-head-button' : 'delete-channel-type-button';

        document.getElementById(editButtonId).disabled = !selectedValue;
        document.getElementById(deleteButtonId).disabled = !selectedValue;
    }

    function saveData() {
        const updatedData = {
            moving_heads: movingHeads,
            channel_types: channelTypes
        };

        fetch(dataFilePath, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        })
        .then(response => {
            if (response.ok) {
                alert('Data saved successfully.');
            } else {
                throw new Error('Failed to save data.');
            }
        })
        .catch(error => {
            console.error('Error saving data:', error);
            alert('Failed to save data. Please check the console for errors.');
        });
    }

    function addMovingHead() {
        const name = prompt('Enter the name of the new moving head:');
        if (name && !movingHeads.find(head => head.name === name)) {
            const channels = prompt('Enter channels separated by commas:').split(',').map(channel => channel.trim());
            movingHeads.push({ name, channels });
            updateLists();
        } else {
            alert('Invalid name or moving head already exists.');
        }
    }

    function editMovingHead() {
        const selectedName = document.getElementById('moving-heads-list').value;
        const movingHead = movingHeads.find(head => head.name === selectedName);
        if (movingHead) {
            const newName = prompt('Enter the new name for the moving head:', movingHead.name);
            if (newName && !movingHeads.find(head => head.name === newName)) {
                movingHead.name = newName;
                movingHead.channels = prompt('Enter new channels separated by commas:').split(',').map(channel => channel.trim());
                updateLists();
            } else {
                alert('Invalid name or moving head already exists.');
            }
        }
    }

    function deleteMovingHead() {
        const selectedName = document.getElementById('moving-heads-list').value;
        movingHeads = movingHeads.filter(head => head.name !== selectedName);
        updateLists();
    }

    function addChannelType() {
        const type = prompt('Enter the name of the new channel type:');
        if (type && !channelTypes.includes(type)) {
            channelTypes.push(type);
            updateLists();
        } else {
            alert('Invalid type or channel type already exists.');
        }
    }

    function editChannelType() {
        const selectedType = document.getElementById('channel-types-list').value;
        if (selectedType) {
            const newType = prompt('Enter the new name for the channel type:', selectedType);
            if (newType && !channelTypes.includes(newType)) {
                channelTypes = channelTypes.map(type => type === selectedType ? newType : type);
                updateLists();
            } else {
                alert('Invalid name or channel type already exists.');
            }
        }
    }

    function deleteChannelType() {
        const selectedType = document.getElementById('channel-types-list').value;
        channelTypes = channelTypes.filter(type => type !== selectedType);
        updateLists();
    }

    document.getElementById('save-changes-button')?.addEventListener('click', saveData);
    document.getElementById('add-moving-head-button')?.addEventListener('click', addMovingHead);
    document.getElementById('edit-moving-head-button')?.addEventListener('click', editMovingHead);
    document.getElementById('delete-moving-head-button')?.addEventListener('click', deleteMovingHead);
    document.getElementById('add-channel-type-button')?.addEventListener('click', addChannelType);
    document.getElementById('edit-channel-type-button')?.addEventListener('click', editChannelType);
    document.getElementById('delete-channel-type-button')?.addEventListener('click', deleteChannelType);
    document.getElementById('back-button')?.addEventListener('click', () => window.location.href = 'index.html');

    loadData();
});
