/// Start Fetchable ///
var Fetchable = function(data) {
  this.data = data;
};
// var baseurl= "https://localhost:5000/";
var baseurl = "https://product.clodura.ai/";
// var baseurl = "https://beta.clodura.com/";

Fetchable.prototype = {

  fetch: function(delay_milliseconds) {
    var self = this;
    $.get(this.data.url)
    .done(function (data, textStatus, xhr) {
      debugLog("fetch.done");
      queue_processor.doneWorking();
      setTimeout(function() {
        queue_processor.processNext();
      }, delay_milliseconds);
      self.update({response_body: xhr.responseText, response_status: xhr.status});
    })
    .fail(function (xhr, errorMessage, error) {
      debugLog("fetch.fail");
      queue_processor.doneWorking();
      self.update({response_body: xhr.responseText, response_status: xhr.status});
    });
  },

  update: function(data) {
    var self = this;

    $.ajax({
       url: pluginUrl+'/fetchables/'+self.data.id,
       type: 'PUT',
       data: data
    })
    .done(function (data, textStatus, xhr) {
      debugLog("update.done");
      setBadge(data.pending_count);
    })
    .fail(function (xhr, errorMessage, error) {
      console.log("update.fail: error updating fetchable "+self.data.id);
    });
  }

};
/// End Fetchable ///

/// Start QueueProcessor ///
var QueueProcessor = function() {
  this._working = false;
  this._error = false;
};

QueueProcessor.prototype = {

  setError: function(error) {
    debugLog("setError(" + error + ")");
    this._error = error;
  },

  getError: function() {
    debugLog("getError() -> " + this._error);
    return this._error;
  },

  setWorking: function(working) {
    debugLog("setWorking(" + working + ")");
    this._working = working;
  },

  getWorking: function() {
    debugLog("getWorking() -> " + this._working);
    return this._working;
  },

  startWorking: function() {
    this.setWorking(true);
  },

  doneWorking: function() {
    this.setWorking(false);
  },

  isIdle: function() {
    return (this.getWorking() == false);
  },

  processNext: function() {
    var self = this;

    if( this.getError() == true ) {
      debugLog("Can't process next queue item. QueueProcessor errored out.");
      return;
    }

    if( self.isIdle() ) {
      self.startWorking();

      $.post(pluginUrl+"/fetchables/pop")
      .done(function (data, textStatus, response) {
          debugLog(data);
          fetchable = data.fetchables[0]
          if( fetchable ) {
            debugLog("go fetch!");
            debugLog(fetchable);
            fetchable = new Fetchable(fetchable);
            fetchable.fetch(data.delay);
          } else {
            queue_processor.doneWorking();
          }
      })
      .fail(function (xhr, errorMessage, error) {
          queue_processor.doneWorking();
          debugLog("get.fail");
      });
    } else {
      debugLog("Can't process next queue item. getWorking: " + self.getWorking());
    }
  }
};
/// End QueueProcessor ///


////////////////////////////////////////////////////////////////////////////////

initializePluginTokenFilter();
initializeGUID();

var loggedIn = false;
var userId = null;
var environment = localStorage['environment'] || 'production';
var debug = localStorage['debug'] || false;
var serviceUrl = baseurl;//"https://my.clodura.com";
var accountsUrl = "https://accounts.clodura.com";
var pluginUrl = serviceUrl + "/plugin";
var featureFlags = {};
var infiniMode = false;
var badgeCount = 0;
var currentList = 0;
var lists = [];
var teammateLists = [];
var pusherAppKey = '8290c7fb10985bc95cc7';
var queue_processor = new QueueProcessor();
var notificationOnClickedCallbacks = [];
var notificationOnButtonClickedCallbacks = [];

/* * * * * * * * * *
 * INITIALIZATION  *
 * * * * * * * * * */

var debugLog = function() {};

if (environment == "development") {
  serviceUrl = baseurl;
  accountsUrl = baseurl;
  pluginUrl = serviceUrl + "/plugin";
  pusherAppKey = '6882e9b6a45dc4779e7f';
}

if (debug) {
  debugLog = function (message) {
    window.console.log(message);
  };
  Pusher.log = function(message) {
    window.console.log(message);
  };
}

debugLog("initializing");

if (localStorage['version'] != chrome.app.getDetails().version) {
    if (typeof localStorage['version'] == 'undefined') {
        //new install
        chrome.tabs.getAllInWindow(null, ensureInstallTab);
    } else {
        //update
        var oldVersion = localStorage['version'].split('.');
        if (oldVersion[0] == 1 && oldVersion[1] <= 1) {
            chrome.storage.local.remove(['auth_token', 'environment']);
        }
    }
    localStorage['version'] = chrome.app.getDetails().version;
}

chrome.storage.local.get('currentList', function(data) { currentList = data.currentList; });
chrome.storage.onChanged.addListener(function(changes, areaName){
    if (changes.currentList) currentList = changes.currentList.newValue;
});


reconnect();

function reconnect() {

    var port = chrome.runtime.connect({
        name: 'injection'
    });

    port.onMessage.addListener(handleMessage);
    port.onDisconnect.addListener(function() {
        console.log('bg script disconnected');
        setTimeout(function() {
            try {
                reconnect();
            } catch (e) {
                location.href = location.href;
            }
        }, 1000);
    });
}

function handleMessage() {
}
// Pusher
var pusher = new Pusher(pusherAppKey, {
  encrypted: true,
  authEndpoint: pluginUrl + '/pusher/auth',
  auth: {
    headers: {
      'X-Plugin-Token': localStorage['plugin_token'],
      'X-Plugin-Guid': localStorage['guid']
    }
  }
});

if (localStorage['loggedIn']) login();


function ensureInstallTab(tabs) {
  for (var i = 0; i < tabs.length; i++) {
    if(tabs[i].url.match("www.linkedin.com")) {
      chrome.tabs.update( tabs[i].id, {selected: true});
      return;
    }
  }
//  chrome.tabs.create({url: serviceUrl + 'www.linkedin.com'});
chrome.tabs.create({url: serviceUrl});
}

function login() {
    localStorage['loggedIn'] = true;
    loggedIn = true;
    chrome.browserAction.setIcon({path: {'19': 'icons/icon19.png', '38': 'icons/icon38.png'}});
    chrome.browserAction.setPopup({popup: 'search.html'});
    updateStatus(function() {
        pusher.config.auth.headers = { 'X-Plugin-Token': localStorage['plugin_token'], 'X-Plugin-Guid': localStorage['guid'] };
        ensureUserChannel();
        queue_processor.processNext();
    });
}

function logout() {
    loggedIn = false;
    localStorage.removeItem('plugin_token');
    localStorage.removeItem('loggedIn');
    chrome.browserAction.setIcon({path: {'19': 'icons/icon19g.png', '38': 'icons/icon38g.png'}});
    chrome.browserAction.setPopup({popup: 'login.html'});
    chrome.browserAction.setBadgeText({text: ''});
    chrome.extension.sendMessage({error: 'Please log in again.'});
    leaveUserChannel();
    queue_processor.setError(false);
    queue_processor.setWorking(false);
}

function ensureUserChannel() {
  if(!userId) {
    $.get(pluginUrl + '/pusher/whoami?v=' + chrome.app.getDetails().version)
    .done(function (data) {
      userId = data.user_id;
      joinUserChannel();
    })
    .fail(function () {
      console.log("Error fetching login information");
    });
  }

  if(pusher.connection.state != "connected") {
    pusher.connect()
  }
}

function joinUserChannel() {
  var channel = pusher.subscribe('private-user-'+userId);

  channel.bind('badge-update', function(data) {
    updateStatus();
    debugLog('badge updated');
  });

  channel.bind('admin-notification', function(data) {
    notifyAdmin(data.message);
  });

  channel.bind('notification', function(data) {
    createNotification(data);
  });

  channel.bind('fetchables-updated', function(data) {
    debugLog('fetchables-updated fired');
    queue_processor.setError(false);
    queue_processor.processNext();
    updateStatus();
  });

  channel.bind('fetchables-restart', function(data) {
    debugLog('fetchables-restart fired');
    queue_processor.setError(false);
    queue_processor.setWorking(false);
    queue_processor.processNext();
  });

  channel.bind('fetchables-stop', function(data) {
    debugLog('fetchables-stop fired');
    queue_processor.setError(true);
  });

  channel.bind('ping', function(data) {
    var pongData = {
      working: queue_processor.getWorking(),
      error: queue_processor.getError()
    };
    $.post(serviceUrl + "/plugin/checkin", pongData);
  });
}

function leaveUserChannel() {
  if(userId) {
    pusher.unsubscribe('private-user-'+userId);
  }
  userId = null;
}

function notifyAdmin(message) {
  var opts = {
    type: 'basic',
    iconUrl: 'icons/icon128.png',
    title: 'Admin Notification',
    message: message
  };

  now = new Date();
  id = now.getTime().toString();
  chrome.notifications.create(id, opts, function() { /* Error checking goes here */});
}

function createNotification(notification_data) {
  now = new Date();
  id = now.getTime().toString();

  if(notification_data.onClick) {
    notificationOnClickedCallbacks[id] = new Function(notification_data.onClick);
  }

  if(notification_data.onButtonClick && notification_data.onButtonClick.length > 0) {
    notificationOnButtonClickedCallbacks[id] = [];

    for(var i=0; i < notification_data.onButtonClick.length; i++) {
      notificationOnButtonClickedCallbacks[id][i] = new Function(notification_data.onButtonClick[i]);
    }
  }

  chrome.notifications.create(id, notification_data.opts, function() { /* Error checking goes here */});
}

function setBadge(count) {
    badgeCount = count;
    chrome.browserAction.setBadgeBackgroundColor({color: "#faa732"});
    if (count <= 0) count = "";
    chrome.browserAction.setBadgeText({text: count.toString()});
}

function groupTeammateLists(teammateLists) {
  var grouped = {};
    if(teammateLists) {
    $.each(teammateLists, function(index, list) {
      if(grouped[list.teammate] == undefined) {
        grouped[list.teammate] = [];
      }
      grouped[list.teammate].push(list);
    });
  }
  return grouped;
}

function updateStatus(onSuccess) {
    var url = pluginUrl;
    if(localStorage['plugin_token'] == undefined) {
        url = serviceUrl;
    }

    $.ajax(url + '/lists/status.json', {
        type: 'GET',
        headers: {
            'X-Prospector-Version': chrome.app.getDetails().version
        },
        success: function (status) {
            badgeCount   = status.fetchablesPending;
            lists        = status.lists;
            teammateLists = groupTeammateLists(status.teammate_lists);
            featureFlags = status.features;
            infiniMode   = status.infiniMode;
            disabled     = status.disabled;
            if(status.pluginToken) {
                setPluginToken(status.pluginToken);
            }

            chrome.storage.local.set({'currentList': currentList});

            if (infiniMode) {
                storeCreditsRemaining(1);  // hack for perpetual creditsRemaining
            } else {
                storeCreditsRemaining(status.creditsRemaining);
            }
            setBadge(badgeCount);
            if(onSuccess) {
                onSuccess();
            }
        },
        error: function (xhr, errorMessage, error) {
            if (xhr.status == 401 || xhr.status == 400) logout();
        }
    });

}

function storeCreditsRemaining(creditsRemaining) {
  chrome.storage.local.set({'creditsRemaining': creditsRemaining});

  chrome.tabs.query({}, function(tabs){
    for (var i = 0; i < tabs.length; i++) {
      chrome.tabs.sendMessage(tabs[i].id, {'creditsRemaining': creditsRemaining});
    }
  });
}

function queryCRM(query, callback) {
  $.get(pluginUrl + "/crm/searches?query=" + query)
    .success(function(data) {
      callback(data);
    })
    .error(function (xhr, errorMessage, error) {
      if (xhr.status == 401) {
        callback({error: {loggedOut: true}});
      } else if(xhr.status == 403 || xhr.status == 412) {
        callback({error: {noCRM: true}});
      } else if(xhr.status == 400) {
        callback({error: {crmError: true}});
      } else {
        callback({error: {other: true}});
      }
    });
}

/* * * * * * * * * *
 * EVENT HANDLERS  *
 * * * * * * * * * */

function setupGoogleLinkedinSearch(tabId, url) {
  debugLog("tabUpdatedComplete fired for google linkedin search");
  chrome.tabs.executeScript(tabId, {code: "var badgeCount = " + badgeCount});
  chrome.tabs.sendMessage(tabId, {tabUpdatedComplete: true});
}


chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if(changeInfo.status == "complete") {
    if (tab.url.match('^https?://www\.google\.com/.*site(%3A|:)[^+ ]*linkedin\.com')) {
      setupGoogleLinkedinSearch(tabId, tab.url);
    }

    if (loggedIn) {
        chrome.browserAction.setPopup({popup: 'search.html'});
    }
  } else if(changeInfo.status == "loading") {
    if( tab.url.match(/:\/\/(.[^/]+)/)[1] == "www.linkedin.com" ) {
      if (loggedIn) {
        $.post(pluginUrl+"/fetchables/incr");
      }
    }
  }
});


chrome.extension.onMessage.addListener(function (message, sender, sendResponse) {
   // alert("Inside event listener");
  if (message.loggedIn) {
    debugLog("loggedIn");
    debugLog(message);
    if(message.currentUserId != userId) {
      debugLog("logging out userId " + userId + " and logging in currentUserId " + message.currentUserId);
      logout();
    }
    if(message.pluginToken) {
      setPluginToken(message.pluginToken);
    }
    //alert("before login");
    login();
  } else if (message.loggedOut) {
    debugLog("loggedOut");
    debugLog(message);
    logout();
  } else if (message.setCurrentList) {
    currentList = message.listId;
    chrome.storage.local.set({'currentList': currentList});
  } else if (message.getServiceUrl) {
    sendResponse(serviceUrl);
  } else if (message.getAccountUrl) {
    sendResponse(accountsUrl);
  } else if (message.getPluginUrl) {
    sendResponse({url: pluginUrl, token: localStorage['plugin_token'], guid: localStorage["guid"]});
  } else if (message.getEnvironment) {
    sendResponse(environment);
  } else if (message.getLists) {
    sendResponse({lists: lists, teammateLists: teammateLists});
  } else if (message.getFeatures) {
    sendResponse(featureFlags);
  } else if (message.getInfiniMode) {
    sendResponse(infiniMode);
  } else if( message.getSalesforceResults) {
    queryCRM(message.query, sendResponse);
    return true;
  }
});

chrome.notifications.onClicked.addListener(function(notificationId) {
  callback = notificationOnClickedCallbacks[notificationId];
  if(callback && typeof(callback) === "function") {
    callback();
  }
});

chrome.notifications.onButtonClicked.addListener(function(notificationId, buttonIndex) {
  buttonCallbacks = notificationOnButtonClickedCallbacks[notificationId];
  if(buttonCallbacks && buttonCallbacks.length > 0) {
    callback = buttonCallbacks[buttonIndex];
    if(callback && typeof(callback) === "function") {
      callback(buttonIndex);
    }
  }
});

function errorHandler(e) {
    if (environment == 'development') console.log(e);
    chrome.extension.sendMessage({error: 'Something went wrong.'});
}

function setPluginToken(val) {
  debugLog("setPluginToken(" + val + ")");
  localStorage['plugin_token'] = val;
}

function initializePluginTokenFilter() {
  $.ajaxPrefilter(function( options ) {
    if(options.url.search(pluginUrl) == 0) {
      //this is a salesloft service request and needs our plugin token
      var originalBeforeSend = options.beforeSend;
      options.beforeSend = function (xhr) {
        if(originalBeforeSend) originalBeforeSend(xhr);
        xhr.setRequestHeader('X-Plugin-Token', localStorage['plugin_token']);
        xhr.setRequestHeader('X-Plugin-Guid', localStorage['guid']);
      }
    }
  });
}

function initializeGUID() {
  if(localStorage["guid"] == undefined) {
    localStorage["guid"] = generateGUID();
  }
}

function generateGUID() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
         s4() + '-' + s4() + s4() + s4();
}

/* Rapportive Integration */

var rapportive = null;

chrome.webRequest.onSendHeaders.addListener(
  function(details)
  {
    var origin = _.find(details.requestHeaders, { name: "X-Cross-Domain-Origin" });
    if (origin && origin.value == 'https://mail.google.com') { // this probably came from Rapportive
      var oauthToken = _.find(details.requestHeaders, {name: "oauth_token"});
      if (oauthToken) {
        rapportive = new Rapportive(oauthToken.value);
      }
    }
  },
  {urls: ["https://api.linkedin.com/v1/people/*"]},
  ['requestHeaders']
);

function Rapportive(oauthToken) {
  debugLog("New Rapportive", oauthToken);

  this.validEmail = function(email, callback) {
    if (!callback) { callback = function(){} };
    var url = 'https://api.linkedin.com/v1/people/email=' + email + ':(first-name,last-name,headline,location,distance,positions,twitter-accounts,im-accounts,phone-numbers,member-url-resources,picture-urls::(original),site-standard-profile-request,public-profile-url,relation-to-viewer:(connections:(person:(first-name,last-name,headline,site-standard-profile-request,picture-urls::(original)))))';
    $.ajax(url, {
      headers: {
        'oauth_token': oauthToken,
        'x-li-format': 'json',
        'X-Requested-With': 'IN.XDCall',
        'X-HTTP-Method-Override': 'GET'
      }
    }).done(function(data) {
      callback({ email: email, valid: true });
    }).fail(function(error) {
      if (error.status == 404) {
        callback({ email: email, valid: false });
      } else {
        var error = $.parseJSON(error.responseText);
        callback({ email: email, error: error.message });
      }
    });
  };
}

chrome.extension.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.validByRapportive) {
    if (rapportive) {
      rapportive.validEmail(message.email, sendResponse);
      return true;
    } else {
      sendResponse({ email: message.email, error: "Please log into Rapportive through GMail" });
    }
  }


});


