import { Transcribe } from "./scripts/speech-to-text";

class Capture {
  constructor(request, sendResponse) {
    this._request = request;
    this._sendResponse = sendResponse;
  }

  checkStatus() {
    const { currentTab } = this._request;
    const current = sessionStorage.getItem(currentTab);
    if (current) this._sendResponse(current);
    else this._sendResponse(false);
  }

  startCapture() {
    chrome.tabs.query({ active: true, currentWindow: true}, (tabs) => {
      const currentTab = tabs[0].id;
      if (!sessionStorage.getItem(currentTab)) {
        sessionStorage.setItem(currentTab, true);
      }
      this._sendStream(currentTab);
      this._sendResponse(true);
    });
  }

  stopCapture() {
    chrome.tabs.query({ active:true, currentWindow:true }, (tabs) => {
      const currentTab = tabs[0].id;
      sessionStorage.removeItem(currentTab);
      Transcribe.stop();
      this._sendResponse(true);
    })
  }

  _sendStream(currentTab) {
    chrome.tabCapture.capture({ audio: true }, (stream) => {
      Transcribe.start({ play: false, stream }, (script) => {
        const port = chrome.tabs.connect(currentTab, { name: 'transcribe' });
        script.on('data', (data) => {
          port.postMessage({status: 'ok', data});
        })
        script.on('error', (err) => {
          console.error(err);
          sessionStorage.setItem(currentTab, 'error')
          port.postMessage({ status: 'error', msg: err });
          chrome.runtime.sendMessage('error');
        })
      })
    });
  }
}


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (!request.subject) sendResponse(false);
  const capture = new Capture(request, sendResponse);
  switch (request.subject) {
    case 'check': capture.checkStatus(); break;
    case 'start': capture.startCapture(); break;
    case 'stop': capture.stopCapture(); break;
    default: sendResponse(false); break;
  }
  return true;
})
