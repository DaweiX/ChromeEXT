// change the value to yours. You can directly change them in bundle.js
var myid = 'jobmhdjcfeppgkggmdapaakjlkdcpmcc';
//var honey_path = 'file:///C:/Users/DaweiX/Desktop/Web/autotester/honey4test.html';

var honey_path = "http://localhost:3000/";
var async = require('async');   // browserify popup.js > bundle.js
var delay = 10000;              // time delay for collecting fingerprint loaded
// var port = null;

$(document).ready(function () {
    var _log = getlog('AutoTester Start');
    console.log(_log, 'color:green');
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        honey_tag_id = tabs[0].id;
        $("#p_honey_id").html(honey_tag_id);
        var _log = getlog('Tab located: ' + honey_tag_id);
        console.log(_log, 'color:green');

        // port = chrome.tabs.connect(honey_tag_id, { name: "myport" });
        // port.onMessage.addListener(function (msg) {
        //     if (msg.success === true) {
        //         $("#p_honey_id").html(honey_tag_id + "(connected)");
        //     }
        //     else if (msg.from_popup) {
        //         is_ready = true;
        //     }
        // });
    });

    var items = document.createElement('div');
    chrome.management.getAll(async function (e) {
        for (k = 0; k < e.length; k++) {
            var i = e[k];
            // if (i.type == "theme") continue;
            if (i.id == myid) continue;
            idlist.push(i.id);
            if (i.enabled) count_enabled++;
            items.appendChild(getItemDiv(i));
        }
        $("#p_total").html(e.length - 1);
    });
    $(".list").html(items);

    // List: List all exts in console
    $("#btn1").click(function () {
        chrome.management.getAll(function (e) {
            for (i = 0; i < e.length; i++) {
                console.log(e[i]);
            }
        });
    });

    // Honey: Launch and pin honey
    $("#btn2").click(function () {
        launchHoney();
    });

    // Start: Start the test
    $("#btn3").click(function () {
        //Run();
        chrome.runtime.sendMessage({ cmd: "start"}, function (response) {
            console.log(response);
        });
    });

    $("#btn4").click(function () {
        chrome.windows.create({
            focused: true,
            type: "popup",
            url: "http://localhost:3000"
        });
    });

    // Pinpoint honey page
    $("#btn5").click(function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            honey_tag_id = tabs[0].id;
            $("#p_honey_id").html(honey_tag_id);
            chrome.runtime.sendMessage({ honeyid: honey_tag_id }, function (response) {
                console.log(response);
            });
        });
    });


    // Unist: Uninstall all exts
    $("#btn6").click(function () {
        chrome.management.getAll(function (e) {
            for (i = 0; i < e.length; i++) {
                if (e[i].id == myid) continue;
                var _log = getlog('Now uninstalling: ' + e[i].id);
                console.log(_log, "color:purple");
                chrome.management.uninstall(e[i].id);
            }
        });
    });
});

count_enabled = 0;
count_disabled = 0;
count_tested = 0;
idlist = []
honey_tag_id = null;

function gtime() {
    var date = new Date();
    return date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
}

function sleep2(time) {
    return new Promise(resolve => setTimeout(resolve, time))
}

var sleep = function (time) {
    var startTime = new Date().getTime() + parseInt(time, 10);
    while (new Date().getTime() < startTime) { }
};

function getlog(content, type) {
    color = typeof color !== 'undefined' ? color : 'gray';
    type = typeof type !== 'undefined' ? type : 'INFO';
    return type + '\t' + gtime() + '\t%c' + content;
}

function launchHoney() {
    chrome.tabs.create({ url: honey_path, pinned: true }, function (tab) {
        honey_tag_id = tab.id;
    });
}

function getItemDiv(i) {
    //console.log(i);
    var item = document.createElement('div');
    item.className = "item";
    var icon = document.createElement('img');
    if (i.icons) {
        icon.src = i.icons[0].url;
        icon.className = "icon";
        item.appendChild(icon);
    }
    var div = document.createElement('div');
    //var title = document.createElement('p');
    //title.innerText = i.name;
    var id = document.createElement('p');
    id.className = "white";
    id.innerText = i.id;
    //div.appendChild(title);
    div.appendChild(id);
    item.appendChild(div);
    return item;
}

function Run() {
    //close all probably running extensions
    count_disabled = 0;
    count_tested = 0;

    for (i = 0; i < idlist.length; i++) {
        async.waterfall([
            function (cb) {
                chrome.management.setEnabled(idlist[i], false, function () {
                    count_disabled++;
                    cb(null, null);
                });
            }],
            function (err, result) {
                if (err) console.log(err, 'color:red');
            }
        );
    }

    var _log = getlog(count_disabled + ' extensions disabled!');
    console.log(_log, 'color:green');

    // Waterfall
    async.eachSeries(idlist, function (uuid, callback) {
        async.waterfall([
            // function (cb) {
            //     chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            //         honey_tag_id = tabs[0].id;
            //         $("#p_honey_id").html(honey_tag_id);
            //         cb(null, null);
            //     });
            // },

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
                $("#p_ext_id").html(uuid);
                $("#p_tested").html(count_tested);
                //sleep(delay_pageload);
                chrome.management.setEnabled(uuid, true, function () {
                    var _log = getlog('Extension ' + uuid + ' has been enabled.');
                    console.log(_log, 'color:blue');
                    cb(null, uuid);
                });
            },

            function (uuid, cb) {
                sleep(delay);
                count_tested++;
                chrome.management.setEnabled(uuid, false, function () {
                    var _log = getlog(uuid + ' tested done.');
                    console.log(_log, 'color:blue');
                    callback();
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
            $("#p_tested").html(count_tested);
        }
    });
}

