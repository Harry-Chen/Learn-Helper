const clickListener = () => {
  browser.tabs.create({
    url: 'index.html',
  });
};

if (!browser.browserAction.onClicked.hasListener(clickListener)) {
  browser.browserAction.onClicked.addListener(clickListener);
}

function rewriteCookie(e) {
  e.responseHeaders.forEach(header => {
    if(header.name.toLowerCase() === 'set-cookie')
      header.value += '; SameSite=None; Secure';
    else if(header.name.toLowerCase() === 'location') {
      if(header.value.indexOf('http:') === 0)
        header.value = 'https:' + header.value.substr(5);
    }
  });

  return { responseHeaders: e.responseHeaders }
}

const opts = ['blocking', 'responseHeaders'];
if(navigator.userAgent.indexOf('Chrome') !== -1) opts.push('extraHeaders')

if(!browser.webRequest.onHeadersReceived.hasListener(rewriteCookie))
  browser.webRequest.onHeadersReceived.addListener(rewriteCookie, {
    urls: [
      'https://learn2018.tsinghua.edu.cn/*',
    ],
  }, opts);
