import RecordRTC from "recordrtc"
import { httpRequest } from "~core/httpRequest"
import type BattlecardResponse from "~types/battlecard.model"
import type UserSession from "~types/userSession.model"

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
    const battlecard: BattlecardResponse = await httpRequest
        .post(
            `/v1/analysis/${language}/${userSession.user.organization.id}`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
        )
        .then((response) => response.data)
    return battlecard
}

export { startRecording, stopRecording }
