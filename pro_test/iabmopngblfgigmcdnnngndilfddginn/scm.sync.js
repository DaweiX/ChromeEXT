var ScmSync = (function() {

    ScmSync.const = ScmSync.prototype;

    ScmSync.const.REFRESH_INTERVAL_IN_SECONDS = 24 * /* hours */
                                                60 * /* mins */
                                                60   /* seconds */; // update one time per 24 hours

    function ScmSync(options) {
        ScmSync.const.REFRESH_INTERVAL_IN_SECONDS = options.get('refresh-interval');
    }

    ScmSync.prototype.checkScm = function (request, callback) {
        this.checkProjectStatus(request, function(data) {
            callback({
                id: data.id,
                url: data.url,
                status: data.status,
                extraInfo: data.extraInfo,
                lastCommitTime: data.lastCommitTime
            });
        });
    }

    ScmSync.prototype.isProjectStatusExpired = function(url) {
        if (typeof localStorage[url] === 'undefined') // first time
            return true;

        var status = JSON.parse(localStorage[url]);
        var nowInSeconds = Math.floor(new Date().getTime() / 1000);
        return ((nowInSeconds - status["sync-time"]) > ScmSync.const.REFRESH_INTERVAL_IN_SECONDS);
    }


    ScmSync.prototype.checkProjectStatus = function(res, callback) {
        var p = SCM_PROVIDERS[res.id];

        if (this.isProjectStatusExpired(res.url)) {
            $.ajax({
                url: res.url,
                type: 'get',
                dataType: 'html',
                async: true})
            .error(function()  {
                localStorage[res.url] = JSON.stringify({
                    'sync-time': Math.floor(Date.now() / 1000),
                    'status': ''
                });
            })
            .done(function(data, status, jqXHR) {
                if (jqXHR.readyState != 4) {
                    return;
                }

                var html = $($.parseHTML(data));
                var lastCommitTime = p.last_commit_time_handler(html);
                var extraInfo = p.extra_info_handler(html);
                if (extraInfo) {
                    console.log("extraInfo=", extraInfo);
                } else {
                    extraInfo = ''
                }

                localStorage[res.url] = JSON.stringify({
                    'sync-time': Math.floor(Date.now() / 1000),
                    'status': lastCommitTime,
                    'extraInfo': extraInfo
                });

                callback({
                    id: res.id,
                    status: 'OK',
                    lastCommitTime: lastCommitTime,
                    extraInfo: extraInfo
                });
            });

        } else {
            var status = JSON.parse(localStorage[res.url]);
            callback({
                id: res.id,
                status: 'OK',
                lastCommitTime: status['status'],
                extraInfo: status['extraInfo']
            });
        }
    }

    return ScmSync;

})();
