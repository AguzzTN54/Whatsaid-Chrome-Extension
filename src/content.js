import recognizeMicrophone from 'watson-speech/speech-to-text/recognize-microphone';
import { fetch } from 'whatwg-fetch';

document.querySelector('#button').onclick = function() {
  fetch('/token.json')
    .then(function(response) {
      return response.json();
    })
    .then(function(token) {
      var stream = recognizeMicrophone(
        Object.assign(token, {
          outputElement: '#output' // CSS selector or DOM Element
        })
      );

      stream.on('error', function(err) {
        console.log(err);
      });
    })
    .catch(function(error) {
      console.log(error);
    });
};
