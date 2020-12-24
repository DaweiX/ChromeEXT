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
	    chrome.storage.local.get('uuid', function(items) {
		    console.log("%c" + items.uuid, 'color:black;background:yellow');
	    });
    });
    
    //变量初始化
    document.count = 0;
    document.count2 = 0;
    enablednum = 0;
    idlist = []
    honeyid = null;
});

var enablednum = 0;
var idlist = []
var honeyid = null;

function launchHoney() {
    var honey = 'file:///home/honey/Desktop/project/honey_pro/project/views/index.html';
    chrome.tabs.create({url: honey, pinned: true}, function(tab) {
        honeyid = tab.id;
    });
}

function uninstallExts() {

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
    var title = document.createElement('p');
    title.innerText = i.name;
    //var id = document.createElement('p');
    //id.innerText = i.id;
    div.appendChild(title);
    //div.appendChild(id);
    item.appendChild(div);
    return item;
}

function Run() {

    //launchHoney();
    //close all probably running extensions

    document.count = 0;
    document.count2 = 0;
    var i = 0
    async.eachSeries(idlist,function(uuid,callback) {
        i++;
        async.waterfall([
            function(cb){cb(null, uuid)},
	    function(uuid,cb){
                chrome.management.setEnabled(uuid, false, function() {
                    document.count++;
                });
               // addlog('Extension ' + uuid + ' has been disabled ' + count);
                cb(null, null)
            }],
            function(err, result) {
                if (err) addlog(err,'red', 'ERROR'); 
                else
                    if (result)
                        addlog(result, 'gray');
            }
        ); callback();
    },function(err){
	if(err)
	    addlog(err,'red','ERROR')
    })
    
    if (document.count == enablednum)
        addlog('All extensions disabled!', 'green');
    else {
        addlog((enablednum - document.count) + ' extensions disabled failed!', 'orange');
        addlog(document.count + '\t' + enablednum)
    }
    
    var j = 0;
    async.eachSeries(idlist, function(uuid,callback) {
        j++;
        async.waterfall([
            function(cb) {
                //chrome.storage.local.set({'uuid': uuid});
                //addlog('Extension ' + uuid + ' is ready for being enabled. ' + (j + 1), 'blue');
                cb(null, uuid);
            },
        
            function(uuid, cb) {
				chrome.management.setEnabled(uuid, true);
				addlog('Extension ' + uuid + ' has been enabled. ' + (j), 'blue');
				cb(null, uuid);
			},
			
			function (uuid, cb) {
				chrome.tabs.reload();
				addlog('Reloaded');
				cb(null, uuid);
			},
			
			function (uuid, cb) {
			    resp = uuid;
			    addlog('Start sending msg for ' + uuid);
				chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
				     chrome.tabs.sendMessage(tabs[0].id, {message: uuid},function(response){console.log(response);  })  
				
				}); sleep(111111);cb(null , uuid)

//			sleep(5000)
				
			},
			
//		function (resp, cb) {
//			    var id = resp;
//			    if (resp.indexOf("-") > 0) {
//			        var response = resp.split('-')[1];
//			        id = resp.split('-')[0];
//				    addlog('Response for ' + id + ": " + response, 'aquamarine');
//				    if (id != myid) {
//					    addlog('Response ok received', 'aquamarine');					    
//				    }
//				}
//				cb(null, id);
//			},
			
			function(id, cb) {
				chrome.management.setEnabled(id, false, function() {
				    document.count2++;
				    chrome.tabs.reload();
				});
				addlog('Extension ' + id + ' has been disabled', 'blue');
				cb(null, null);
			},
		],
        function(err, result) {
			chrome.tabs.reload();
            if (err) addlog(err, 'red', 'ERROR'); 
            else
                if (result)
                    addlog(result, 'gray');
        }) 
		callback();
    }, function(err){if(err)addlog(err,'red','ERROR')})
	
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


