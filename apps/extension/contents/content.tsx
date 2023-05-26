import type { PlasmoCSConfig } from "plasmo"
import { useState } from "react"
import RecordRTC from "recordrtc"

export const config: PlasmoCSConfig = {
    matches: ["https://meet.google.com/*"]
}

const CustomButton = () => {
    const [isRecording, setIsRecording] = useState(false)
    const [fullTranscript, setFullTranscript] = useState("")
    const [globalRecorder, setGlobalRecorder] = useState(null)

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
                const transcript = await getTranscriptFromAudioFile(
                    file,
                    language
                )
                console.log(transcript)
                addTranscript(transcript)
            }
        })
        audioRecorder.startRecording()
        setGlobalRecorder(audioRecorder)
        addTranscript("start")
    }

    function stopRecording() {
        console.log("Stop recording...")
        globalRecorder?.stopRecording(() => {})
        setGlobalRecorder(null)
        console.log(fullTranscript)
    }

    function addTranscript(transcript) {
        setFullTranscript((fullTranscript) => `${fullTranscript} ${transcript}`)
    }

    async function getTranscriptFromAudioFile(file, language: string) {
        const formData = new FormData()
        formData.append("file", file)
        const newTranscript = await fetch(
            `http://localhost:3000/transcript/${language}`,
            {
                method: "POST",
                body: formData
            }
        )
            .then((response) => response.json())
            .then((responseJson) => responseJson.transcript)
        return newTranscript
    }

    return <button>Is recording : {fullTranscript}</button>
}

export default CustomButton
