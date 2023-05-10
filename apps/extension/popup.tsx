import { createFFmpeg } from "@ffmpeg/ffmpeg"
import { saveAs } from "file-saver"
import { useEffect, useState } from "react"
import RecordRTC, { invokeSaveAsDialog } from "recordrtc"

import "./style.css"

function IndexPopup() {
    const [transcript, setTranscript] = useState<string>("")
    const [globalRecorder, setGlobalRecorder] = useState<RecordRTC | null>(null)

    function captureAudio() {
        navigator.mediaDevices
            .getDisplayMedia({ audio: true, video: true })
            .then((stream) => startRecording(stream))
            .catch((error) => {
                alert("Unable to capture tab audio.")
                console.error(error)
            })
    }

    function stopRecording() {
        globalRecorder?.stopRecording()
        setGlobalRecorder(null)
    }

    function startRecording(stream: MediaStream) {
        // const test = new MediaRecorder(stream, { mimeType: 'audio/webm',  });
        // test.ondataavailable = ((e) => {
        //   const file = new File([e.data], 'filename.webm', {
        //     type: 'audio/webm'
        //   });
        //   console.log(file)
        //   saveAs(file)
        // });
        // test.start(10000);

        const recorder = RecordRTC(stream, {
            audio: true,
            video: false,
            gif: false,
            type: "audio",
            recorderType: RecordRTC.StereoAudioRecorder, // force for all browsers
            numberOfAudioChannels: 2,
            mimeType: "audio/wav",
            timeSlice: 20000,
            ondataavailable: async (blob) => {
                // console.log('blob', blob);

                // invokeSaveAsDialog(blob);

                const file = new File([blob], "filename.wav", {
                    type: "audio/wav"
                })

                var formData = new FormData()
                formData.append("file", file)

                const newTranscript = await fetch(
                    process.env.PLASMO_PUBLIC_SERVER_URL + "/transcript",
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
        recorder.startRecording()
        setGlobalRecorder(recorder)
    }

    return (
        <>
            <div className="w-[400px] flex flex-col justify-center items-center">
                {transcript && (
                    <>
                        <h1>Live transcription :</h1>
                        <div>{transcript}</div>
                    </>
                )}
                <div className="flex flex-row">
                    <button
                        onClick={() => captureAudio()}
                        type="button"
                        className=" w-1/2 inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        Record
                    </button>
                    <button
                        onClick={() => stopRecording()}
                        type="button"
                        className=" w-1/2 inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        Stop
                    </button>
                </div>
            </div>
        </>
    )
}

export default IndexPopup
