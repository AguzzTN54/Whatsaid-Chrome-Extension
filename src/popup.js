const App = {
  init({ container, toggle, origin, status, onlineStatus }) {
    this.container = container;
    this.toggle = toggle;
    this.origin = origin;
    this.status = status;
    this.onlineStatus = onlineStatus;
    
    this._displayButton();
    toggle.addEventListener('click', () => this._toggleClick());
    window.addEventListener('online', () => { onlineStatus.innerText = 'Ready'; });
    window.addEventListener('offline', () => { onlineStatus.innerText = 'Connecting ...'; });
    if (navigator.onLine) onlineStatus.innerText = 'Ready';
  },

  _toggleClick() {
    const isActive = this.container.classList.contains('active');
    return isActive
      ? this._sendMessage('stop')
      : this._sendMessage('start');
  },

  _sendMessage(subject) {
    chrome.runtime.sendMessage({ subject }, (response) => {
      if (!response) return null;
      console.log(response);
      return (subject === 'start')
        ? this._showStopButton()
        : this._showStartButton();
    });
  },

  _displayButton() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const msg = { currentTab: tabs[0].id, subject: 'check' };
      chrome.runtime.sendMessage(msg, (response) => {
        if (!response) this._showStartButton();
        else this._showStopButton();
      });
      this.origin.innerText = tabs[0].url;
    });
  },

  _showStartButton() {
    this.container.classList.remove('active');
    this.status.innerHTML = 'Transcribe Now';
  },

  _showStopButton() {
    this.container.classList.add('active');
    this.status.innerHTML = 'Transcribing <span class="dot"></span>';
  },

  showError() {
    this.status.innerHTML = 'SomeThing Wrong';
    this.container.classList.remove('active');
  }
};


document.addEventListener('DOMContentLoaded', () => {
  App.init({
    container: document.querySelector('#main-tab'),
    onlineStatus: document.querySelector('#online-status'),
    origin: document.querySelector('#origin'),
    status: document.querySelector('#status'),
    toggle: document.querySelector('#toggle'),
  });
  chrome.runtime.onMessage.addListener(() => {
    App.showError()
  })
});
