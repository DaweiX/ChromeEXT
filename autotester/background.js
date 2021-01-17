honey_tag_id = null;

// chrome.tabs.onCreated.addListener(function (tab) {
//     chrome.tabs.remove(tab.id);
// });

function checkhoney() {
    chrome.tabs.get(honey_tag_id, function (tab) {
        url = tab.url;
        purl = tab.pendingUrl;
        if (purl) {
            //console.log('purl: ' + purl);
            if (purl.indexOf('localhost:3000') > -1) {
                //console.log('purl is honey');
                return;
            }
            if (purl.startsWith('chrome')) {
                //console.log('purl is chrome');
                return;
            }
        }
        if (url) {
            //console.log('url: ' + url);
            if (url.indexOf('localhost:3000') > -1) {
                //console.log('url is honey');
                return;
            }
            if (url.startsWith('chrome')) {
                //console.log('url is chrome');
                return;
            }
            console.log('INVALID UPDATE');
            chrome.tabs.update(honey_tag_id, { 'url': 'http://localhost:3000/' },
                function () {
                    chrome.notifications.create(null, {
                        type: 'basic',
                        iconUrl: 'icon.png',
                        title: 'Autotester',
                        message: 'Navigate in page detected. Back to honey.'
                    });
                });
        }
    })
}

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.cmd == "start") {
            // test all extensions, except for autotester
            chrome.management.getAll(async function (e) {
                for (k = 0; k < e.length; k++) {
                    var i = e[k];
                    if (i.id == myid) continue;
                    idlist.push(i.id);
                    if (i.icons) iconlist.push(i.icons[0].url);
                    else iconlist.push('placeholder.png');
                }
                Run();
            });
            sendResponse("start_run");
        }
        else if (request.honeyid) {
            honey_tag_id = request.honeyid;
            sendResponse("id_updated");
        }
    }
);

// change the value to yours. You can directly change them in background_bundle.js
var myid = 'jobmhdjcfeppgkggmdapaakjlkdcpmcc';
var async = require('async');   // browserify background.js > background_bundle.js
var delay = 10000;              // time delay for collecting fingerprint loaded

var _log = getlog('AutoTester Start');
console.log(_log, 'color:green');

count_disabled = 0;
count_tested = 0;
idlist = []
iconlist = []

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    honey_tag_id = tabs[0].id;
    chrome.notifications.create(null, {
        type: 'basic',
        iconUrl: 'icon.png',
        title: 'Autotester',
        message: 'Autotester Inited. Honey Tab id: ' + honey_tag_id
    });
});

function getlog(content, type) {
    color = typeof color !== 'undefined' ? color : 'gray';
    type = typeof type !== 'undefined' ? type : 'INFO';
    return type + '\t' + gtime() + '\t%c' + content;
}

function gtime() {
    var date = new Date();
    return date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
}

var sleep = function (time) {
    var startTime = new Date().getTime() + parseInt(time, 10);
    while (new Date().getTime() < startTime) { }
};

function Run() {
    //close all probably running extensions
    count_disabled = 0;
    count_tested = 0;

    for (i = 0; i < idlist.length; i++) {
        async.waterfall([
            function (cb) {
                iconurl = iconlist[i];
                if (idlist[i].enabled) {
                    chrome.management.setEnabled(idlist[i], false, function () {
                        count_disabled++;
                        cb(null, null);
                    });
                } else {
                    cb(null, null);
                }
            }],
            function (err, result) {
                if (err) console.log(err, 'color:red');
            }
        );
    }

    if (count_tested > 0) {
        chrome.notifications.create(null, {
            type: 'basic',
            iconUrl: 'icon.png',
            title: 'Autotester',
            message: count_disabled + ' extensions disabled!'
        });
    }

    // Waterfall
    async.eachSeries(idlist, function (uuid, callback) {
        async.waterfall([
            function (cb) {
                chrome.tabs.reload(honey_tag_id, { bypassCache: true },
                    function () {
                        var _log = getlog('Honeysite reloaded');
                        console.log(_log, 'color:pink');
                        cb(null, uuid);
                    });
            },

            function (uuid, cb) {
                var _log = getlog('ID: ' + uuid + 'sended to honey. Waiting...');
                console.log(_log, 'color:gray');
                chrome.tabs.sendMessage(honey_tag_id, { current_ext_id: uuid }, function (res) {
                    if (res) {
                        console.log(res);
                        cb(null, uuid);
                    }
                    if (chrome.runtime.lastError) {
                        console.warn(chrome.runtime.lastError.message);
                        cb(null, uuid);
                    }
                });
            },

            function (uuid, cb) {
                chrome.management.setEnabled(uuid, true, function () {
                    var _log = getlog('Extension ' + uuid + ' has been enabled.');
                    console.log(_log, 'color:blue');
                   // setInterval(checkhoney, 500);
                    setTimeout(function () {
                        //clearInterval();
                        cb(null, uuid);
                    }, delay);
                });
            },

            function (uuid, cb) {
                //sleep(delay);
                count_tested++;
                chrome.management.setEnabled(uuid, false, function () {
                    var _log = getlog(uuid + ' tested done.');
                    console.log(_log, 'color:blue');
                    i = idlist.indexOf(uuid);
                    chrome.notifications.create(null, {
                        type: 'basic',
                        iconUrl: iconlist[i],
                        contextMessage: 'Autotester',
                        message: uuid + ' tested done.',
                        title: 'Tested: ' + count_tested + '/' + idlist.length
                    }, function (nid) {
                        callback();
                    });
                });
            }
        ], function (err, result) {
            if (err) console.log(err, 'color:red');
        });

    }, function (err, result) {
        if (err)
            console.log(err, 'color:red');
        else {
            var _log = getlog(count_tested + ' exts tested done');
            console.log(_log, 'color:green');
            chrome.notifications.create(null, {
                type: 'basic',
                iconUrl: 'icon.png',
                title: 'Autotester',
                message: count_tested + ' extensions tested!'
            });
        }
    });
}