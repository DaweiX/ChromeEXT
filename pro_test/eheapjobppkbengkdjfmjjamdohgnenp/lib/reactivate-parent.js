if (window.name == 'meucupom-reactive-last-tab') {
	//window has been opened by meucupom -- reactivate parent tab and dont do anything else
	chrome.runtime.sendMessage({
		action: "reactiveTab"
	});

	chrome.runtime.sendMessage({ action: 'nextUrlDomain.get' }, function(domain) {
		if (document.location.host.indexOf(domain) > -1) {
			setTimeout(function() {
				window.close();
			}, 1000);
		}
	});
}