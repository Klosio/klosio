# Audio Transcription POC

Chrome extension POC for audio transcription.

## Goal

Being able to transcript audio from a browser tab and the mic and display the transcription in the console.

## Installation

To install the extension:

1. Open the Chrome browser and go to `chrome://extensions`.
2. Enable the "Developer mode" option (usually located in the top right corner).
3. Click on "Load unpacked" and select this `extensionV2` folder.
4. The extension should now be installed and ready to use.

## Usage

First, run the development server:

```bash
npm run dev
```

Then, start the extension by clicking on the extension button, and click on the "Start Transcription" button in the popup to start the transcription.
The transcription will be displayed in the Chrome Dev Tools console.
When clicking on the "Stop Transcription" button, the full transcript of the conversation will be displayed in the console.
