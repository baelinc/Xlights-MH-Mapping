document.addEventListener('DOMContentLoaded', () => {
    const correctPassword = 'admin';
    const passwordForm = document.getElementById('password-form');
    const passwordInput = document.getElementById('password');
    const cancelButton = document.getElementById('cancel-button');

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
                updateLists(); // Update lists for edit page
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

    function setupPasswordPage() {
        if (passwordForm && passwordInput && cancelButton) {
            passwordForm.addEventListener('submit', function(event) {
                event.preventDefault();
                if (passwordInput.value === correctPassword) {
                    window.location.href = 'edit.html';
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
    }

    function setupEditPage() {
        const movingHeadsList = document.getElementById('moving-heads-list');
        const channelTypesList = document.getElementById('channel-types-list');
        const editMovingHeadButton = document.getElementById('edit-moving-head-button');
        const deleteMovingHeadButton = document.getElementById('delete-moving-head-button');
        const editChannelTypeButton = document.getElementById('edit-channel-type-button');
        const deleteChannelTypeButton = document.getElementById('delete-channel-type-button');

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

            if (editMovingHeadButton) {
                editMovingHeadButton.addEventListener('click', editMovingHead);
            }
            if (deleteMovingHeadButton) {
                deleteMovingHeadButton.addEventListener('click', deleteMovingHead);
            }
            if (editChannelTypeButton) {
                editChannelTypeButton.addEventListener('click', editChannelType);
            }
            if (deleteChannelTypeButton) {
                deleteChannelTypeButton.addEventListener('click', deleteChannelType);
            }
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

    function editMovingHead() {
        const movingHeadsList = document.getElementById('moving-heads-list');
        const selectedName = movingHeadsList.value;
        if (selectedName) {
            const movingHead = movingHeads.find(head => head.name === selectedName);
            if (movingHead) {
                // Open an edit form or prompt for editing
                alert(`Editing moving head: ${movingHead.name}`);
            }
        }
    }

    function editChannelType() {
        const channelTypesList = document.getElementById('channel-types-list');
        const selectedType = channelTypesList.value;
        if (selectedType) {
            // Open an edit form or prompt for editing
            alert(`Editing channel type: ${selectedType}`);
        }
    }

    function deleteMovingHead() {
        const movingHeadsList = document.getElementById('moving-heads-list');
        const selectedName = movingHeadsList.value;
        if (selectedName) {
            movingHeads = movingHeads.filter(head => head.name !== selectedName);
            updateLists();
        }
    }

    function deleteChannelType() {
        const channelTypesList = document.getElementById('channel-types-list');
        const selectedType = channelTypesList.value;
        if (selectedType) {
            channelTypes = channelTypes.filter(type => type !== selectedType);
            updateLists();
        }
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
        } else {
            console.error('List elements are missing.');
        }
    }

    document.getElementById('generate-button')?.addEventListener('click', generateXDMXMap);
    document.getElementById('edit-button')?.addEventListener('click', () => window.location.href = 'password.html');

    if (document.getElementById('source-moving-head') && document.getElementById('destination-moving-head')) {
        loadData();
    }

    if (passwordForm && passwordInput && cancelButton) {
        setupPasswordPage();
    }

    if (document.getElementById('moving-heads-list') && document.getElementById('channel-types-list')) {
        setupEditPage();
    }

    document.getElementById('add-moving-head-button')?.addEventListener('click', () => alert('Add Moving Head functionality not implemented.'));
    document.getElementById('add-channel-type-button')?.addEventListener('click', () => alert('Add Channel Type functionality not implemented.'));
});
