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
                if (document.getElementById('moving-heads-list') && document.getElementById('channel-types-list')) {
                    updateLists();
                }
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

            // Enable buttons based on selection
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

    function addMovingHead() {
        // Implement the add functionality here
        alert('Add Moving Head functionality not implemented.');
    }

    function addChannelType() {
        // Implement the add functionality here
        alert('Add Channel Type functionality not implemented.');
    }

    document.getElementById('generate-button')?.addEventListener('click', generateXDMXMap);
    document.getElementById('edit-button')?.addEventListener('click', () => window.location.href = 'password.html');
    document.getElementById('add-moving-head-button')?.addEventListener('click', addMovingHead);
    document.getElementById('add-channel-type-button')?.addEventListener('click', addChannelType);
    document.getElementById('edit-moving-head-button')?.addEventListener('click', editMovingHead);
    document.getElementById('edit-channel-type-button')?.addEventListener('click', editChannelType);
    document.getElementById('delete-moving-head-button')?.addEventListener('click', deleteMovingHead);
    document.getElementById('delete-channel-type-button')?.addEventListener('click', deleteChannelType);

    if (document.getElementById('source-moving-head') && document.getElementById('destination-moving-head')) {
        loadData();
    }
});
