chrome.runtime.onMessage.addListener(function(response, sender, sendResponse) {
	    var id = response.id;
	    var msg = response.msg;
	    var http = response.http;
	    addlog('uuid: ' + id, 'black', 'FINGER')
		chrome.management.setEnabled(id, false);
		addlog('Extension ' + id + ' has been disabled', 'blue');
		return true;
});
