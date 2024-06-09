document.addEventListener('DOMContentLoaded', function() {
    const terminalBody = document.getElementById('terminalBody');
    const defaultMessage = 'BT-WOS [Version 1.6.4.4] (c) Barclay Software. All Rights Reserved.';
    
    const defaultOutput = document.createElement('div');
    defaultOutput.textContent = defaultMessage;
    terminalBody.appendChild(defaultOutput);
});

const userInput = document.getElementById('userInput');
const commandHistory = [];
let historyIndex = -1;
let isSelectingText = false;

document.addEventListener('mousedown', function() {
    isSelectingText = false;
});

document.addEventListener('mousemove', function() {
    isSelectingText = true;
});

document.addEventListener('mouseup', function() {
    if (!isSelectingText) {
        userInput.focus();
    }
});

document.addEventListener('contextmenu', function(event) {
    event.preventDefault();
});

userInput.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        const command = userInput.value.trim().toLowerCase();
        if (command !== '') {
            commandHistory.push(command);
            historyIndex = commandHistory.length;
            executeCommand(command);
        }
        userInput.value = '';
    } else if (event.key === 'ArrowUp') {
        if (historyIndex > 0) {
            historyIndex--;
            userInput.value = commandHistory[historyIndex];
        }
    } else if (event.key === 'ArrowDown') {
        if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            userInput.value = commandHistory[historyIndex];
        } else {
            historyIndex = commandHistory.length;
            userInput.value = '';
        }
    }
});

function executeCommand(command) {
    const terminalBody = document.getElementById('terminalBody');

    const commandDiv = document.createElement('div');
    commandDiv.textContent = `$ ${command}`;
    terminalBody.appendChild(commandDiv);

    const output = document.createElement('div');
    terminalBody.appendChild(output);

    const line = document.createElement('hr');
    terminalBody.appendChild(line);

    const parts = command.split(' ');
    const cmd = parts[0];

    if (cmd === 'hello' && parts[1] === 'world') {
        parts.splice(0, 2, 'hello_world');
    }

    if (cmd === 'short' && parts[1] === 'define') {
        parts.splice(0, 2, 'short_define');
    }

    if (cmd === 'weather' && parts[1] === 'in') {
        parts.splice(0, 2, 'weather_find');
    }

    switch (parts[0]) {
        case 'about':
            output.innerHTML = `BT-WOS is a text-based web desktop. Portions of this code are protected by copyright and created specifically for Barclay Softare and their licensees. Type 'command' for a list of possible commands.`;
            break;

        case 'calc':
            if (parts.length < 2) {
                output.textContent = 'Usage: calc <expression>';
            } else {
                const expression = parts.slice(1).join(' ');
                try {
                    const result = math.evaluate(expression);
                    output.textContent = `${expression} = ${result}`;
                } catch (error) {
                    output.textContent = 'Error: Invalid expression';
                }
            }
            break;

        case 'command':
            output.innerHTML = 'Available commands: <br> about <br> calc <br> command <br> copyright <br> date <br> define <br> echo <br> exit <br> find <br> goto <br> hello world <br> help <br> mailto <br> print <br> repo <br> short define <br> time <br> weather <br> weather in <br> whois <br> woskey';
            break;

        case 'copyright':
            output.innerHTML = 'BT-WOS was created by Barclay Software. Copyright (c) 2024 Barclay Software.';
            break;

        case 'date':
            const date = new Date();
            output.textContent = `Current Date and Time: ${date}`;
            break;

        case 'define':
            if (parts.length < 2) {
                output.textContent = 'WARN: This command is for a full definition. Usage: define <word>';
            } else {
                const word = parts[1];
                const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

                fetch(apiUrl)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Word not found');
                        }
                        return response.json();
                    })
                    .then(data => {
                        const definitions = data[0].meanings.map(meaning => {
                            const partOfSpeech = meaning.partOfSpeech;
                            const definitions = meaning.definitions.map(def => {
                                return `Definition: ${def.definition}\n Example: ${def.example || 'N/A'}\n Synonyms: ${def.synonyms.join(', ') || 'N/A'}`;
                            }).join('\n');
                            return `Part of Speech: ${partOfSpeech}\n${definitions}`;
                        }).join('\n\n');
                        output.textContent = `Definitions for '${word}':\n${definitions}`;
                    })
                    .catch(error => {
                        output.textContent = `Error: ${error.message}`;
                    });
            }
            break;

        case 'echo':
            const echoMessage = parts.slice(1).join(' ');
            output.textContent = echoMessage;
            break;

        case 'exit':
            window.location.href = 'https://google.com';
            break;

        case 'find':
            if (parts.length < 2) {
                output.textContent = 'Usage: find <query>';
            } else {
                const query = parts.slice(1).join(' ');
                const searchUrl = 'https://www.google.com/search?q=' + encodeURIComponent(query) + '&udm=14';
                window.location.href = searchUrl;
            }
            break;

        case 'goto':
            if (parts.length < 2) {
                output.textContent = 'Usage: goto <url>';
            } else {
                let url = parts[1];
                if (!url.startsWith('http://') && !url.startsWith('https://')) {
                    url = 'https://' + url;
                }
                window.location.href = url;
            }
            break;

        case 'hello_world':
            output.innerHTML = 'Hello, user!';
            break;

        case 'help':
            output.textContent = `Type 'command' for a list of possible commands.`;
            break;

        case 'mailto':
            if (parts.length < 2) {
                output.textContent = 'Usage: mailto <email_address>';
            } else {
                const emailAddress = parts[1];
                window.location.href = `mailto:${emailAddress}`;
            }
            break;

        case 'new':
            window.location.href = 'https://barclayweb.pages.dev/desktop';
            break;

        case 'print':
            const printMessage = parts.slice(1).join(' ');
            output.textContent = printMessage;
            break;

        case 'repo':
            window.location.href = 'https://github.com/thejupitergroup/WebTerminal';
            break;

        case 'short_define':
            if (parts.length < 2) {
                output.textContent = 'WARN: This command is for a simple definition. Usage: define short <word>';
            } else {
                const word = parts[1];
                const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

                fetch(apiUrl)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Word not found');
                        }
                        return response.json();
                    })
                    .then(data => {
                        if (data.length > 0 && data[0].meanings.length > 0) {
                            const definition = data[0].meanings[0].definitions[0].definition;
                            output.textContent = `Definition of '${word}': ${definition}`;
                        } else {
                            output.textContent = `No definition found for ${word}`;
                        }
                    })
                    .catch(error => {
                        output.textContent = `Error: ${error.message}`;
                    });
            }
            break;

        case 'time':
            const time = new Date();
            output.textContent = `Current Date and Time: ${time}`;
            break;

        case 'weather':
            if ('geolocation' in navigator) {
                navigator.geolocation.getCurrentPosition(position => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    const apiKey = config.weatherApiKey;
                    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

                    fetch(apiUrl)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Unable to fetch weather data');
                            }
                            return response.json();
                        })
                        .then(data => {
                            const weatherDescription = data.weather[0].description;
                            const temperatureC = data.main.temp;
                            const temperatureF = (temperatureC * 9 / 5) + 32;
                            const city = data.name;
                            output.textContent = `Current location weather in ${city}: ${weatherDescription}, Temperature: ${temperatureC}°C, ${temperatureF}°F`;
                        })
                        .catch(error => {
                            output.textContent = `Error: ${error.message}`;
                        });
                }, error => {
                    output.textContent = `Error: ${error.message}`;
                });
            } else {
                output.textContent = 'Geolocation is not supported by this browser.';
            }
            break;

        case 'weather_find':
            if (parts.length < 4) {
                output.textContent = 'Usage: weather in <city> <country> <state>';
            } else {
                const city = parts[1];
                const country = parts[2];
                const state = parts[3];
                const apiKey = config.weatherApiKey;
                const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city},${state},${country}&appid=${apiKey}&units=metric`;

                fetch(apiUrl)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('City not found');
                        }
                        return response.json();
                    })
                    .then(data => {
                        const weatherDescription = data.weather[0].description;
                        const temperatureC = data.main.temp;
                        const temperatureF = (temperatureC * 9 / 5) + 32;
                        const city = data.name;
                        output.textContent = `Weather in ${city}: ${weatherDescription}, Temperature: ${temperatureC}°C, ${temperatureF}°F`;
                    })
                    .catch(error => {
                        output.textContent = `Error: ${error.message}`;
                    });
            }
            break;

        case 'whois':
            const pc = new (window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection)({
                iceServers: [{urls: 'stun:stun.l.google.com:19302'}]
            });
            const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g;
            
            pc.createDataChannel('');
            pc.createOffer().then(offer => pc.setLocalDescription(offer));
            
            pc.onicecandidate = function(event) {
                if (event.candidate && event.candidate.candidate) {
                    const ipAddress = event.candidate.candidate.match(ipRegex);
                    if (ipAddress) {
                        output.textContent = `Your IP address is: ${ipAddress[0]}`;
                        pc.close();
                    }
                }
            };
            break;

        case 'woskey':
            output.textContent = 'BT-WOS is licensed by Barclay Software. The current key is b6842ded-ef40-44e8-9efd-47260604dc97';
            break;

        default:
            output.textContent = `Not a recognized command. Enter 'command' for a list of supported commands.`;
    }

    terminalBody.scrollTop = terminalBody.scrollHeight;
}