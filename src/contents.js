import { createSubtitleTpl } from "./templates/subtitleTpl";

const createSubtitleElement = () => {
  const isRendered = document.getElementById('whatsaid-subtitle-element');
  if (isRendered) return;
  const subtitleElement = document.createElement('section');
  subtitleElement.setAttribute('id', 'whatsaid-subtitle-element')
  subtitleElement.setAttribute('style', 'position: fixed; bottom: 50px; left: 50%; transform: translateX(-50%); z-index: 10000; display:flex; justify-content: center; width: 70vw; max-height: 50px; pointer-events:');
  document.body.appendChild(subtitleElement);
};

const createTranscriptElement = (text) => {
  const element = document.getElementById('whatsaid-subtitle-element');
  element.innerHTML = `<iframe id="whatsaid-transcript-element" style="max-height: 50px; width:100%; pointer-events: none; border:none;"></iframe>`;
  const transcribeElement = document.getElementById('whatsaid-transcript-element');
  transcribeElement.contentDocument.write(createSubtitleTpl(text));
}

const removeElement = () => {
  const element = document.getElementById('whatsaid-subtitle-element');
  if (element) element.remove();
};

const renderTranscript = (data) => {
  const { transcript } = data.results[0].alternatives[0]
  createTranscriptElement(transcript)
}

const subtitle = (port) => {
  createSubtitleElement();
  port.onMessage.addListener((msg) => {
    console.log(msg);
    const { status, data } = msg;
    if (status === 'error') return removeElement()
    if (status === 'ok') renderTranscript(data);
  });
};

chrome.runtime.onConnect.addListener((port) => {
  if (port.name === 'transcribe') subtitle(port)
  if (port.name === 'removeTransrcibe') removeElement();
});

