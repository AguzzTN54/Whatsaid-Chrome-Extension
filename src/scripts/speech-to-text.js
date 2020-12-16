import 'regenerator-runtime/runtime';
import recognizeMicrophone from 'watson-speech/speech-to-text/recognize-microphone';
import { fetch } from 'whatwg-fetch';

export const getToken = async () => {
  const data = await fetch('/token.json');
  const token = await data.json()
  return token;
}

const playAudio = (stream) => {
  const liveStream = stream;
  const audio = new Audio();
  audio.srcObject = liveStream;
  audio.play();
}
export const Transcribe = {
  async start (option, callback = null) {
    const { play, stream } = option;
    if (play) playAudio(stream);

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
