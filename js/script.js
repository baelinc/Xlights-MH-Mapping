// Constants
const PASSWORD = "evans"; // Change this to your desired password

document.addEventListener('DOMContentLoaded', () => {
    loadData();
    showTab('manage');
});

// Show a specific tab
function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');

    // Automatically show the default tab content
    if (tabId === 'manage') {
        updateDropdowns();
    }
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
        });
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

// Update channels when moving heads are selected
function updateChannels() {
    const sourceIndex = document.getElementById('source-moving-head').value;
    const destinationIndex = document.getElementById('destination-moving-head').value;
    
    if (sourceIndex !== '' && destinationIndex !== '') {
        const sourceHead = window.data.moving_heads[sourceIndex];
        const destinationHead = window.data.moving_heads[destinationIndex];
        
        console.log(`Source: ${sourceHead.name}, Destination: ${destinationHead.name}`);
    }
}

// Add a new moving head
function addMovingHead() {
    const password = prompt('Enter password to add a new moving head:');
    if (password !== PASSWORD) {
        alert('Incorrect password');
        return;
    }

    const name = prompt('Enter moving head name:');
    if (name) {
        const channels = prompt('Enter channels (comma separated):');
        if (channels) {
            const movingHead = {
                name,
                channels: channels.split(',').map(ch => ch.trim())
            };
            window.data.moving_heads.push(movingHead);
            saveData();
            populateMovingHeads();
        }
    }
}

// Edit an existing moving head
function editMovingHead(head) {
    const password = prompt('Enter password to edit moving head:');
    if (password !== PASSWORD) {
        alert('Incorrect password');
        return;
    }

    const newName = prompt('Edit moving head name:', head.name);
    if (newName) {
        head.name = newName;
        const newChannels = prompt('Edit channels (comma separated):', head.channels.join(','));
        if (newChannels) {
            head.channels = newChannels.split(',').map(ch => ch.trim());
            saveData();
            populateMovingHeads();
        }
    }
}

// Add a new channel type
function addChannelType() {
    const password = prompt('Enter password to add a new channel type:');
    if (password !== PASSWORD) {
        alert('Incorrect password');
        return;
    }

    const type = prompt('Enter new channel type:');
    if (type) {
        window.data.channel_types.push(type);
        saveData();
        populateChannelTypes();
    }
}

// Edit an existing channel type
function editChannelType(type) {
    const password = prompt('Enter password to edit channel type:');
    if (password !== PASSWORD) {
        alert('Incorrect password');
        return;
    }

    const newType = prompt('Edit the channel type:', type);
    if (newType) {
        const index = window.data.channel_types.indexOf(type);
        window.data.channel_types[index] = newType;
        saveData();
        populateChannelTypes();
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
