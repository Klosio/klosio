import RecordRTC from "recordrtc"
import type BattlecardResponse from "~types/battlecard.model"
import type UserSession from "~types/userSession.model"

const serverUri = process.env.PLASMO_PUBLIC_SERVER_URL

async function startRecording(
    language: string,
    userSession: UserSession,
    updateBattlecards: (battlecard: BattlecardResponse) => void
) {
    const audioContext = new AudioContext()
    const displayMediaStream = await navigator.mediaDevices.getDisplayMedia({
        audio: true,
        video: true,
        preferCurrentTab: true
    } as DisplayMediaStreamOptions)
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
    const audioUserMedia = audioContext.createMediaStreamSource(userMediaStream)
    const mediaDest = audioContext.createMediaStreamDestination()
    audioDisplayMedia.connect(mediaDest)
    audioUserMedia.connect(mediaDest)
    const recorder = startAudioRecorder(
        mediaDest.stream,
        language,
        userSession,
        updateBattlecards
    )
    return { streams: [displayMediaStream, userMediaStream], recorder }
}

function startAudioRecorder(
    stream,
    language: string,
    userSession: UserSession,
    updateBattlecards: (battlecard: BattlecardResponse) => void
) {
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
            const battlecard = await getBattlecardAnalysis(
                file,
                language,
                userSession
            )
            if (
                (battlecard.status =
                    "success" && battlecard.question && battlecard.answer)
            ) {
                updateBattlecards(battlecard)
            }
        },
        onstop: () => {
            stream.getTracks().forEach((track) => track.stop())
            console.log("Stopped recording")
        },
        onbeforeunload: () => {
            if (audioRecorder) {
                audioRecorder.stopRecording()
                audioRecorder.destroy()
            }
        }
    })
    audioRecorder.startRecording()
    return audioRecorder
}

const stopRecording = (recorder: any, streams: MediaStream[]) => {
    recorder.stopRecording()
    streams.forEach((stream) =>
        stream.getTracks().forEach((track) => track.stop())
    )
    recorder.destroy()
}

async function getBattlecardAnalysis(
    file: File,
    language: string,
    userSession: UserSession
): Promise<BattlecardResponse> {
    const formData = new FormData()
    formData.append("file", file)
    const battlecard: BattlecardResponse = await fetch(
        `${serverUri}/api/v1/analysis/${language}/${userSession.user.organization._id}`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${userSession.token}`
            },
            body: formData
        }
    ).then((response) => response.json())
    return battlecard
}

export { startRecording, stopRecording }
