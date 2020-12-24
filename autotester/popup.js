var myid = 'fapnbolmcjcfifjfkpjfidbkokfldklg';
var async = require('async');

$(document).ready(function () {
    addlog('AutoTester Init', 'green');
    var items = document.createElement('div');
    chrome.management.getAll(async function (e) {
        for (k = 1; k < e.length; k++) {
            var i = e[k];
            if (i.type == "theme") continue;
            if (i.id == myid) continue;
            idlist.push(i.id);
            if (i.enabled) enablednum++;
            items.appendChild(getItemDiv(i));
        }
        $("#count").html("Ext Count: " + (e.length - 1))
    });
    $(".list").html(items);
    $("#btn1").click(function () {
        chrome.management.getAll(function (e) {
            for (i = 1; i < e.length; i++) {
                console.log(e[i]);
            }
        });
    });
    
    $("#btn2").click(function () {
        launchHoney();
    });
    
    $("#btn3").click(function () {
        Run();
    });
    
    $("#btn4").click(function () {
        console.clear();
        printlog();
        clearlog();
    });
    
    $("#btn5").click(function () {
	    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
			honeytag = tabs[0].id;
			$("#count").html(honeytag);
		});
    });
    
    
    $("#btn6").click(function () {
	    chrome.management.getAll(function (e) {
            for (i = 1; i < e.length; i++) {
                 if (e[i].id == myid) continue;
                 chrome.management.uninstall(e[i].id);
            }
        });
    });
    
    //变量初始化
    document.count = 0;
    document.count2 = 0;
    enablednum = 0;
    idlist = []
    honeyid = null;
    honeytag = null;
    
    
});

var enablednum = 0;
var idlist = []
var honeyid = null;
var honeytag = null;

function launchHoney() {
    var honey = 'file:///home/honey/Desktop/project/honey_pro/project/views/index.html';
    chrome.tabs.create({url: honey, pinned: true}, function(tab) {
        honeyid = tab.id;
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
    id.innerText = i.id;
    //div.appendChild(title);
    div.appendChild(id);
    item.appendChild(div);
    return item;
}

function Run() {

    //launchHoney();
    //close all probably running extensions
    document.count = 0;
    document.count2 = 0;
    
    for(i = 0; i < idlist.length; i++) {
        var temp = idlist[i];
        async.waterfall([
            function(cb){
                chrome.management.setEnabled(temp, false, function() {
                    document.count++;
                });
                //console.log('Extension ' + temp + ' has been disabled ' + count);
                cb(null, null)
            }],
            function(err, result) {
                if (err) console.log(err); 
                else
                    if (result)
                        addlog(result);
            }
        );
    }
    
    if (document.count == enablednum)
        addlog('All extensions disabled!', 'green');
    else {
        addlog((enablednum - document.count) + ' extensions disabled failed!', 'orange');
        addlog(document.count + '\t' + enablednum)
    }
    
    var j = 0;
    async.eachSeries(idlist, function(uuid, callback) {
        j++;
        honeytag = honeytag;
        async.waterfall([
        
            function(cb) {
				chrome.management.setEnabled(uuid, true);
				addlog('Extension ' + uuid + ' has been enabled. ' + j, 'blue');
				cb(null, uuid);
			},
			
			function (uuid, cb) {
				chrome.tabs.reload();
				addlog('Reloaded');
				cb(null, uuid);
			},
			
			function (uuid, cb) {
			    addlog('Start sending msg for ' + uuid);			   							
				chrome.tabs.sendMessage(honeytag, {message: uuid});
				sleep(8000)
				cb(null, uuid);
			},
			
			function (uuid, cb) {
	
			    chrome.management.setEnabled(uuid, false);
		        addlog('Extension ' + uuid + ' has been disabled', 'blue');
		        cb(null, null);
			}
		],
		
        function(err, result) {
			chrome.tabs.reload();
            if (err) addlog(err, 'red', 'ERROR'); 
            else
                if (result)
                    addlog(result, 'gray');
        })
        
        callback();
        
    }, function (err) {
        if (err)
            addlog(err ,'red', 'ERROR');
        else
            addlog(j + ' exts tested done', 'green')
    })
	
	$("#count").html("Finished")
	
	//chrome.tabs.remove(honeyid);
	/*
	if (document.count2 == idlist.length)
        addlog('All extensions tested!', 'green');
    else {
        addlog((idlist.length - document.count2) + ' extensions tesed failed!', 'red', 'ERROR');
        addlog(idlist.length + '\t' + document.count2)
    }
    */
}



