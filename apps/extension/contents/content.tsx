import overlayText from "data-text:~/contents/overlay.css"
import prelineText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"
import { useState } from "react"
import RecordRTC from "recordrtc"

import Chatbot from "~components/Chatbot"
import type Battlecard from "~types/battlecard.model"

import("preline")

export const config: PlasmoCSConfig = {
    matches: ["https://meet.google.com/*"]
}

export const getStyle = () => {
    const style = document.createElement("style")
    style.textContent = overlayText + prelineText
    return style
}

const CustomButton = () => {
    const [isRecording, setIsRecording] = useState(false)
    const [battlecards, setBattlecards] = useState([])
    const [globalRecorder, setGlobalRecorder] = useState(null)
    const [language, setLanguage] = useState("")

    chrome.runtime.onMessage.addListener(async function (
        request,
        sender,
        sendResponse
    ) {
        if (request.script === "status") {
            sendResponse({ contentScriptReady: true })
        }
        if (request.script === "recording") {
            sendResponse({ contentScriptRecording: isRecording })
        }
        if (request.recording === "start") {
            console.log("Recording started in", request.language)
            await startRecording(request.language)
            setIsRecording(true)
            setLanguage(request.language)
            sendResponse({ recordingStarted: true })
        }
        if (request.recording === "stop") {
            console.log("Stop recording...")
            stopRecording()
            setIsRecording(false)
            sendResponse({ recordingStopped: true })
        }
    })

    async function startRecording(language: string) {
        console.log("Start recording...")
        const audioContext = new AudioContext()
        const displayMediaStream = await navigator.mediaDevices.getDisplayMedia(
            {
                audio: true,
                video: true,
                preferCurrentTab: true
            } as DisplayMediaStreamOptions
        )
        const userMediaStream = await navigator.mediaDevices.getUserMedia({
            audio: {
                deviceId: {
                    deviceId: "default"
                } as ConstrainDOMString,
                echoCancellation: false,
                autoGainControl: false,
                noiseCancellation: false
            } as MediaTrackConstraints
        })
        const audioDisplayMedia =
            audioContext.createMediaStreamSource(displayMediaStream)
        const audioUserMedia =
            audioContext.createMediaStreamSource(userMediaStream)
        const mediaDest = audioContext.createMediaStreamDestination()
        audioDisplayMedia.connect(mediaDest)
        audioUserMedia.connect(mediaDest)
        startAudioRecorder(mediaDest.stream, language)
    }

    function startAudioRecorder(stream, language: string) {
        const audioRecorder = new RecordRTC(stream, {
            type: "audio",
            mimeType: "audio/wav",
            recorderType: RecordRTC.StereoAudioRecorder,
            numberOfAudioChannels: 1,
            timeSlice: 10000,
            desiredSampRate: 16000,
            ondataavailable: async (blob) => {
                const file = new File([blob], "filename.wav", {
                    type: "audio/wav"
                })
                const battlecard = await getTranscriptFromAudioFile(
                    file,
                    language
                )
                console.log(battlecard)
                if (battlecard && battlecard.painpoint && battlecard.analysis)
                    setBattlecards((b) => [...b, battlecard])
            }
        })
        audioRecorder.startRecording()
        setGlobalRecorder(audioRecorder)
    }

    function stopRecording() {
        console.log("Stop recording...")
        globalRecorder?.stopRecording(() => {})
        setGlobalRecorder(null)
        console.dir(battlecards)
    }

    async function getTranscriptFromAudioFile(
        file,
        language: string
    ): Promise<Battlecard> {
        const formData = new FormData()
        formData.append("file", file)
        const newTranscript: Battlecard = await fetch(
            `http://localhost:3000/api/v1/analysis/${language}`,
            {
                method: "POST",
                body: formData
            }
        ).then((response) => response.json())
        return newTranscript
    }

    const [displayChatbot, setDisplayChatbot] = useState(false)

    return (
        <div className="flex flex-col items-end">
            {displayChatbot && <Chatbot {...{ language, battlecards }} />}
            <button onClick={() => setDisplayChatbot(!displayChatbot)}>
                <span className="m-1 inline-flex justify-center items-center w-[46px] h-[46px] rounded-md bg-blue-600 text-white">
                    <svg
                        className="w-5 h-5"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M19.1042 5.95502C19.2066 5.85057 19.3288 5.76759 19.4636 5.71095C19.5984 5.6543 19.7432 5.62512 19.8895 5.62512C20.0357 5.62512 20.1805 5.6543 20.3153 5.71095C20.4502 5.76759 20.5723 5.85057 20.6747 5.95502C21.1037 6.38852 21.1097 7.08902 20.6897 7.53002L11.8202 18.015C11.7195 18.1256 11.5973 18.2145 11.4611 18.2762C11.3249 18.3379 11.1775 18.3712 11.0279 18.374C10.8784 18.3768 10.7299 18.3491 10.5914 18.2925C10.453 18.236 10.3275 18.1517 10.2227 18.045L4.82571 12.576C4.61757 12.3638 4.50098 12.0783 4.50098 11.781C4.50098 11.4837 4.61757 11.1983 4.82571 10.986C4.92808 10.8816 5.05026 10.7986 5.1851 10.7419C5.31993 10.6853 5.46471 10.6561 5.61096 10.6561C5.75722 10.6561 5.902 10.6853 6.03683 10.7419C6.17167 10.7986 6.29385 10.8816 6.39621 10.986L10.9742 15.6255L19.0742 5.98802C19.0835 5.97643 19.0936 5.96541 19.1042 5.95502Z"
                            fill="currentColor"
                        />
                    </svg>
                </span>
            </button>
        </div>
    )
}

export default CustomButton
