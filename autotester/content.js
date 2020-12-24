// 本脚本与原始页面共享DOM
var sleep = function(time) {
    var startTime = new Date().getTime() + parseInt(time, 10);
    while(new Date().getTime() < startTime) {}
};


chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	var name = request.message;
	console.log(name);
	//var entries = window.performance.getEntriesByType("resource");
    //console.log(entries);
	chrome.runtime.sendMessage({id:name})
	return true;
})

