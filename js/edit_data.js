document.addEventListener('DOMContentLoaded', () => {
    const movingHeadsList = document.getElementById('moving-heads-list');
    const channelTypesList = document.getElementById('channel-types-list');
    const editMovingHeadButton = document.getElementById('edit-moving-head-button');
    const deleteMovingHeadButton = document.getElementById('delete-moving-head-button');
    const editChannelTypeButton = document.getElementById('edit-channel-type-button');
    const deleteChannelTypeButton = document.getElementById('delete-channel-type-button');
    const saveChangesButton = document.getElementById('save-changes-button');
    const backButton = document.getElementById('back-button');

    let movingHeads = [];
    let channelTypes = [];

    function loadData() {
        fetch('data/moving_heads_channel_types.json')
            .then(response => response.json())
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
    }

    function toggleEditDeleteButtons(listId) {
        const selectedValue = document.getElementById(listId).value;
        const editButtonId = listId === 'moving-heads-list' ? 'edit-moving-head-button' : 'edit-channel-type-button';
        const deleteButtonId = listId === 'moving-heads-list' ? 'delete-moving-head-button' : 'delete-channel-type-button';

        document.getElementById(editButtonId).disabled = !selectedValue;
        document.getElementById(deleteButtonId).disabled = !selectedValue;
    }

    function editMovingHead() {
        const selectedName = movingHeadsList.value;
        if (selectedName) {
            const movingHead = movingHeads.find(head => head.name === selectedName);
            if (movingHead) {
                const url = `edit_moving_head.html?name=${encodeURIComponent(movingHead.name)}&channels=${movingHead.channels.length}`;
                window.location.href = url;
            }
        }
    }

    function addMovingHead() {
        const url = 'edit_moving_head.html?new=true';
        window.location.href = url;
    }

    function deleteMovingHead() {
        const selectedName = movingHeadsList.value;
        if (selectedName) {
            movingHeads = movingHeads.filter(head => head.name !== selectedName);
            updateLists();
        }
    }

    function editChannelType() {
        const selectedType = channelTypesList.value;
        if (selectedType) {
            alert(`Editing channel type: ${selectedType}`);
        }
    }

    function deleteChannelType() {
        const selectedType = channelTypesList.value;
        if (selectedType) {
            channelTypes = channelTypes.filter(type => type !== selectedType);
            updateLists();
        }
    }

    function saveData() {
        // Save logic for moving heads and channel types
    }

    function goBack() {
        window.location.href = 'index.html';
    }

    document.getElementById('edit-moving-head-button')?.addEventListener('click', editMovingHead);
    document.getElementById('add-moving-head-button')?.addEventListener('click', addMovingHead);
    document.getElementById('delete-moving-head-button')?.addEventListener('click', deleteMovingHead);
    document.getElementById('edit-channel-type-button')?.addEventListener('click', editChannelType);
    document.getElementById('delete-channel-type-button')?.addEventListener('click', deleteChannelType);
    document.getElementById('save-changes-button')?.addEventListener('click', saveData);
    document.getElementById('back-button')?.addEventListener('click', goBack);

    movingHeadsList.addEventListener('change', () => toggleEditDeleteButtons('moving-heads-list'));
    channelTypesList.addEventListener('change', () => toggleEditDeleteButtons('channel-types-list'));

    loadData();
});
