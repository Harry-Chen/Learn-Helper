chrome.extension.onMessage.addListener(function(feeds, sender, sendResponse) {
     chrome.tabs.create({"url": feeds.url});
     sendResponse();
 }); 

