document.addEventListener("DOMContentLoaded", function() {
    if (window.location.pathname.endsWith('index.html')) {
        setupIndexPage();
    } else if (window.location.pathname.endsWith('edit.html')) {
        setupEditPage();
    } else if (window.location.pathname.endsWith('password.html')) {
        setupPasswordPage();
    }
});

const data = {
    moving_heads: [],
    channel_types: []
};

const PASSWORD = "admin"; // Hardcoded password for simplicity

async function loadData() {
    try {
        // Adjust the path to point to the data folder
        const response = await fetch('data/moving_heads_channel_types.json');
        if (!response.ok) throw new Error('Network response was not ok.');
        const jsonData = await response.json();
        console.log('Loaded data:', jsonData);  // Debug: Check if data is loaded correctly
        data.moving_heads = jsonData.moving_heads;
        data.channel_types = jsonData.channel_types;
        populateMovingHeadsDropdowns();  // Populate dropdowns after data is loaded
        updateChannelTypesList();        // Populate channel types list on edit page
    } catch (error) {
        console.error('Error loading JSON data:', error);
    }
}

function setupIndexPage() {
    loadData();
    document.getElementById('generate-button').addEventListener('click', generateXDMXMap);
    // Set the default tab
    document.getElementById('manage-tab').classList.add('active');
}

function populateMovingHeadsDropdowns() {
    const sourceDropdown = document.getElementById('source-moving-head');
    const destDropdown = document.getElementById('dest-moving-head');
    const movingHeads = data.moving_heads;

    sourceDropdown.innerHTML = '<option value="">Select Source Moving Head</option>';
    destDropdown.innerHTML = '<option value="">Select Destination Moving Head</option>';

    movingHeads.forEach(movingHead => {
        const optionSource = document.createElement('option');
        optionSource.value = movingHead.name;
        optionSource.textContent = movingHead.name;
        sourceDropdown.appendChild(optionSource);

        const optionDest = document.createElement('option');
        optionDest.value = movingHead.name;
        optionDest.textContent = movingHead.name;
        destDropdown.appendChild(optionDest);
    });

    sourceDropdown.addEventListener('change', () => updateChannels('source'));
    destDropdown.addEventListener('change', () => updateChannels('dest'));
}

function updateChannels(type) {
    const dropdown = document.getElementById(`${type}-moving-head`);
    const selectedHeadName = dropdown.value;
    const channelsDiv = document.getElementById(`${type}-channels`);
    const movingHead = data.moving_heads.find(mh => mh.name === selectedHeadName);

    if (movingHead) {
        channelsDiv.innerHTML = movingHead.channels.map((channel, index) => 
            `<div>Channel ${index + 1}: ${channel}</div>`
        ).join('');
    } else {
        channelsDiv.innerHTML = '';
    }
}

function generateXDMXMap() {
    const sourceDropdown = document.getElementById('source-moving-head');
    const destDropdown = document.getElementById('dest-moving-head');
    const sourceName = sourceDropdown.value;
    const destName = destDropdown.value;
    const sourceHead = data.moving_heads.find(mh => mh.name === sourceName);
    const destHead = data.moving_heads.find(mh => mh.name === destName);

    if (!sourceHead || !destHead) {
        alert('Please select both source and destination moving heads.');
        return;
    }

    const sourceChannels = sourceHead.channels;
    const destChannels = destHead.channels;
    let output = '';

    sourceChannels.forEach((sourceChannel, index) => {
        const destIndex = index < destChannels.length ? index : 99 - (index - destChannels.length);
        const destChannel = destChannels[destIndex] || 'N/A';
        output += `Channel ${index + 1},Channel ${destIndex + 1},1.0,0\n`;
    });

    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mapping.xdmxmap';
    a.click();
    URL.revokeObjectURL(url);
}

function setupEditPage() {
    if (!checkPassword()) {
        window.location.href = 'password.html'; // Redirect to password page if not authenticated
        return;
    }
    loadData();
    const movingHeadsList = document.getElementById('moving-heads-list');
    const channelTypesList = document.getElementById('channel-types-list');

    movingHeadsList.addEventListener('dblclick', (event) => {
        if (event.target.tagName === 'LI') {
            editMovingHead(event.target.textContent);
        }
    });

    channelTypesList.addEventListener('dblclick', (event) => {
        if (event.target.tagName === 'LI') {
            editChannelType(event.target.textContent);
        }
    });

    document.getElementById('add-moving-head-button').addEventListener('click', addMovingHead);
    document.getElementById('edit-moving-head-button').addEventListener('click', () => {
        const selectedMovingHead = movingHeadsList.querySelector('li.selected');
        if (selectedMovingHead) {
            editMovingHead(selectedMovingHead.textContent);
        }
    });
    document.getElementById('delete-moving-head-button').addEventListener('click', deleteMovingHead);

    document.getElementById('add-channel-type-button').addEventListener('click', addChannelType);
    document.getElementById('edit-channel-type-button').addEventListener('click', () => {
        const selectedChannelType = channelTypesList.querySelector('li.selected');
        if (selectedChannelType) {
            editChannelType(selectedChannelType.textContent);
        }
    });
    document.getElementById('delete-channel-type-button').addEventListener('click', deleteChannelType);
}

function setupPasswordPage() {
    document.getElementById('password-form').addEventListener('submit', (event) => {
        event.preventDefault();
        const password = document.getElementById('password').value;
        if (password === PASSWORD) {
            window.location.href = 'edit.html'; // Redirect to edit page if password is correct
        } else {
            alert('Incorrect password');
        }
    });

    document.getElementById('cancel-button').addEventListener('click', () => {
        window.location.href = 'index.html'; // Redirect to index page if cancel is clicked
    });
}

function checkPassword() {
    // If necessary, implement a more secure check mechanism
    return true; // Simplified for demonstration
}

function updateMovingHeadsList() {
    const movingHeadsList = document.getElementById('moving-heads-list');
    movingHeadsList.innerHTML = data.moving_heads.map(mh => `<li>${mh.name}</li>`).join('');
}

function updateChannelTypesList() {
    const channelTypesList = document.getElementById('channel-types-list');
    channelTypesList.innerHTML = data.channel_types.map(ct => `<li>${ct}</li>`).join('');
}

function addMovingHead() {
    const name = prompt('Enter moving head name:');
    if (name) {
        const channels = [];
        const numChannels = parseInt(prompt('Enter number of channels:'), 10);
        for (let i = 1; i <= numChannels; i++) {
            channels.push(prompt(`Enter description for channel ${i}:`));
        }
        data.moving_heads.push({ name, channels });
        updateMovingHeadsList();
        saveData();
    }
}

function editMovingHead(name) {
    const movingHead = data.moving_heads.find(mh => mh.name === name);
    if (movingHead) {
        const newName = prompt('Edit moving head name:', movingHead.name);
        if (newName) {
            movingHead.name = newName;
            movingHead.channels = [];
            const numChannels = parseInt(prompt('Edit number of channels:', movingHead.channels.length), 10);
            for (let i = 1; i <= numChannels; i++) {
                movingHead.channels.push(prompt(`Edit description for channel ${i}:`, movingHead.channels[i - 1]));
            }
            updateMovingHeadsList();
            saveData();
        }
    }
}

function deleteMovingHead() {
    const selectedMovingHead = document.querySelector('#moving-heads-list .selected');
    if (selectedMovingHead) {
        const name = selectedMovingHead.textContent;
        data.moving_heads = data.moving_heads.filter(mh => mh.name !== name);
        updateMovingHeadsList();
        saveData();
    }
}

function addChannelType() {
    const name = prompt('Enter new channel type:');
    if (name) {
        data.channel_types.push(name);
        updateChannelTypesList();
        saveData();
    }
}

function editChannelType(name) {
    const newName = prompt('Edit channel type name:', name);
    if (newName) {
        const index = data.channel_types.indexOf(name);
        if (index !== -1) {
            data.channel_types[index] = newName;
            updateChannelTypesList();
            saveData();
        }
    }
}

function deleteChannelType() {
    const selectedChannelType = document.querySelector('#channel-types-list .selected');
    if (selectedChannelType) {
        const name = selectedChannelType.textContent;
        data.channel_types = data.channel_types.filter(ct => ct !== name);
        updateChannelTypesList();
        saveData();
    }
}

function saveData() {
    // Function to save data to the JSON file
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'moving_heads_channel_types.json';
    a.click();
    URL.revokeObjectURL(url);
}
