var _gaq = _gaq || [];

var options = new Options(localStorage);
options.initDefaults();

var scmSync = new ScmSync(options);

var commands = {
    "loadOptions": {
        "handler": function(request, sender, sendResponse) { 
            sendResponse({options: options.localStorage});
        }
    },

    "saveOptions": {
        "handler": function(request, sender, sendResponse) {
            for (var key in request.options) {
                localStorage[key] = request.options[key];
            }
            sendResponse({});
        }
    },

    "checkScm": {
        "async": true,
        "handler": function(request, sender, sendResponse) { 
            scmSync.checkScm(request, function(data) {
                sendResponse(data);
            });    
        }
    },

    "activeTabUrl": {
        "async": true,
        "handler": function(request, sender, sendResponse) {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                var tab = tabs.length ? tabs[0] : "";
                var matched = tabs.length ? checkUrlForBlackListSites(tab.url, options.get('blacklist-sites'), true) : [];
                var parser = document.createElement('a');
                parser.href = tab.url;
                // parser.protocol; // => "http:"
                // parser.host;     // => "example.com:3000"
                // parser.hostname; // => "example.com"
                // parser.port;     // => "3000"
                // parser.pathname; // => "/pathname/"
                // parser.hash;     // => "#hash"        

                sendResponse({url: tab.url, hostname: parser.host, sites: matched});
            });
        }
    },

    "addBlackListSites": {
        "async": true,
        "handler": function(request, sender, sendResponse) {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                var tab = tabs.length ? tabs[0] : "";

                var parser = document.createElement('a');
                parser.href = tab.url;

                sendResponse({url: tab.url, tabId: tab.id, hostname: parser.host, sites: options.addBlackListSites(request.sites)});
            });
        }
    },

    "removeBlackListSites": {
        "async": true,
        "handler": function(request, sender, sendResponse) {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                var tab = tabs.length ? tabs[0] : "";

                var parser = document.createElement('a');
                parser.href = tab.url;

                sendResponse({url: tab.url, tabId: tab.id, hostname: parser.host, sites: options.removeBlackListSites(request.sites)});
            });
        }
    },

    "updateBadge": {
        "async": false,
        "handler": function(request, sender, sendResponse) {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                if (tabs.length > 0) {
                    var tab = tabs[0];
                    chrome.browserAction.setBadgeText({text: request.text, tabId: tab.id});
                    chrome.browserAction.setBadgeBackgroundColor({color: "#333399", tabId: tab.id});

                    if ('reload' in request && request.reload === true) {
                        chrome.tabs.reload(tab.id);
                    }
                }
                sendResponse({});
            });
        }
    },

    "clearBadgeBanned": {
        "async": false,
        "handler": function(request, sender, sendResponse) {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                if (tabs.length > 0) {
                    var tab = tabs[0];
                    chrome.browserAction.setBadgeText({text: "", tabId: tab.id});
                    chrome.browserAction.setBadgeBackgroundColor({color: "#333399", tabId: tab.id});

                    if ('reload' in request && request.reload === true) {
                        chrome.tabs.reload(tab.id);
                    }
                }
                sendResponse({});
            });
        }
    },

    "updateBadgeBanned": {
        "async": false,
        "handler": function(request, sender, sendResponse) {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                if (tabs.length > 0) {
                    var tab = tabs[0];
                    //chrome.browserAction.setTitle({title: '', tabId: tab.id});
                    chrome.browserAction.setBadgeText({text: '-', tabId: tab.id});
                    chrome.browserAction.setBadgeBackgroundColor({color: "#993333", tabId: tab.id});

                    if ('reload' in request && request.reload === true) {
                        chrome.tabs.reload(tab.id);
                    }
                }
                sendResponse({});
            });
        }
    },

    "gaTrackPageView": {
        "handler": function(request, sender, sendResponse) { 
            var args = [];
            args.push("_trackPageview");
            for (i in request.args) args.push(request.args[i]);
            _gaq.push(args);
        }
    },

    "gaSendEvent": {
        "handler": function(request, sender, sendResponse) { 
            var args = [];
            args.push("_trackEvent");
            for (i in request.args) args.push(request.args[i]);
            _gaq.push(args);
        }
    },
}


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method in commands) {
        var cmd = commands[request.method];
        var async = ("async" in cmd && cmd["async"] === true);
        var handler = cmd["handler"];

        handler(request, sender, sendResponse);
        if (async) {
            return true; // don't close message channel, close it inside sendResponse callback using sendResponse
        }

    } else {
        console.log("Unknown request=", request);
    }
});


chrome.runtime.onInstalled.addListener(function(details) {
    if (details.reason == 'install') {
        gaSendEvent('extension', 'install', chrome.runtime.getManifest().version, 1);
    } else if (details.reason == 'update') {
        gaSendEvent('extension', 'update', chrome.runtime.getManifest().version, 1);
    }
});
