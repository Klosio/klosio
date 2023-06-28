import overlayText from "data-text:~/contents/overlay.css"
import prelineText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState } from "react"
import Draggable from "react-draggable"
import ChatbotSvg from "react:~/assets/svg/chatbot.svg"

import Chatbot from "~components/Chatbot"
import Landing from "~components/LandingContent"
import type BattlecardResponse from "~types/battlecard.model"
import type UserSession from "~types/userSession.model"

import { startRecording, stopRecording } from "./content_recorder"

import("preline")

// PlasmoCSConfig is the configuration object for the content script
export const config: PlasmoCSConfig = {
    matches: ["https://meet.google.com/*"]
}

// getStyle is called when the content script is injected
export const getStyle = () => {
    const style = document.createElement("style")
    style.textContent = overlayText + prelineText
    return style
}

const PopupButton = () => {
    const [isRecording, setIsRecording] = useState(false)
    const [battlecards, setBattlecards] = useState<BattlecardResponse[]>([])
    const [globalRecorder, setGlobalRecorder] = useState(null)
    const [language, setLanguage] = useState("")
    const [userSession, setUserSession] = useState<UserSession>(null)
    const [initialStream, setInitialStream] = useState<Array<MediaStream>>(null)
    const [displayChatbot, setDisplayChatbot] = useState(false)
    const [destroyListener, setDestroyListener] = useState(false)

    useEffect(() => {
        const onMessage = closure()
        chrome.runtime.onMessage.addListener(onMessage)
        return () => chrome.runtime.onMessage.removeListener(onMessage)
    }, [destroyListener, setDestroyListener])

    function closure() {
        let isRecording = false
        async function onMessage(
            request: any,
            _sender: chrome.runtime.MessageSender,
            sendResponse: (response?: any) => void
        ) {
            if (request.script === "status") {
                sendResponse({ contentScriptReady: true })
            }
            if (request.script === "recording") {
                console.log("Currently recording", isRecording)
                sendResponse({ contentScriptRecording: isRecording })
            }
            if (request.recording === "start") {
                console.log("Recording started in", request.language)
                const { userSession, language } = request
                if (
                    !userSession ||
                    !userSession.token ||
                    !userSession.user ||
                    !userSession.user.organization
                ) {
                    console.error("Missing session info")
                    return
                }
                setUserSession(userSession)
                setLanguage(language)
                const recording = await startRecording(
                    language,
                    userSession,
                    updateBattlecards
                )
                setInitialStream(recording.streams)
                setGlobalRecorder(recording.recorder)
                setIsRecording(true)
                isRecording = true
                sendResponse({ recordingStarted: true })
            }
            if (request.recording === "stop") {
                console.log("Stop recording...")
                cleanupRecording()
                setIsRecording(false)
                isRecording = false
                sendResponse({ recordingStopped: true })
            }
        }
        return onMessage
    }

    const updateBattlecards = (battlecard: BattlecardResponse) => {
        setBattlecards((b) => [...b, battlecard])
    }

    const cleanupRecording = () => {
        stopRecording(globalRecorder, initialStream)
        setGlobalRecorder(null)
        setIsRecording(false)
        setDisplayChatbot(false)
        setDestroyListener(!destroyListener)
    }

    const DisplayLandingOrChatbot = (props: {
        isSession: boolean
        isRecording: boolean
    }) => {
        return props.isSession && props.isRecording ? (
            <Chatbot
                {...{
                    language,
                    battlecards,
                    stopRecording: cleanupRecording
                }}
            />
        ) : (
            <Landing />
        )
    }
    return (
        <Draggable
            axis="x"
            grid={[10, 10]}
            bounds={{ top: 0, left: -100, right: 0, bottom: 0 }}>
            <div className="flex flex-col items-end">
                {displayChatbot && (
                    <DisplayLandingOrChatbot
                        {...{
                            isSession: !!userSession,
                            isRecording
                        }}
                    />
                )}

                <button onClick={() => setDisplayChatbot(!displayChatbot)}>
                    <span className="m-1 inline-flex justify-center items-center w-[42px] h-[42px] rounded-md bg-klosio-blue-600 text-white hover:text-klosio-blue-200">
                        <ChatbotSvg />
                    </span>
                </button>
            </div>
        </Draggable>
    )
}

export default PopupButton
