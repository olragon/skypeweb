const ipcRenderer = require('electron').ipcRenderer;
var xmlreqc = XMLHttpRequest;
XMLHttpRequest = function() {
  this.xhr = new xmlreqc();
  this.xhr.addEventListener('load', function () {
    ipcRenderer.sendToHost('skypeweb:xhr', this.responseText);
  });
  return this.xhr;
};
