import { useEffect, useReducer } from "react"
 
import RecordRTC, { StereoAudioRecorder, invokeSaveAsDialog } from 'recordrtc';

import { saveAs } from 'file-saver';

import "./style.css";
function IndexPopup() {
  function captureAudio() {
    navigator.mediaDevices.getDisplayMedia({ audio: true, video: true })
      .then((stream) => startRecording(stream))
      .catch(function(error) {
        alert('Unable to capture tab audio.');
        console.error(error);
      });
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
      type: 'audio',
      mimeType: 'audio/webm',
      timeSlice: 10000,
      ondataavailable: (blob) => {
        console.log('blob', blob);
  
        invokeSaveAsDialog(blob);
        
        const file = new File([blob], 'filename.webm', {
            type: 'video/webm'
        });
  
        var formData = new FormData();
        formData.append('file', file); // upload "File" object rather than a "Blob"
        // upload formadata to server using fetch
        fetch('http://localhost:3000/transcript', {
            method: 'POST',
            body: formData
        }).then(response => {
            return response.json();
        });
      }
    });
    recorder.startRecording();
  }

  return (
    <>
      <button
        onClick={() => captureAudio()}
        type="button"
        className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          Record tab audio
      </button>
    </> 
  )
}
 
export default IndexPopup