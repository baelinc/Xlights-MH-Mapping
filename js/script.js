// Constants
const PASSWORD = "evans"; // Set this to your desired password

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('main')) {
        loadData();
        showTab('main');
    }
    if (document.getElementById('manage')) {
        loadData();
        showTab('manage');
    }
    if (document.getElementById('add-moving-head')) {
        document.getElementById('add-moving-head-form').addEventListener('submit', addMovingHead);
    }
    if (document.getElementById('add-channel-type')) {
        document.getElementById('add-channel-type-form').addEventListener('submit', addChannelType);
    }
    if (document.getElementById('edit-moving-head')) {
        document.getElementById('edit-moving-head-form').addEventListener('submit', updateMovingHead);
    }
    if (document.getElementById('edit-channel-type')) {
        document.getElementById('edit-channel-type-form').addEventListener('submit', updateChannelType);
    }
});

// Show a specific tab
function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');
}

// Load data from the JSON file
function loadData() {
    fetch('data/moving_heads_channel_types.json')
        .then(response => response.json())
        .then(data => {
            window.data = data;
            populateMovingHeads();
            populateChannelTypes();
            updateDropdowns();
        })
        .catch(error => console.error('Error loading data:', error));
}

// Populate the moving heads list
function populateMovingHeads() {
    const list = document.getElementById('moving-heads-list');
    list.innerHTML = '';
    window.data.moving_heads.forEach((head, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${head.name} (${head.channels.join(', ')})`;
        listItem.addEventListener('dblclick', () => editMovingHead(head));
        listItem.dataset.index = index;
        list.appendChild(listItem);
    });
}

// Populate the channel types list
function populateChannelTypes() {
    const list = document.getElementById('channel-types-list');
    list.innerHTML = '';
    window.data.channel_types.forEach((type, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = type;
        listItem.addEventListener('dblclick', () => editChannelType(type));
        listItem.dataset.index = index;
        list.appendChild(listItem);
    });
}

// Update dropdowns with moving head options
function updateDropdowns() {
    const sourceSelect = document.getElementById('source-moving-head');
    const destinationSelect = document.getElementById('destination-moving-head');

    sourceSelect.innerHTML = '<option value="">Select Source Moving Head</option>';
    destinationSelect.innerHTML = '<option value="">Select Destination Moving Head</option>';

    window.data.moving_heads.forEach((head, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = head.name;
        sourceSelect.appendChild(option);
        destinationSelect.appendChild(option.cloneNode(true));
    });
}

// Update channels for the selected moving head
function updateChannels(type) {
    const select = document.getElementById(`${type}-moving-head`);
    const channelsDiv = document.getElementById(`${type}-channels`);
    channelsDiv.innerHTML = '';

    const index = select.value;
    if (index !== '') {
        const movingHead = window.data.moving_heads[index];
        movingHead.channels.forEach((channel, i) => {
            const channelElement = document.createElement('div');
            channelElement.textContent = `Channel ${i + 1}: ${channel}`;
            channelsDiv.appendChild(channelElement);
        });
    }
}

// Add a new moving head
function addMovingHead(event) {
    event.preventDefault();

    const password = prompt('Enter password to add a new moving head:');
    if (password !== PASSWORD) {
        alert('Incorrect password');
        return;
    }

    const name = document.getElementById('moving-head-name').value;
    const channels = document.getElementById('moving-head-channels').value;

    if (name && channels) {
        const movingHead = {
            name,
            channels: channels.split(',').map(ch => ch.trim())
        };
        window.data.moving_heads.push(movingHead);
        saveData();
        window.location.href = 'edit.html';
    }
}

// Update an existing moving head
function updateMovingHead(event) {
    event.preventDefault();

    const password = prompt('Enter password to update moving head:');
    if (password !== PASSWORD) {
        alert('Incorrect password');
        return;
    }

    const name = document.getElementById('edit-moving-head-name').value;
    const channels = document.getElementById('edit-moving-head-channels').value;
    const index = document.getElementById('edit-moving-head-form').dataset.index;

    if (name && channels && index !== undefined) {
        window.data.moving_heads[index] = {
            name,
            channels: channels.split(',').map(ch => ch.trim())
        };
        saveData();
        window.location.href = 'edit.html';
    }
}

// Add a new channel type
function addChannelType(event) {
    event.preventDefault();

    const password = prompt('Enter password to add a new channel type:');
    if (password !== PASSWORD) {
        alert('Incorrect password');
        return;
    }

    const type = document.getElementById('channel-type-name').value;
    if (type) {
        window.data.channel_types.push(type);
        saveData();
        window.location.href = 'edit.html';
    }
}

// Update an existing channel type
function updateChannelType(event) {
    event.preventDefault();

    const password = prompt('Enter password to update channel type:');
    if (password !== PASSWORD) {
        alert('Incorrect password');
        return;
    }

    const type = document.getElementById('edit-channel-type-name').value;
    const index = document.getElementById('edit-channel-type-form').dataset.index;

    if (type && index !== undefined) {
        window.data.channel_types[index] = type;
        saveData();
        window.location.href = 'edit.html';
    }
}

// Delete a moving head
function deleteMovingHead() {
    const password = prompt('Enter password to delete a moving head:');
    if (password !== PASSWORD) {
        alert('Incorrect password');
        return;
    }

    const list = document.getElementById('moving-heads-list');
    const selected = list.querySelector('li.selected');
    if (selected) {
        const index = selected.dataset.index;
        window.data.moving_heads.splice(index, 1);
        saveData();
        populateMovingHeads();
    }
}

// Delete a channel type
function deleteChannelType() {
    const password = prompt('Enter password to delete a channel type:');
    if (password !== PASSWORD) {
        alert('Incorrect password');
        return;
    }

    const list = document.getElementById('channel-types-list');
    const selected = list.querySelector('li.selected');
    if (selected) {
        const index = selected.dataset.index;
        window.data.channel_types.splice(index, 1);
        saveData();
        populateChannelTypes();
    }
}

// Generate the XDMX map file
function generateXDMXMap() {
    const sourceIndex = document.getElementById('source-moving-head').value;
    const destinationIndex = document.getElementById('destination-moving-head').value;
    
    if (sourceIndex !== '' && destinationIndex !== '') {
        const sourceHead = window.data.moving_heads[sourceIndex];
        const destinationHead = window.data.moving_heads[destinationIndex];
        
        let xdmxMap = '';

        sourceHead.channels.forEach((sourceChannel, index) => {
            const destChannel = destinationHead.channels[index] || `Channel ${99 - (sourceHead.channels.length - index - 1)}`;
            xdmxMap += `Channel ${index + 1},${destChannel},1.0,0\n`;
        });

        document.getElementById('xdmx-map-output').textContent = xdmxMap;
    } else {
        alert('Please select both source and destination moving heads.');
    }
}

// Save data to a JSON file
function saveData() {
    const data = JSON.stringify(window.data, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'moving_heads_channel_types.json';
    a.click();
    URL.revokeObjectURL(url);
}
