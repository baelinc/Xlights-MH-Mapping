document.addEventListener('DOMContentLoaded', () => {
    const sourceMovingHeadSelect = document.getElementById('source-moving-head');
    const destMovingHeadSelect = document.getElementById('dest-moving-head');
    const sourceChannelsDiv = document.getElementById('source-channels');
    const destChannelsDiv = document.getElementById('dest-channels');
    const generateButton = document.getElementById('generate-button');
    const editButton = document.getElementById('edit-button');

    // Fetch data and populate dropdowns
    fetch('data/moving_heads_channel_types.json')
        .then(response => response.json())
        .then(data => {
            const { moving_heads } = data;

            if (moving_heads && moving_heads.length > 0) {
                moving_heads.forEach(movingHead => {
                    const option = document.createElement('option');
                    option.value = movingHead.name;
                    option.textContent = movingHead.name;
                    sourceMovingHeadSelect.appendChild(option);
                    const destOption = option.cloneNode(true);
                    destMovingHeadSelect.appendChild(destOption);
                });
            } else {
                console.error('No moving heads data available');
            }

            // Update channels based on selected moving head
            const updateChannels = (movingHeadName, channelsDiv) => {
                channelsDiv.innerHTML = '';
                const movingHead = moving_heads.find(mh => mh.name === movingHeadName);
                if (movingHead) {
                    movingHead.channels.forEach((channel, index) => {
                        const div = document.createElement('div');
                        div.textContent = `Channel ${index + 1}: ${channel}`;
                        channelsDiv.appendChild(div);
                    });
                }
            };

            sourceMovingHeadSelect.addEventListener('change', (event) => {
                updateChannels(event.target.value, sourceChannelsDiv);
            });

            destMovingHeadSelect.addEventListener('change', (event) => {
                updateChannels(event.target.value, destChannelsDiv);
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

    if (generateButton) {
        generateButton.addEventListener('click', () => {
            const sourceMovingHead = sourceMovingHeadSelect.value;
            const destMovingHead = destMovingHeadSelect.value;
            const sourceMovingHeadChannels = Array.from(sourceChannelsDiv.querySelectorAll('div'));
            const destMovingHeadChannels = Array.from(destChannelsDiv.querySelectorAll('div'));

            let mappings = [];
            let blankChannelNumber = 99;

            sourceMovingHeadChannels.forEach((sourceChannelDiv, index) => {
                const sourceChannelDescription = sourceChannelDiv.textContent.split(': ')[1].trim();
                let destChannelNumber = '';
                let destChannelDescription = '';

                // Find matching destination channel
                const destChannelDiv = destMovingHeadChannels.find(div => div.textContent.includes(sourceChannelDescription));
                if (destChannelDiv) {
                    destChannelDescription = destChannelDiv.textContent.split(': ')[1].trim();
                    destChannelNumber = destChannelDiv.textContent.split(' ')[1];
                } else {
                    // Handle blank channels
                    if (sourceChannelDescription === 'Blank') {
                        destChannelNumber = blankChannelNumber--;
                    } else {
                        destChannelNumber = 'N/A';
                    }
                }

                mappings.push(`Channel ${index + 1},Channel ${destChannelNumber},1.00,0`);
            });

            // Create and download the .xdmxmap file
            const blob = new Blob([mappings.join('\n')], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'mapping.xdmxmap';
            document.body.appendChild(a);
            a.click();
            URL.revokeObjectURL(url);
        });
    }

    if (editButton) {
        editButton.addEventListener('click', () => {
            window.location.href = 'password.html';
        });
    }
});
