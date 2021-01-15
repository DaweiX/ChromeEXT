chrome.runtime.onMessage.addListener(function(response, sender, sendResponse) {
    var id = response.id;
    addlog('uuid: ' + id, 'black', 'FINGER')
    return true;
});
