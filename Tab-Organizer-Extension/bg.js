function baseURL(url){
    if (url.indexOf("http") != -1){
        var temp = url.split("//").slice(1,2).join().toLowerCase();
        if (url.indexOf("/") != -1){
            return temp.substring(0, temp.indexOf("/"));
        }
        return temp;
    }
    return url.split(".").slice(0,1).join().toLowerCase();
}

chrome.browserAction.onClicked.addListener(function(tab){
    chrome.tabs.query({currentWindow: true}, function(tabs){
        var baseURLs = {};
        var URLOrder = [];
        var lastPinned = 0;
        for (var i = 0; i < tabs.length; i++){
            if (tabs[i].pinned){
                if (tabs[i].index > lastPinned){
                    lastPinned = tabs[i].index;
                }
                continue;
            }
            var base = baseURL(tabs[i].url);
            if (base in baseURLs){
                baseURLs[base].push([tabs[i].id, tabs[i].index]);
            }
            else{
                baseURLs[base] = [[tabs[i].id, tabs[i].index]];
                URLOrder.push(base);
            }
        }
        var currTab = lastPinned+1;
        for (var i = 0; i < URLOrder.length; i++){
            var currURL = baseURLs[URLOrder[i]];
            for (var j = 0; j < currURL.length; j++, currTab++){
                chrome.tabs.move(currURL[j][0], {index: currTab});
            }
        }
    });
});
