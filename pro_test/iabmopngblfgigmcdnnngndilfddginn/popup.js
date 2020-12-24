//---- double load protection
if (!window.scmph) window.scmph = {count:0}; if (typeof window.scmph["popup"] === "undefined") { window.scmph["popup"] = window.scmph['count']++;

function updateAddIconsVisibility(context) {
    $('#add-domain, #add-current').show();
    var sites = _.sortBy(context.sites, function(s) { return s; });
    _.each(sites, function(site) {
        if (context.hostname == site) {
            $('#add-domain').hide();
        } else if (context.url == site) {
            $('#add-current').hide();
        }
    });
}

function generateRemoveLinks(sites) {
    $('#actions li.remove').remove();
    _.each(sites, function(site) {
        $('#actions').append($.nano("<li class='remove' data-site='{site_url}'><i></i>Remove {site}</li>", {
            site_url: site,
            site: site.substr(0, 50)
        }));
    });
}

function setupPage(response) {
    generateRemoveLinks(response.sites);

    updateAddIconsVisibility(response);

    $('#add-domain, #add-current').click(function() {
        var self = this;
        var sites = {'add-domain': response.hostname, 'add-current': response.url}[$(this).attr('id')];
        if (!sites) return;

        chrome.runtime.sendMessage({method: 'addBlackListSites', sites: [sites]}, function(response) {
            updateAddIconsVisibility(response);
            generateRemoveLinks(checkUrlForBlackListSites(response.url, response.sites, true));
            chrome.runtime.sendMessage({method: 'updateBadgeBanned', reload: true});
        });
    });

    $('#actions').on('click', 'li.remove', function() {
        chrome.runtime.sendMessage({method: 'removeBlackListSites', sites:[$(this).data('site')]}, function(response) {
            updateAddIconsVisibility(response);
            generateRemoveLinks(checkUrlForBlackListSites(response.url, response.sites, true));
            chrome.runtime.sendMessage({method: 'clearBadgeBanned', reload: true});
        }); 
    });

    $('#settings').click(function() {
        chrome.tabs.create({ url: 'chrome-extension://' + chrome.runtime.id + '/options.html' });
    });
}


$(function() {
    chrome.runtime.sendMessage({method: "activeTabUrl"}, function(response) {
        _.defer(function() { setupPage(response); });
    });
});

} //-- double load protection
