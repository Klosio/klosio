async function addContentScript(tab) {
    if (await isContentScriptReady()) {
        return;
    }
    console.log('Add content script...');
    chrome.scripting.executeScript({
        target: {tabId: tab.id},
        files: ['content_script.js']
    });
    while (!await isContentScriptReady()) {
        console.log('Waiting for content script to be ready...');
        await timeout(200);
    }
}

async function startRecording() {
    console.log('Send message to start recording...');
    const tab = await getCurrentTab();
    await addContentScript(tab);
    const response = await chrome.tabs.sendMessage(tab.id, {recording: 'start'});
    console.log('Message sent.');
    if (response.recordingStarted === true) {
        console.log('Started recording.');
        await setButtonsStatus({recording: true});
    }
}

async function stopRecording() {
    console.log('Send message to stop recording...');
    const tab = await getCurrentTab();
    const response = await chrome.tabs.sendMessage(tab.id, {recording: 'stop'});
    console.log('Message sent.');
    if (response.recordingStopped === true) {
        console.log('Stopped recording.');
        await setButtonsStatus({recording: false});
    }
}

async function getCurrentTab() {
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    console.log(`current tab ${tab.id}`);
    return tab;
}

function getStartButton() {
    return document.getElementById('start');
}

function getStopButton() {
    return document.getElementById('stop');
}

async function isContentScriptReady() {
    try {
        const tab = await getCurrentTab();
        const response = await chrome.tabs.sendMessage(tab.id, {script: 'status'});
        if (response.contentScriptReady === true) {
            return true;
        }
    } catch {
        return false;
    }
    return false;
}

async function isRecording() {
    try {
        const tab = await getCurrentTab();
        const response = await chrome.tabs.sendMessage(tab.id, {script: 'recording'});
        if (response.contentScriptRecording === true) {
            return true;
        }
    } catch {
        return false;
    }
    return false;
}

async function setButtonsStatus(status) {
    console.log('update buttons status');
    if (status == null) {
        status = { recording: await isRecording() };
    }
    const startButton = getStartButton();
    startButton.disabled = status.recording;
    const stopButton = getStopButton();
    stopButton.disabled = !status.recording;
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

document.addEventListener('DOMContentLoaded', function() {
    getStartButton().addEventListener('click', startRecording);
});

document.addEventListener('DOMContentLoaded', function() {
    getStopButton().addEventListener('click', stopRecording);
});

(async () => {
    await setButtonsStatus();
})();
