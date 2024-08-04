document.addEventListener("DOMContentLoaded", function () {
    loadJSON('data/moving_heads_channel_types.json', function (data) {
        window.data = data;
        populateMovingHeads();
        populateChannelTypes();
    });

    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const password = document.getElementById('password').value;
        if (password === 'evans') { // Replace 'your_password' with the desired password
            document.getElementById('editLogin').style.display = 'none';
            document.getElementById('Edit').style.display = 'block';
            document.getElementById('ChannelTypes').style.display = 'block';
        } else {
            alert('Incorrect password');
        }
    });
});

function loadJSON(path, callback) {
    var xhr = new XMLHttpRequest();
    xhr.overrideMimeType("application/json");
    xhr.open('GET', path, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == "200") {
            callback(JSON.parse(xhr.responseText));
        }
    };
    xhr.send(null);
}

function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].style.backgroundColor = "";
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.style.backgroundColor = "#555";
}

function populateMovingHeads() {
    const sourceSelect = document.getElementById('sourceMovingHead');
    const targetSelect = document.getElementById('targetMovingHead');
    const list = document.getElementById('movingHeadsList');
    sourceSelect.innerHTML = '';
    targetSelect.innerHTML = '';
    list.innerHTML = '';
    window.data.moving_heads.forEach(head => {
        const option = document.createElement('option');
        option.value = head.name;
        option.textContent = head.name;
        sourceSelect.appendChild(option);

        const option2 = document.createElement('option');
        option2.value = head.name;
        option2.textContent = head.name;
        targetSelect.appendChild(option2);

        const listItem = document.createElement('li');
        listItem.textContent = head.name;
        listItem.addEventListener('dblclick', () => editMovingHead(head.name));
        list.appendChild(listItem);
    });
}

function populateChannelTypes() {
    const list = document.getElementById('channelTypesList');
    list.innerHTML = '';
    window.data.channel_types.forEach(type => {
        const listItem = document.createElement('li');
        listItem.textContent = type;
        listItem.addEventListener('dblclick', () => editChannelType(type));
        list.appendChild(listItem);
    });
}

function populateChannels(type) {
    const select = document.getElementById(`${type}MovingHead`);
    const ul = document.getElementById(`${type}Channels`);
    const head = window.data.moving_heads.find(h => h.name === select.value);
    ul.innerHTML = '';
    head.channels.forEach((channel, index) => {
        const li = document.createElement('li');
        li.textContent = `Channel ${index + 1}: ${channel}`;
        ul.appendChild(li);
    });
}

function generateFile() {
    const sourceHead = document.getElementById('sourceMovingHead').value;
    const targetHead = document.getElementById('targetMovingHead').value;
    const source = window.data.moving_heads.find(h => h.name === sourceHead);
    const target = window.data.moving_heads.find(h => h.name === targetHead);

    let output = '';
    source.channels.forEach((sourceChannel, index) => {
        const targetIndex = target.channels.findIndex(ch => ch === sourceChannel);
        const targetChannel = targetIndex === -1 ? 99 - index : targetIndex + 1;
        output += `Channel ${index + 1},Channel ${targetChannel},1.0,0\n`;
    });

    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mapping.xdmxmap';
    a.click();
    URL.revokeObjectURL(url);
}

function addMovingHead() {
    const name = prompt('Enter the name of the new moving head:');
    if (name) {
        const channels = prompt('Enter the number of channels:');
        const newHead = {
            name,
            channels: Array.from({ length: channels }, (_, i) => `Channel ${i + 1}`)
        };
        window.data.moving_heads.push(newHead);
        saveData();
        populateMovingHeads();
    }
}

function addChannelType() {
    const type = prompt('Enter the new channel type:');
    if (type) {
        window.data.channel_types.push(type);
        saveData();
        populateChannelTypes();
    }
}

function editMovingHead(name) {
    const head = window.data.moving_heads.find(h => h.name === name);
    const newName = prompt('Edit the name of the moving head:', head.name);
    if (newName) {
        head.name = newName;
        saveData();
        populateMovingHeads();
    }
}

function editChannelType(type) {
    const newType = prompt('Edit the channel type:', type);
    if (newType) {
        const index = window.data.channel_types.indexOf(type);
        window.data.channel_types[index] = newType;
        saveData();
        populateChannelTypes();
    }
}

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
