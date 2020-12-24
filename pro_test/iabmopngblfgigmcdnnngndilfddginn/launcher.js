$(document).bind("ready-to-launch", function(e, data) {
    var options = new Options(data.options);

    if (options.get('checker-mode')) {
        var body = document.getElementsByTagName('body');
        if (body && body.length) {
            body = body[0]
            body.dataset["pac"] = "v"+chrome.runtime.getManifest().version
        }
	    var scmHighlighter = new Scm(options);
	    scmHighlighter.highlightAll();
    }
});

loadOptions(function(options) {
    setTimeout(function() {
        $(document).trigger("ready-to-launch", {options: options});
    }, 0);
}); //- loadOptions
