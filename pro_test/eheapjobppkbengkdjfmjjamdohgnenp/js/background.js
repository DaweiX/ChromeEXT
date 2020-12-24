/**
 * Created by PUBLICIW on 05/01/15.
 */

this.BackgroundActions = {

    browserActionUpdateIcon: function (icon, title, badge) {
        badge = badge || "";

        chrome.browserAction.setIcon({ path: icon });
        chrome.browserAction.setTitle({ title: title });
        chrome.browserAction.setBadgeText({ text: badge });
    },

    getView: function(view, success) {
        $.get(chrome.extension.getURL('views/' + view), success);
    },

    getResourceUrl: function(resource, success) {
        success(chrome.extension.getURL(resource));
    },

    reactiveTab: function(openerTabId) {
        chrome.tabs.update(openerTabId, { active: true });
    },


    /* NEXT URL DOMAIN */
    nextUrlDomainSet: function(domain) {
        localStorage.setItem('next-url-domain', domain);
    },

    nextUrlDomainGet: function() {
        return localStorage.getItem('next-url-domain');
    }

};
/**
 * Created by admin on 8/6/15.
 */

(function() {

    var store = new Store('auth');

    this.BackgroundActions.auth = {

        isLoginDismissed : function() {
            return store.get('mcLoginDismissed') || store.get('mcLogged');
        },

        isUserLogged: function() {
            return store.get('mcLogged');
        },

        getUser: function() {
            return store.get('user');
        },

        dismissLoginModal: function() {
            store.set('mcLoginDismissed', true);
        },

        loginAction: function(user) {
            store.set('user', user);
            store.set('mcLogged', true);

            chrome.tabs.query({}, function(tabs) {
                tabs.forEach(function(tab) {
                    chrome.tabs.sendMessage(tab.id, { action: 'login', params: [user] });
                });
            });
        },

        logoutAction: function() {
            store.remove('mcLogged');
            store.remove('mcLoginDismissed');
            store.remove('user');
        }

    };

})();
/**
 * Created by PUBLICIW on 13/01/15.
 */

(function() {

    var store = new Store('clicked-stores');
    store.removeAll();
    store.set('all', []);

    this.BackgroundActions.clickedStores = {
        setIsClicked: function(storeSlug, openSingleOnNextVisit, clickedCouponId, expiresIn) {
            openSingleOnNextVisit = openSingleOnNextVisit || false;
            expiresIn = expiresIn || 6;

            var now = new Date();
            var expiresOn = new Date(now.getUTCFullYear(), now.getMonth(), now.getDate(), now.getHours() + expiresIn, now.getMinutes());

            var clickedStoresRaw = store.get('all');
            var newItem = {
                value: storeSlug,
                expires: expiresOn,
                openSingleOnNextVisit: openSingleOnNextVisit,
                clickedCouponId: clickedCouponId
            };

            newItem.expires.setHours(newItem.expires.getHours());
            clickedStoresRaw.push(newItem);

            store.set('all', clickedStoresRaw);
        },

        getAllClickedStores: function() {
            var clickedStoresRaw = store.get('all');
            var clickedStores = [];

            clickedStoresRaw.map(function(item) {
                if (new Date(item.expires) > new Date()) {
                    clickedStores.push(item);
                }
            });

            return clickedStores;
        },

        cleanOpenSingleOnNextVisit: function() {
            var clickedStores = store.get('all');
            clickedStores.map(function(clickedStore) {
                clickedStore.openSingleOnNextVisit = false;
            });
            store.set('all', clickedStores);
        }
    };

})();
/**
 * Created by admin on 8/6/15.
 */

(function() {

    var store = new Store('plugin-display-manager');

    this.BackgroundActions.displayManager = {
        preventOpen: function(slug) {
            var value = {
                until: new Date()
            };
            value.until.setHours(value.until.getHours() + 12);
            store.set(slug, value);
        },

        isRecentlyClosed: function(slug) {
            var obj = store.get(slug);

            return (obj && new Date(obj.until) > new Date());
        }

    };

})();
/**
 * Created by PUBLICIW on 13/01/15.
 */

(function() {

    var store = new Store('read-messages');
    if (store.get('all') == null) {
        store.set('all', []);
    }

    this.BackgroundActions.readMessages = {
        setIsRead: function(messageId, expires) {
            var readMessagesRaw = store.get('all');

            // maintenance list
            readMessagesRaw = readMessagesRaw.filter(function(item) {
                if (item.messageId != messageId) {
                    return item;
                }
            });

            var newItem = {
                messageId: messageId,
                expires: expires || 'never'
            };
            readMessagesRaw.push(newItem);

            store.set('all', readMessagesRaw);
        },

        getAllReadMessages: function() {
            var readMessagesRaw = store.get('all');
            var readMessages = [];

            readMessagesRaw.map(function(item) {
                if (item.expires == 'never' || new Date(item.expires) > new Date()) {
                    readMessages.push(item.messageId);
                }
            });

            return readMessages;
        }
    };

})();
/**
 * Created by PUBLICIW on 05/01/15.
 */

chrome.runtime.onMessage.addListener(function(message, sender, success) {

    switch (message.action) {
        case 'browserActionUpdateIcon' :
            BackgroundActions.browserActionUpdateIcon(message.params[0], message.params[1], message.params[2]);
            break;

        case 'getView' :
            BackgroundActions.getView(message.params[0], success);
            break;

        case 'getResourceUrl' :
            BackgroundActions.getResourceUrl(message.params[0], success);
            break;

        case 'reactiveTab' :
            BackgroundActions.reactiveTab(sender.tab.openerTabId);
            break;

        case 'clickedStores.setIsClicked' :
            BackgroundActions.clickedStores.setIsClicked(message.params[0], message.params[1], message.params[2], message.params[3]);
            break;

        case 'clickedStores.getAllClickedStores' :
            success(BackgroundActions.clickedStores.getAllClickedStores());
            break;

        case 'clickedStores.cleanOpenSingleOnNextVisit' :
            success(BackgroundActions.clickedStores.cleanOpenSingleOnNextVisit());
            break;

        case 'readMessages.setIsRead' :
            BackgroundActions.readMessages.setIsRead(message.params[0], message.params[1]);
            break;

        case 'readMessages.getAllReadMessages' :
            success(BackgroundActions.readMessages.getAllReadMessages());
            break;

        case 'displayManager.preventOpen' :
            success(BackgroundActions.displayManager.preventOpen(message.params[0]));
            break;

        case 'displayManager.isRecentlyClosed' :
            success(BackgroundActions.displayManager.isRecentlyClosed(message.params[0]));
            break;

        case 'auth.isLoginDismissed' :
            success(BackgroundActions.auth.isLoginDismissed());
            break;

        case 'auth.dismissLoginModal' :
            success(BackgroundActions.auth.dismissLoginModal());
            break;

        case 'auth.loginAction' :
            success(BackgroundActions.auth.loginAction(message.params[0]));
            break;

        case 'auth.logoutAction' :
            success(BackgroundActions.auth.logoutAction());
            break;

        case 'auth.isUserLogged' :
            success(BackgroundActions.auth.isUserLogged());
            break;

        case 'auth.getUser' :
            success(BackgroundActions.auth.getUser());
            break;

        case 'nextUrlDomain.get' :
            success(BackgroundActions.nextUrlDomainGet());
            break;

        case 'nextUrlDomain.set' :
            BackgroundActions.nextUrlDomainSet(message.params[0]);
            break;
    }

    return true;

});

chrome.runtime.onMessageExternal.addListener(function(message, sender, success) {
    switch (message.action) {
        case 'isItInstalled' :
            success(true);
            break;

        case 'auth.loginAction' :
            success(BackgroundActions.auth.loginAction(message.params[0]));
            break;
    }

    return true;
});

// Toggle the extension open or close. Prevent the double-click.
(function() {
    var isEnabled = true;
    chrome.browserAction.onClicked.addListener(function (tab) {
        if (isEnabled) {
            chrome.tabs.sendMessage(tab.id, {
                action: 'toggleExtensionOpenClose'
            });
            isEnabled = false;
        }

        setTimeout(function() {
            isEnabled = true;
        }, 1000);
    });
})();

// Update the browserAction's icon
chrome.tabs.onActivated.addListener(function(activeInfo) {

    chrome.tabs.sendMessage(activeInfo.tabId, {
        action: 'getAppAnimationState'
    }, function(state) {

        chrome.tabs.sendMessage(activeInfo.tabId, {
            action: 'updateIcon',
            params: [state == 'complete-closed']
        });

    });
});
/**
 * Created by PUBLICIW on 05/01/15.
 */

