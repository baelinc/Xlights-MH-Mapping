const data = {
    moving_heads: [],
    channel_types: []
};
const password = "admin";

document.addEventListener("DOMContentLoaded", function() {
    if (window.location.pathname.endsWith('index.html')) {
        setupIndexPage();
    } else if (window.location.pathname.endsWith('edit.html')) {
        setupEditPage();
    }
});

function setupIndexPage() {
    loadData().then(() => {
        populateMovingHeadsDropdowns();
        document.getElementById('generate-button').addEventListener('click', generateXDMXMap);
    });
}

function setupEditPage() {
    document.getElementById('login-button').addEventListener('click', checkPassword);
    document.getElementById('add-moving-head').addEventListener('click', addMovingHead);
    document.getElementById('delete-moving-head').addEventListener('click', deleteSelectedMovingHead);
    document.getElementById('add-channel-type').addEventListener('click', addChannelType);
    document.getElementById('delete-channel-type').addEventListener('click', deleteSelectedChannelType);
}

async function loadData() {
    try {
        const response = await fetch('moving_heads_channel_types.json');
        const jsonData = await response.json();
        data.moving_heads = jsonData.moving_heads;
        data.channel_types = jsonData.channel_types;
    } catch (error) {
        console.error('Error loading JSON data:', error);
    }
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

function getMovingHeadChannels(name) {
    const movingHead = data.moving_heads.find(head => head.name === name);
    return movingHead ? movingHead.channels : [];
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

        const output = document.createElement('pre');
        output.textContent = xdmxMap;
        document.body.appendChild(output);
    } else {
        alert('Please select both source and destination moving heads.');
    }
}
