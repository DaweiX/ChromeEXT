//---- double load protection
if (!window.scmph) window.scmph = {count:0}; if (typeof window.scmph["options"] === "undefined") { window.scmph["options"] = window.scmph['count']++;

var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

var OptionsManager = (function() {

    function OptionsManager(storage) {
        this.localStorage = storage ? storage : localStorage;
    }

    OptionsManager.prototype.setDefault = function(key, def) {
        if (this.isDef(key)) return false;

        this.set(key, def);
        return true;
    }

    OptionsManager.prototype.set = function(key, value) {
        this.localStorage[key] = value;
    }

    OptionsManager.prototype.get = function(key) {
        return this._parse(this.localStorage[key]);
    }

    OptionsManager.prototype.isDef = function(key) {
        return (typeof this.localStorage[key] !== "undefined");
    }

    OptionsManager.prototype.isUndef = function(key) {
        return !this.isDef(key);
    }

    OptionsManager.prototype._parse = function(value) {
        if (typeof value == "string") {
            try {
                return JSON.parse(value);
            } catch(ex) {
                return value;
            }
        }
        return value;
    }

    return OptionsManager;
})();

var Options = (function(_super) {

    __extends(Options, _super);

    function Options(localStorage) {
        Options.__super__.constructor.apply(this, arguments);
    }

    Options.prototype.initDefaults = function() {

        this.setDefault('checker-mode', true);
        this.setDefault('refresh-interval', 24 * 60 * 60);
        this.setDefault('show-provider-icon', true);
        this.setDefault('show-provider-last-time-commit', true);
        this.setDefault('show-provider-last-time-commit-as-title', true);
        this.setDefault('show-provider-extended-status', true);

        this.setDefault('blacklist-sites', '["github.com"]');
    }


    // Saves options
    Options.prototype.save = function () {

        this.set('checker-mode', $('#checker-mode').is(':checked'));
        this.set('show-provider-icon', $('#show-provider-icon').is(':checked'));
        this.set('show-provider-last-time-commit', $('#show-provider-last-time-commit').is(':checked'));
        this.set('show-provider-last-time-commit-as-title', $('#show-provider-last-time-commit-as-title').is(':checked'));
        this.set('show-provider-extended-status', $('#show-provider-extended-status').is(':checked'));
        this.set('refresh-interval', $('#refresh-interval').val());

        this.set('blacklist-sites', JSON.stringify(this._cleanRawSites($('#blacklist-sites').val())));

        $('#show-provider-icon, #show-provider-last-time-commit, #show-provider-last-time-commit-as-title, #show-provider-extended-status, #refresh-interval, #blacklist-sites').prop('disabled', !this.get('checker-mode'));
    }

    Options.prototype._cleanRawSites = function (sites) {
        return _.chain(sites.split('\n'))
                .map(function(site) { return site.trim(); })
                .compact()
                .value();
    }

    // Restores select box state to saved value from localStorage.
    Options.prototype.load = function () {
        this.initDefaults();
        $('#checker-mode').prop('checked', this.get('checker-mode'));
        $('#show-provider-icon').prop('checked', this.get('show-provider-icon'));
        $('#show-provider-last-time-commit').prop('checked', this.get('show-provider-last-time-commit'));
        $('#show-provider-last-time-commit-as-title').prop('checked', this.get('show-provider-last-time-commit-as-title'));
        $('#show-provider-extended-status').prop('checked', this.get('show-provider-extended-status'));
        $('#blacklist-sites').val(this.get('blacklist-sites').join('\n'));
        $('#refresh-interval').val(this.get('refresh-interval'));

        $('#show-provider-icon, #show-provider-last-time-commit, #show-provider-last-time-commit-as-title, #show-provider-extended-status, #refresh-interval, #blacklist-sites').prop('disabled', !this.get('checker-mode'));
    }

    Options.prototype.addBlackListSites = function (sites) {
        var newBlackList = _.union(this.get('blacklist-sites'), _.map(sites, function(site) { return site.trim(); }));
        this.set('blacklist-sites', JSON.stringify(newBlackList));

        _.defer(function() {
            _.each(newBlackList, function(site) {
                gaSendEvent('blacklist-sites', 'added', site, 1);
            });
        });
        return newBlackList;
    }

    Options.prototype.removeBlackListSites = function (sites) {
        var newBlackList = _.difference(this.get('blacklist-sites'), _.map(sites, function(site) { return site.trim(); }));
        this.set('blacklist-sites', JSON.stringify(newBlackList));
        return newBlackList;
    }

    return Options;

})(OptionsManager);

function loadOptions(callback) {
    chrome.runtime.sendMessage({method: "loadOptions"}, function(response) {
        callback(response.options);
    });
}

function saveOptions(options) {
    chrome.runtime.sendMessage({method: "saveOptions", options: options}, function(response) {});
}

} //-- double load protection
