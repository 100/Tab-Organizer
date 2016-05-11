function save_options(){
    var type = document.getElementById("type").value;
    var freq = document.getElementById("freq").value;
    chrome.storage.sync.set({
        sortType: type,
        sortFreq: freq
    }, function(){
        document.getElementById('status').textContent = "Options saved. You may need to reload Chrome for changes to take place.";
        setTimeout(function(){
            status.textContent = '';
        }, 750);
    });
}

function restore_options(){
    chrome.storage.sync.get({
        sortType: "manual",
        sortFreq: "30"
    }, function(items){
        document.getElementById("type").value = items.sortType;
        document.getElementById("freq").value = items.sortFreq;
    });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
