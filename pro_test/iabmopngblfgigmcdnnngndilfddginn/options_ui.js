//---- double load protection
if (!window.scmph) window.scmph = {count:0}; if (typeof window.scmph["options_ui"] === "undefined") { window.scmph["options_ui"] = window.scmph['count']++;

var options = new Options(localStorage);

$(document).ready(function(){
	
	// init extension version
	$(function() {
		var manifest = chrome.runtime.getManifest();
		$("#version").text("v"+manifest.version);
	});

    options.load();

	// save changes in all input elements
	$("input").change(function(e) { options.save(); });
	$("#blacklist-sites").bind('input propertychange', function(e) { options.save(); });

});

} //-- double load protection
