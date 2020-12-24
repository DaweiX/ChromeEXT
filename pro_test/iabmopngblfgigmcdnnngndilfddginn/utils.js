//---- double load protection
if (!window.scmph) window.scmph = {count:0}; if (typeof window.scmph["utils"] === "undefined") { window.scmph["utils"] = window.scmph['count']++;

function log(msg) {
  //console.log(msg);
}

jQuery.extend({
    debugParseUrl: function() {
        var match,
            pl     = /\+/g, // Regex for replacing addition symbol with a space
            search = /([^&=]+)=?([^&]*)/g,
            decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
            query  = window.location.search.substring(1);
            urlParams = {};

        while (match = search.exec(query))
           urlParams[decode(match[1])] = decode(match[2]);

        return urlParams;
    }
});

if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
      return args[number] !== undefined ? args[number]
                                        : match;
    });
  };
}

if (!String.prototype.numberWithCommas) {
  String.prototype.numberWithCommas = function() {
      return this.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}

// blacklist
function checkUrlForBlackListSites(url, blackListSites, complete) {
    var predicate = function(site) {
      return new RegExp(site).test(url);
    };

    if (complete === true) {
      return _.filter(blackListSites, predicate);
    } else {
      var s = _.find(blackListSites, predicate);
      return s ? [s] : [];
    }
}


// Google Analytics helpers
function gaTrackPageView() {
    chrome.runtime.sendMessage({method: "gaTrackPageView", args: arguments});
}

function gaSendEvent() {
    chrome.runtime.sendMessage({method: "gaSendEvent", args: arguments});
}

} //-- double load protection
