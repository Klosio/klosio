import overlayText from "data-text:~/contents/overlay.css"
import prelineText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"
import { useState } from "react"
import RecordRTC from "recordrtc"

import Chatbot from "~components/Chatbot"
import type BattlecardResponse from "~types/battlecard.model"

import("preline")

const serverUri = process.env.PLASMO_PUBLIC_SERVER_URL

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
    const [battlecards, setBattlecards] = useState<BattlecardResponse[]>([])
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
            ondataavailable: async (blob: BlobPart) => {
                const file = new File([blob], "filename.wav", {
                    type: "audio/wav"
                })
                const battlecard = await getBattlecardAnalysis(file, language)
                console.log(battlecard)
                if (
                    (battlecard.status =
                        "success" && battlecard.question && battlecard.answer)
                )
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

    async function getBattlecardAnalysis(
        file: File,
        language: string
    ): Promise<BattlecardResponse> {
        const formData = new FormData()
        formData.append("file", file)
        const battlecard: BattlecardResponse = await fetch(
            `${serverUri}/api/v1/analysis/${language}`,
            {
                method: "POST",
                body: formData
            }
        ).then((response) => response.json())
        return battlecard
    }

    const [displayChatbot, setDisplayChatbot] = useState(false)

    return (
        <div className="flex flex-col items-end">
            {displayChatbot && <Chatbot {...{ language, battlecards }} />}
            <button onClick={() => setDisplayChatbot(!displayChatbot)}>
                <span className="m-1 inline-flex justify-center items-center w-[46px] h-[46px] rounded-md bg-klosio-blue-600 text-white">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        strokeWidth="1.75"
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round">
                        <path
                            stroke="none"
                            d="M0 0h24v24H0z"
                            fill="none"></path>
                        <path d="M4 21v-13a3 3 0 0 1 3 -3h10a3 3 0 0 1 3 3v6a3 3 0 0 1 -3 3h-9l-4 4"></path>
                        <path d="M9.5 9h.01"></path>
                        <path d="M14.5 9h.01"></path>
                        <path d="M9.5 13a3.5 3.5 0 0 0 5 0"></path>
                    </svg>
                </span>
            </button>
        </div>
    )
}

export default CustomButton
