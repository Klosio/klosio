import { addContentScript, getCurrentTab, isGoogleMeetURL } from "./browser"

async function startRecording(language: string) {
    const tab = await getCurrentTab()
    await addContentScript("../contents/content.tsx", tab)
    const response = await chrome.tabs.sendMessage(tab.id, {
        recording: "start",
        language
    })
    if (response.recordingStarted === true) {
        console.log("Started recording.")
    }
}

async function stopRecording() {
    const tab = await getCurrentTab()
    const response = await chrome.tabs.sendMessage(tab.id, {
        recording: "stop"
    })
    if (response.recordingStopped === true) {
        console.log("Stopped recording.")
    }
}

async function isRecording(): Promise<boolean> {
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

function isRecordingAllowed(tab: chrome.tabs.Tab): boolean {
    return isGoogleMeetURL(tab?.url)
}

export { startRecording, stopRecording, isRecording, isRecordingAllowed }
