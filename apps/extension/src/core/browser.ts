async function getCurrentTab(): Promise<chrome.tabs.Tab> {
    const [tab] = await chrome.tabs.query({
        active: true,
        lastFocusedWindow: true
    })
    return tab
}

async function addContentScript(scriptPath: string, tab: chrome.tabs.Tab) {
    if (await isContentScriptReady()) {
        return
    }
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: [scriptPath]
    })
    while (!(await isContentScriptReady())) {
        console.log("Waiting for content script to be ready...")
        await timeout(200)
    }
}

async function isContentScriptReady(): Promise<boolean> {
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

function isGoogleMeetURL(url: string): boolean {
    const regex = /https:\/\/meet\.google\.com\//
    return regex.test(url)
}

function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

export { getCurrentTab, addContentScript, isGoogleMeetURL }
