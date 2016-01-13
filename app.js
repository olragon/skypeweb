"use strict";
const ipcRenderer = require("electron").ipcRenderer;
const ipcMain = require('electron').ipcMain;
var fs = require('fs');

window.$ = window.jQuery = require('./bower_components/jquery/dist/jquery.js');

init();

function init() {
  onResize();
  $(window).resize(onResize);
  onWebView();
}

function onWebView() {
  var webview = $('webview').get(0);

  webview.addEventListener("ipc-message", function(e){
    if (e.channel === 'skypeweb:xhr') {
      console.log('[skypeweb:xhr] response', e.args[0]);
      // @todo: do something with web.skype.com xhr response
      // desktop notification, change icon with number of unread message ...
    }
  });

  webview.addEventListener("dom-ready", function() {
    if (process.env.DEBUG) {
      webview.openDevTools();
    }

    // modify css
    webview.insertCSS(fs.readFileSync('./inject.css').toString());

    // add event listener
    webview.executeJavaScript(fs.readFileSync('./bower_components/jquery/dist/jquery.min.js').toString());
  });

  webview.addEventListener('console-message', function(e) {
    console.log('[web.skype.com]:', e.message);
  });

  webview.addEventListener('new-window', function(e) {
    require('electron').shell.openExternal(e.url);
  });

  return webview;
}

function onResize() {
  $('webview').css({
    width: $('body').innerWidth(),
    height: $(window).height(),
  });
}
