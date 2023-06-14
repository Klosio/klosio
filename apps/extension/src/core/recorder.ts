async function addContentScript(tab) {
    if (await isContentScriptReady()) {
        return
    }
    console.log("Add content script...", tab.id)
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["../contents/content.tsx"]
    })
    while (!(await isContentScriptReady())) {
        console.log("Waiting for content script to be ready...")
        await timeout(200)
    }
}

async function startRecording(language: string) {
    console.log("Send message to start recording...", language)
    const tab = await getCurrentTab()
    await addContentScript(tab)
    const response = await chrome.tabs.sendMessage(tab.id, {
        recording: "start",
        language
    })
    console.log("Message sent.")
    if (response.recordingStarted === true) {
        console.log("Started recording.")
    }
}

async function stopRecording() {
    console.log("Send message to stop recording...")
    const tab = await getCurrentTab()
    const response = await chrome.tabs.sendMessage(tab.id, {
        recording: "stop"
    })
    console.log("Message sent.")
    if (response.recordingStopped === true) {
        console.log("Stopped recording.")
    }
}

async function getCurrentTab() {
    const [tab] = await chrome.tabs.query({
        active: true,
        lastFocusedWindow: true
    })
    console.log(`current tab ${tab.id}`)
    return tab
}

async function isContentScriptReady() {
    try {
        const tab = await getCurrentTab()
        const response = await chrome.tabs.sendMessage(tab.id, {
            script: "status"
        })
        if (response.contentScriptReady === true) {
            return true
        }
    } catch {
        return false
    }
    return false
}

async function isRecording() {
    try {
        const tab = await getCurrentTab()
        const response = await chrome.tabs.sendMessage(tab.id, {
            script: "recording"
        })
        if (response.contentScriptRecording === true) {
            return true
        }
    } catch {
        return false
    }
    return false
}

function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

export { startRecording, stopRecording, isRecording, getCurrentTab }
