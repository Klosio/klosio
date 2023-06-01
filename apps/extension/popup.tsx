import { useEffect, useState } from "react"

import "./style.css"

import Landing from "~components/Landing"
import Logged from "~components/Logged"
import type User from "~types/user.model"

import("preline")

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
    console.log("Send message to start recording...")
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

function IndexPopup() {
    const [user, setUser] = useState<User>()
    const [currentTab, setCurrentTab] = useState(null)

    useEffect(() => {
        // Get user state from storage
        setUser({ name: "Christophe Dupont" })
        getCurrentTab().then((t) => setCurrentTab(t))
    }, [])

    function detectGoogleMeetURL(url: string): boolean {
        const regex = /https:\/\/meet\.google\.com\//
        return regex.test(url)
    }

    function logout(): void {
        setUser(null)
    }

    function login(): void {
        setUser({ name: "Christophe Dupont" })
    }

    return (
        <div className="m-2 w-[300px] space-y-2 flex flex-col bg-white border shadow-sm rounded-xl p-4 md:p-5">
            <div className="border-b border-gray-200">
                <h1 className="text-lg text-center font-bold text-gray-80">
                    Battlecards AI Companion
                </h1>
            </div>
            {user ? (
                <Logged
                    {...{
                        user,
                        allowRecording: detectGoogleMeetURL(currentTab?.url),
                        startRecording,
                        logout
                    }}
                />
            ) : (
                <Landing />
            )}
        </div>
    )
}

export default IndexPopup
