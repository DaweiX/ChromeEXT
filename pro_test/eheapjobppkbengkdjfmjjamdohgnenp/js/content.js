/**
 * Created by PUBLICIW on 05/01/15.
 */

this.ContentActions = {

    loadExtension: function(initialState) {
        chrome.runtime.sendMessage({ action: 'getView', params: ['extension.html'] }, function (html) {
            $('body').append(html);
            App.setReady();
        });
    },

    toggleExtensionOpenClose: function() {
        App.findCouponsByHost()
            .then(function() {
                if (App.animate.state === 'complete-closed') {
                    App.open('content');
                } else {
                    App.close();
                }
            })
            .fail(function() {
                window.open('http://www.meucupom.com');
            })
        ;
    },

    updateIcon: function(showBadge) {
        showBadge = showBadge || false;

        App.findCouponsByHost().then(function(data) {
            badge = showBadge ? data.coupons.length.toString() : "";
            iconActive = {
                "19": "icons/icon38-active.png",
                "38": "icons/icon76-active.png"
            };
            iconInactive = {
                "19": "icons/icon38-inactive.png",
                "38": "icons/icon76-inactive.png"
            };

            switch (data.resultType) {
                case "FOUND" :
                    chrome.runtime.sendMessage({
                        action: 'browserActionUpdateIcon',
                        params: [iconActive, "MeuCupom.com tem ofertas para este site!", badge]
                    });
                    break;

                case "FOUND_SIMILAR" :
                    chrome.runtime.sendMessage({
                        action: 'browserActionUpdateIcon',
                        params: [iconActive, "MeuCupom.com tem ofertas em sites semelhantes!", badge]
                    });
                    break;

                case 'FEATURED' :
                    chrome.runtime.sendMessage({
                        action: 'browserActionUpdateIcon',
                        params: [iconInactive, "Clique e veja as ofertas do dia no MeuCupom.com"]
                    });
                    break;
            }
        });
    },

    getAppAnimationState: function() {
        return App.animate.state;
    },

    login: function(user) {
        App.animate.loginModalOut(App.controllers.loginModal.$el);
        App.controllers.topBar.view.models.userLogged = true;
        App.controllers.topBar.view.models.user = user;

        App.controllers.Cashback.init();
    }

};
/**
 * Created by PUBLICIW on 05/01/15.
 */

chrome.runtime.onMessage.addListener(function(message, sender, success) {

    switch (message.action) {
        case 'toggleExtensionOpenClose' :
            ContentActions.toggleExtensionOpenClose();
            break;

        case 'updateIcon' :
            ContentActions.updateIcon(message.params[0]);
            break;

        case 'getAppAnimationState' :
            success(ContentActions.getAppAnimationState());
            break;

        case 'login' :
            ContentActions.login(message.params[0]);
            break;

    }

});
/**
 * Created by PUBLICIW on 05/01/15.
 */

ContentActions.loadExtension();

/*
function verificarAberturaAutomatica() {
    host = document.location.href;
    lista = [
        ['americanas.com.br/categoria/celulares-e-smartphones' , '5000'],
        ['submarino.com.br/categoria/games/','5000'],
        ['www.kabum.com.br/celular-telefone/smartphones','3000']
    ];
    tempo = lista.filter(function(i){
        return host.search(i[0]) > -1
    });
    return tempo[0][1];
}
*/

App.ready(function() {

    App.findCouponsByHost().then(function(data) {
        if (data.storeInfo == null) {
            data.storeInfo = { slug: null };
        }

        // Prevent to open the plugin if it was already closed for this store
        chrome.runtime.sendMessage({
            action: 'displayManager.isRecentlyClosed',
            params: [data.storeInfo.slug]
        }, function(isRecentlyClosed) {


                switch (data.resultType) {
                    case "FOUND" :

                        // Auto open list
                        if (window.name == 'meucupom-auto-open') {
                            window.name = null;
                            App.open('content');

                        } else {

                            // Auto open single
                            if (App.clickedStores.isOpenSingleOnNextVisit(data.storeInfo.slug)) {
                                var couponId = App.clickedStores.getStore(data.storeInfo.slug).clickedCouponId;
                                App.getCouponById(couponId, function (coupon) {
                                    App.open('single');
                                    App.controllers.singleCoupon.open(coupon);

                                    App.clickedStores.cleanOpenSingleOnNextVisit();
                                });
                            } else {

                                if (isRecentlyClosed) {
                                    App.close();
                                }
                                else {
                                    App.open('mini-tag');
                                    setTimeout(App.open, '10000','content');
                                }
                            }

                        }

                        break;

                    case "FOUND_SIMILAR" :

                        if (isRecentlyClosed) {
                            App.close();
                        } else {
                            App.open('mini-tag');
                        }
                        break;

                    case 'FEATURED' :
                        ContentActions.updateIcon(false);
                        break;
                }
        });
    });

});
