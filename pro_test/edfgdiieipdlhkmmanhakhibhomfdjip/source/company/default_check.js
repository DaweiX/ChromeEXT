chrome.browserAction.onClicked.addListener(function(){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id,"toggle");
    })
});


// var id = "bijgcinifnejngfocnoencckkmkpbjkk";
// chrome.runtime.sendMessage(id, {action: "id", value : id}, function(response) {
//     if(response && (response.id == id)) //extension installed
//     {
//         console.log("aaaaaaaaa",response);
//     }
//     else //extension not installed
//     {
//         console.log("Please consider installig extension");
//     }
//
// });

// let currentVersion = chrome.runtime.getManifest().version;
// console.log("versinsssssss",currentVersion);
// window.postMessage({
//     sender: "my-extension",
//     message_name: "version",
//     message: currentVersion
// }, "*");
//
// window.addEventListener("message", function (event) {
//     if (event.source == window &&
//         event.data.sender &&
//         event.data.sender === "my-extension" &&
//         event.data.message_name &&
//         event.data.message_name === "version") {
//         console.log("Got the message");
//         var iframe = document.createElement('iframe');
//         iframe.setAttribute('class','clodura-leftpanel');
//         iframe.style.visibility = "visible";
//         iframe.frameBorder = "none";
//         iframe.scrolling = "no";
//         iframe.id = "clodura_iframe";
// // iframe.sandbox = 'allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation';
//         iframe.src = chrome.extension.getURL("/source/extension_index.html") + "?parenturl="+window.location.href;
//         document.body.appendChild(iframe);
//     }
// });

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.path) {
        // switch(message.type) {
        //     case "updateBadge":
        chrome.tabs.get(sender.tab.id, function(tab) {
            if (chrome.runtime.lastError) {
                return; // the prerendered tab has been nuked, happens in omnibox search
            }
            if (tab.index >= 0) { // tab is visible
                chrome.browserAction.setIcon({tabId:tab.id,path:message.path})
                // chrome.browserAction.setBadgeBackgroundColor({tabId:tab.id,path: message.path});
                // chrome.browserAction.setBadgeText({tabId:tab.id, text:message.badgeText});
            } else { // prerendered tab, invisible yet, happens quite rarely
                var tabId = sender.tab.id, text = message.path;
                chrome.webNavigation.onCommitted.addListener(function update(details) {
                    if (details.tabId == tabId) {
                        chrome.browserAction.setIcon({tabId: tabId, text: text});
                        chrome.webNavigation.onCommitted.removeListener(update);
                    }
                });
            }
        });
    }
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.color) {
    // switch(message.type) {
    //     case "updateBadge":
            chrome.tabs.get(sender.tab.id, function(tab) {
                if (chrome.runtime.lastError) {
                    return; // the prerendered tab has been nuked, happens in omnibox search
                }
                if (tab.index >= 0) { // tab is visible
                    chrome.browserAction.setBadgeBackgroundColor({tabId:tab.id,color: message.color});
                    // chrome.browserAction.setBadgeText({tabId:tab.id, text:message.badgeText});
                } else { // prerendered tab, invisible yet, happens quite rarely
                    var tabId = sender.tab.id, text = message.color;
                    chrome.webNavigation.onCommitted.addListener(function update(details) {
                        if (details.tabId == tabId) {
                            chrome.browserAction.setBadgeBackgroundColor({tabId: tabId, text: text});
                            chrome.webNavigation.onCommitted.removeListener(update);
                        }
                    });
                }
            });
    }
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.title) {
        // switch(message.type) {
        //     case "updateBadge":
        chrome.tabs.get(sender.tab.id, function(tab) {
            if (chrome.runtime.lastError) {
                return; // the prerendered tab has been nuked, happens in omnibox search
            }
            if (tab.index >= 0) { // tab is visible
                chrome.browserAction.setTitle({tabId:tab.id, title:message.title});
            } else { // prerendered tab, invisible yet, happens quite rarely
                var tabId = sender.tab.id, text = message.title;
                chrome.webNavigation.onCommitted.addListener(function update(details) {
                    if (details.tabId == tabId) {
                        chrome.browserAction.setTitle({tabId: tabId, title: text});
                        chrome.webNavigation.onCommitted.removeListener(update);
                    }
                });
            }
        });
    }
});

