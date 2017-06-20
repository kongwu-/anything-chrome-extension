chrome.browserAction.onClicked.addListener(function(tab) {
    var indexUrl = chrome.extension.getURL("index.html");
    chrome.tabs.create({url:indexUrl});
});
