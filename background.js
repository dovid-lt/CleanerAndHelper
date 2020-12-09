function blockRequest(details) {
    return {cancel: true};
}

function updateFilters(urls) {
    if(chrome.webRequest.onBeforeRequest.hasListener(blockRequest))
      chrome.webRequest.onBeforeRequest.removeListener(blockRequest);
    chrome.webRequest.onBeforeRequest.addListener(blockRequest, {urls: [
    "https://www.jdn.co.il/wp-content/plugins/jdn_ads/js/info.js",
    "http://www.jdn.co.il/wp-content/plugins/jdn_ads/js/info.js",
    "https://info.jdn.co.il/*"
    ]}, ['blocking']);
}

//updateFilters();
