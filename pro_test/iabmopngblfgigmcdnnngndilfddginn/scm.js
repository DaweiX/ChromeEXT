//---- double load protection
if (!window.scmph) window.scmph = {count:0}; if (typeof window.scmph["scm"] === "undefined") { window.scmph["scm"] = window.scmph['count']++;

var Scm = (function() {

    function Scm(options) {
        this.optShowIcon = options.get('show-provider-icon');
        this.optShowLastCommitTime = options.get('show-provider-last-time-commit');
        this.optShowLastCommitTimeAsTitle = options.get('show-provider-last-time-commit-as-title');
        this.optShowExtendedStatus = options.get('show-provider-extended-status');

        this.blackListSites = options.get('blacklist-sites');
    }

    Scm.prototype.isBlacklistSite = function() {
        return checkUrlForBlackListSites(window.location.href, this.blackListSites, false).length > 0;
    }

    Scm.prototype.highlightAll = function() {
        if (this.isBlacklistSite()) {
            this._updateBadgeBanned();
            return;
        }

        var lastTotal = -1;
        var total = 0;
        var self = this;

        var processedLinks = {};
        $('a').each(function() {
            var url = $(this).attr('href');
            // don't process the same url twice
            if (url in processedLinks) return;
            processedLinks[url] = true;

            // is is scm provider?
            var res = url && self.matchScm(url);
            if (!res) return; // no
            self.highlighScm(res);

            // update icon badge every 50 links
            if (++total % 50 == 0) {
                self._updateBadge(total);
                lastTotal = total;
            }
        });

        if (total > 0 && lastTotal != total) {
            self._updateBadge(total);
        }
    }

    Scm.prototype.matchScm = function(url) {
        for (var pid in SCM_PROVIDERS) {
            var p = SCM_PROVIDERS[pid];
            for (var i = 0; i < p.rx_urls.length; i++) {
                var res = url.match(p.rx_urls[i]);
                if (res) {
                    return {
                        id: pid,
                        provider: p,
                        url: url,
                        results: res.slice(1)};
                }
            }
        }
        return null;
    }


    Scm.prototype.highlighScm = function(res) {
        var self = this;

        var project_url = res.provider.project_url.format.apply(res.provider.project_url, res.results);

        chrome.runtime.sendMessage({method: "checkScm", id: res.id, url: project_url}, function(response) {
            var anchor = $("a[href='" + res.url + "'")
            if (!anchor || $(anchor).data('scm-processed') === true) {
                return;
            }
            $(anchor).data('scm-processed', true);

            var t =  response.lastCommitTime ? moment(response.lastCommitTime, res.provider.momento_format).fromNow() : 'n/a';

            if (self.optShowIcon || self.optShowLastCommitTime) {
                var issueIcon = '<svg aria-hidden="true" class="icon" height="14" version="1.1" viewBox="0 0 14 16" width="16"><path fill-rule="evenodd" d="M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"></path></svg>';

                var context = {
                    provider_name: response.id,
                    provider_id: self.optShowIcon ? 'scm-icon ' + response.id : '',
                    time: self.optShowLastCommitTime ? t : '',
                }

                var popup = '';
                if (self.optShowExtendedStatus && _.has(response, 'extraInfo') && response.extraInfo) {
                    var ei = response.extraInfo;
                    var potentialPopup = "<div class='scm-popup'>"+
                            // "<i><span class='scm-icon {provider_name}'></span>{provider_name}</i>"+
                            "<b>{time}</b>"+
                            "<hr/>"+
                            "<ul>";

                    var totalStats = 0;
                    Object.keys(ei).forEach(function(key) {
                        if (ei[key]) {
                            totalStats++;
                            ei[key] = ei[key].numberWithCommas();
                            potentialPopup += "<li><div class='"+ key + "'>" + key + ":</div> {" + key + "}</li>";
                        }
                    });

                    potentialPopup += "</ul>"+
                                    "</div>";
                    if (totalStats > 0) {
                        popup = potentialPopup;
                        context = Object.assign(context, ei);
                    }
                }

                $(anchor).after($.nano("<span class='scm-info'>"+
                                       "<span class='{provider_id}'>" + popup + "</span>" +
                                       "{time}" +
                                       "</span>", context));
            }

            if (self.optShowLastCommitTimeAsTitle) {
                $(anchor).attr('title', t);
            }
        });
    }

    Scm.prototype._updateBadge = function(total) {
        var text = total < 1000 ? "" + total : "999+";
        chrome.runtime.sendMessage({method: "updateBadge", text: text});
    }

    Scm.prototype._updateBadgeBanned = function() {
        chrome.runtime.sendMessage({method: "updateBadgeBanned"});
    }

    return Scm;
})();

} //-- double load protection
