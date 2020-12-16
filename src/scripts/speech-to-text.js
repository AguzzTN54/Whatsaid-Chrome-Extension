import 'regenerator-runtime/runtime';
import recognizeMicrophone from 'watson-speech/speech-to-text/recognize-microphone';
import { fetch } from 'whatwg-fetch';

export const getToken = async () => {
  // const data = await fetch('/token.json');
  const data = await fetch('https://whatsaid.mybluemix.net/api/stt');
  const token = await data.json()
  return token;
}

export const playAudio = (stream) => {
  const audio = new Audio();
  audio.srcObject = stream;
  audio.play();
}
export const Transcribe = {
  async start (stream, callback = null) {
    const token = await getToken();
    const streams = recognizeMicrophone(Object.assign(token, {
      mediaStream: stream,
      realtime: true,
      objectMode: true,
      format: false,
      inactivity_timeout: 600,
    }))

    this._stream = streams;
    if (callback) return callback(streams);

    streams.on('error', (err) => {
      console.log(err);
    });
  },

  stop() {
    return this._stream.stop()
  }
};
