(function() {
  'use strict';
  window.getManifest = function() {
    var manifest = new XMLHttpRequest();
    manifest.open('GET', chrome.extension.getURL('manifest.json'), false);
    manifest.send(null);
    return JSON.parse(manifest.responseText);
  };
})();
