import { useState } from "react";
import RecordRTC, { invokeSaveAsDialog } from "recordrtc";

function App() {
  const [transcript, setTranscript] = useState<string>("")
  const [globalRecorder, setGlobalRecorder] = useState<RecordRTC | null>(null)

  function stopRecording() {
    globalRecorder?.stopRecording();
    setGlobalRecorder(null);
  }
  
  async function startRecording() {
    const audioContext = new AudioContext();
    const audioParams_01 = {
        deviceId: "default",
    }

    const mediaStream_01 = await navigator.mediaDevices.getDisplayMedia({ audio: true, video: true });
    const mediaStream_02 = await navigator.mediaDevices.getUserMedia({ audio: 
      {
        deviceId: audioParams_01,
        echoCancellation: false,
        autoGainControl: false,
        noiseCancellation: false
      } as MediaTrackConstraints });

    const audioIn_01 = audioContext.createMediaStreamSource(mediaStream_01);
    const audioIn_02 = audioContext.createMediaStreamSource(mediaStream_02);

    const dest = audioContext.createMediaStreamDestination();

    audioIn_01.connect(dest);
    audioIn_02.connect(dest);


    const recorder = new RecordRTC(dest.stream, 
      { 
        type: "audio",  
        mimeType: "audio/wav",
        recorderType: RecordRTC.StereoAudioRecorder,
        numberOfAudioChannels: 1,
        timeSlice: 20000,
        sampleRate: 48000,
        desiredSampRate: 16000,
        ondataavailable: async (blob) => {
            console.log('blob', blob);

            // invokeSaveAsDialog(blob);

            const file = new File([blob], "filename.wav", {
                type: "audio/wav"
            })

            var formData = new FormData()
            formData.append("file", file)

            const newTranscript = await fetch(
                "http://localhost:3000/transcript",
                {
                    method: "POST",
                    body: formData
                })
                .then((response) => response.json())
                .then((responseJson) => responseJson.transcript)

            setTranscript(
                (oldTranscript) => `${oldTranscript} ${newTranscript}`
            )
        }
    })

    recorder.startRecording();
    setGlobalRecorder(recorder);
}

  return (
    <>
      <button onClick={() => startRecording()}>Record</button>
      <button onClick={() => stopRecording()}>Stop</button>
      <p>
        {transcript}
      </p>
    </>
  )
}

export default App
