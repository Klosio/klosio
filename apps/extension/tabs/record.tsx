import { useState } from "react"
import RecordRTC, { invokeSaveAsDialog } from "recordrtc"

import "../style.css"

import("preline")

function Record() {
    const [transcript, setTranscript] = useState<string>("")
    const [globalRecorder, setGlobalRecorder] = useState<RecordRTC | null>(null)

    async function startRecording() {
        const audioContext = new AudioContext()
        const displayMediaStream = await navigator.mediaDevices.getDisplayMedia(
            {
                audio: true,
                video: true
            }
        )
        const userMediaStream = await navigator.mediaDevices.getUserMedia({
            audio: {
                deviceId: { deviceId: "default" },
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

        const audioRecorder = new RecordRTC(mediaDest.stream, {
            type: "audio",
            mimeType: "audio/wav",
            recorderType: RecordRTC.StereoAudioRecorder,
            numberOfAudioChannels: 1,
            timeSlice: 10000,
            desiredSampRate: 16000,
            ondataavailable: async (blob: BlobPart) => {
                /* DEBUG AUDIO
                console.log("blob", blob)
                invokeSaveAsDialog(blob)
                */
                const file = new File([blob], "filename.wav", {
                    type: "audio/wav"
                })

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

                setTranscript(
                    (oldTranscript) => `${oldTranscript} ${newTranscript}`
                )
            }
        })

        audioRecorder.startRecording()
        setGlobalRecorder(audioRecorder)
    }

    function stopRecording() {
        globalRecorder?.stopRecording(() => {})
        setGlobalRecorder(null)
    }

    return (
        <div className="flex flex-col m-2">
            <div className="flex flex-row justify-center space-x-2">
                <button
                    onClick={() => startRecording()}
                    className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
                    Start transcription
                </button>
                <button
                    onClick={() => stopRecording()}
                    className="bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded">
                    Stop
                </button>
            </div>
            <div>
                <p>{transcript}</p>
            </div>
        </div>
    )
}

export default Record
