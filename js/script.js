let data = {
    moving_heads: [],
    channel_types: []
};
const password = "admin"; // Set your desired password here

document.addEventListener("DOMContentLoaded", function() {
    if (window.location.pathname.endsWith('index.html')) {
        loadData();
    } else if (window.location.pathname.endsWith('edit.html')) {
        document.getElementById('edit-content').style.display = 'none'; // Hide edit content initially
    }
});

function loadData() {
    fetch('moving_heads_channel_types.json')
        .then(response => response.json())
        .then(jsonData => {
            data = jsonData;
            populateMovingHeadsDropdowns();
            populateChannelTypesList();
        })
        .catch(error => console.error('Error loading JSON data:', error));
}

function populateMovingHeadsDropdowns() {
    const sourceDropdown = document.getElementById('source-moving-head');
    const destDropdown = document.getElementById('dest-moving-head');
    const movingHeads = data.moving_heads;

    sourceDropdown.innerHTML = '<option value="">Select Source Moving Head</option>';
    destDropdown.innerHTML = '<option value="">Select Destination Moving Head</option>';

    movingHeads.forEach(movingHead => {
        const option = document.createElement('option');
        option.value = movingHead.name;
        option.textContent = movingHead.name;
        sourceDropdown.appendChild(option);

        const option2 = document.createElement('option');
        option2.value = movingHead.name;
        option2.textContent = movingHead.name;
        destDropdown.appendChild(option2);
    });

    sourceDropdown.addEventListener('change', updateChannelsDisplay);
    destDropdown.addEventListener('change', updateChannelsDisplay);
}

function populateChannelTypesList() {
    const listbox = document.getElementById('channel-types-list');
    const channelTypes = data.channel_types;

    listbox.innerHTML = '';

    channelTypes.forEach(type => {
        const listItem = document.createElement('li');
        listItem.textContent = type;
        listItem.ondblclick = () => editChannelType(type);
        listbox.appendChild(listItem);
    });
}

function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = tab.id === tabId ? 'block' : 'none';
    });

    if (tabId === 'edit') {
        populateMovingHeadsList();
        populateChannelTypesList();
    }
}

function populateMovingHeadsList() {
    const listbox = document.getElementById('moving-heads-list');
    const movingHeads = data.moving_heads;

    listbox.innerHTML = '';

    movingHeads.forEach(movingHead => {
        const listItem = document.createElement('li');
        listItem.textContent = movingHead.name;
        listItem.ondblclick = () => editMovingHead(movingHead);
        listbox.appendChild(listItem);
    });
}

function editMovingHead(movingHead) {
    const name = prompt('Enter new name for the moving head:', movingHead.name);
    if (name !== null) {
        const channels = prompt('Enter the number of channels:', movingHead.channels.length);
        if (channels !== null) {
            movingHead.name = name;
            movingHead.channels = Array.from({ length: channels }, (_, i) => data.channel_types[0]); // Initialize with default channel type
            populateMovingHeadsList();
            populateMovingHeadsDropdowns();
        }
    }
}

function addMovingHead() {
    const name = prompt('Enter the name of the new moving head:');
    if (name !== null) {
        const channels = prompt('Enter the number of channels for the new moving head:');
        if (channels !== null) {
            data.moving_heads.push({
                name: name,
                channels: Array.from({ length: channels }, (_, i) => data.channel_types[0]) // Initialize with default channel type
            });
            populateMovingHeadsList();
            populateMovingHeadsDropdowns();
        }
    }
}

function deleteSelectedMovingHead() {
    const name = prompt('Enter the name of the moving head to delete:');
    if (name !== null) {
        data.moving_heads = data.moving_heads.filter(head => head.name !== name);
        populateMovingHeadsList();
        populateMovingHeadsDropdowns();
    }
}

function editChannelType(type) {
    const newType = prompt('Enter new name for the channel type:', type);
    if (newType !== null) {
        const index = data.channel_types.indexOf(type);
        if (index !== -1) {
            data.channel_types[index] = newType;
            populateChannelTypesList();
        }
    }
}

function addChannelType() {
    const type = prompt('Enter the new channel type:');
    if (type !== null) {
        data.channel_types.push(type);
        populateChannelTypesList();
    }
}

function deleteSelectedChannelType() {
    const type = prompt('Enter the name of the channel type to delete:');
    if (type !== null) {
        data.channel_types = data.channel_types.filter(t => t !== type);
        populateChannelTypesList();
    }
}

function checkPassword() {
    const enteredPassword = document.getElementById('password').value;
    if (enteredPassword === password) {
        document.getElementById('edit-content').style.display = 'block';
        document.getElementById('password').value = '';
    } else {
        alert('Incorrect password');
    }
}

function generateXDMXMap() {
    const sourceName = document.getElementById('source-moving-head').value;
    const destName = document.getElementById('dest-moving-head').value;

    if (sourceName && destName) {
        const sourceChannels = getMovingHeadChannels(sourceName);
        const destChannels = getMovingHeadChannels(destName);

        let xdmxMap = '';
        let nextChannelNumber = 99;

        sourceChannels.forEach((srcChannel, index) => {
            const destChannel = destChannels[index] || `Channel ${nextChannelNumber--}`;
            xdmxMap += `Channel ${index + 1},${destChannel},1.0,0\n`;
        });

        document.getElementById('xdmx-map-output').textContent = xdmxMap;
    } else {
        alert('Please select both source and destination moving heads.');
    }
}

function getMovingHeadChannels(name) {
    const movingHead = data.moving_heads.find(head => head.name === name);
    return movingHead ? movingHead.channels : [];
}

function updateChannelsDisplay() {
    const sourceName = document.getElementById('source-moving-head').value;
    const destName = document.getElementById('dest-moving-head').value;

    const sourceChannelsDiv = document.getElementById('source-channels');
    const destChannelsDiv = document.getElementById('dest-channels');

    sourceChannelsDiv.innerHTML = `<h3>Source Channels for ${sourceName}</h3>`;
    destChannelsDiv.innerHTML = `<h3>Destination Channels for ${destName}</h3>`;

    if (sourceName) {
        const sourceChannels = getMovingHeadChannels(sourceName);
        sourceChannels.forEach((channel, index) => {
            const p = document.createElement('p');
            p.textContent = `Channel ${index + 1}: ${channel}`;
            sourceChannelsDiv.appendChild(p);
        });
    }

    if (destName) {
        const destChannels = getMovingHeadChannels(destName);
        destChannels.forEach((channel, index) => {
            const p = document.createElement('p');
            p.textContent = `Channel ${index + 1}: ${channel}`;
            destChannelsDiv.appendChild(p);
        });
    }
}
