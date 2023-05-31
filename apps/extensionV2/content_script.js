let isRecording = false;
let fullTranscript;
let globalRecorder;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.script === 'status') {
        sendResponse({ contentScriptReady: true });
    }
    if (request.script === 'recording') {
        sendResponse({ contentScriptRecording: isRecording });
    }
    if (request.recording === 'start') {
        console.log('Recording started...');
        (async () => await startRecording())();
        isRecording = true;
        sendResponse({ recordingStarted: true });
    }
    if (request.recording === 'stop') {
        console.log('Stop recording...');
        stopRecording();
        isRecording = false;
        sendResponse({ recordingStopped: true });
    }
});

async function startRecording() {
    console.log('Start recording...');
    fullTranscript = '';
    const audioContext = new AudioContext();
    const displayMediaStream = await navigator.mediaDevices.getDisplayMedia({
        audio: true,
        video: true,
        preferCurrentTab: true,
    });
    const userMediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
            deviceId: {
                deviceId: 'default',
            },
            echoCancellation: false,
            autoGainControl: false,
            noiseCancellation: false,
        },
    });
    const audioDisplayMedia =
        audioContext.createMediaStreamSource(displayMediaStream);
    const audioUserMedia =
        audioContext.createMediaStreamSource(userMediaStream);
    const mediaDest = audioContext.createMediaStreamDestination();
    audioDisplayMedia.connect(mediaDest);
    audioUserMedia.connect(mediaDest);
    // dynamic import of RecordRTC
    (async () => {
        const recordRTCUrl = chrome.runtime.getURL('RecordRTC.js');
        const recordRTC = await import(recordRTCUrl);
        startAudioRecorder(recordRTC.default, mediaDest.stream);
    })();
}

function startAudioRecorder(recordRTC, stream) {
    const audioRecorder = new recordRTC(stream, {
        type: 'audio',
        mimeType: 'audio/wav',
        recorderType: recordRTC.StereoAudioRecorder,
        numberOfAudioChannels: 1,
        timeSlice: 10000,
        desiredSampRate: 16000,
        ondataavailable: async (blob) => {
            const file = new File([blob], 'filename.wav', {
                type: 'audio/wav',
            });
            const transcript = await getTranscriptFromAudioFile(file);
            console.log(transcript);
            addTranscript(transcript);
        },
    });
    audioRecorder.startRecording();
    globalRecorder = audioRecorder;
}

function stopRecording() {
    console.log('Stop recording...');
    globalRecorder?.stopRecording(() => {});
    globalRecorder = null;
    console.log(fullTranscript);
}

function addTranscript(transcript) {
    fullTranscript = `${fullTranscript} ${transcript}`;
}

async function getTranscriptFromAudioFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    const newTranscript = await fetch('http://localhost:3000/analysis', {
        method: 'POST',
        body: formData,
    })
        .then((response) => response.json())
        .then((responseJson) => responseJson.transcript);
    return newTranscript;
}
