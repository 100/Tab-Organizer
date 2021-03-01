//utility function to obtain base URL from a given URL string
function baseURL(url){
    if (url.indexOf("chrome-extension://") != -1){
        url = url.split(/chrome-extension\:\/\/.*?\//).slice(1,2).join();
    }
    if (url.indexOf("http") != -1){
        var temp = url.split("//").slice(1,2).join().toLowerCase();
        if (url.indexOf("/") != -1){
            return temp.substring(0, temp.indexOf("/"));
        }
        return temp;
    }
    return url.split(".").slice(0,1).join().toLowerCase();
}

//sorting algorithm
function sortTabs(tabs){
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
}

//format procedure for sorting
function formalSort(){
    chrome.tabs.query({currentWindow: true}, function(tabs){
        sortTabs(tabs);
    });
}

//sort on icon click
chrome.browserAction.onClicked.addListener(function(tab){
    formalSort();
});

//sort on ctrl+shift+a
chrome.commands.onCommand.addListener(function (command) {
    if (command === "activate"){
        formalSort();
    }
});


//set default storage values in chrome storage if not currently there
//and set timer if applicable
    chrome.storage.sync.get({
        sortType: null,
        sortFreq: null
    }, function(items) {
        if (items.sortType === null){
            chrome.storage.sync.set({
                sortType: "manual"
            });
        }
        if (items.sortFreq === null){
            chrome.storage.sync.set({
                sortFreq: "30"
            });
        }
        if (items.sortType === "auto"){
            if (items.sortFreq != null){
                var interval = parseInt(items.sortFreq);
                setInterval(formalSort, interval * 1000 * 60);
            }
        }
    });
