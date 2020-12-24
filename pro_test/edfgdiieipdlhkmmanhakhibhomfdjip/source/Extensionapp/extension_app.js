
// config([
//     '$compileProvider',
//     function( $compileProvider )
//     {
//         $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
//         // Angular before v1.2 uses $compileProvider.urlSanitizationWhitelist(...)
//     }
// ])
(function()
{
    'use strict';
    angular.module('clodura_extension').controller('ExtensionAppCtrl', ExtensionAppCtrl);
    function ExtensionAppCtrl($scope,$location,$http,$rootScope)
    {
        $rootScope.company_data = {};
        $scope.person_data = [];
        $scope.search_word = '';
        $rootScope.no_company_data = false;
        $scope.total_person_count = 0;
        $rootScope.loader_flag = false;
        $rootScope.click_settings = false;
        $rootScope.check = 'NO';
        $scope.company_list = null;
        $scope.listurls = false;
        $scope.search_flag = false;
        $scope.go_back_flag = false;
        $scope.copy_comp_list =[];
        $scope.singleurl = false;
        $scope.copy_comp_list1 = null;

        $scope.init = function () {
            // === Populate the List Selector ===

            chrome.storage.local.get("user", function (obj) {
                if (obj.user !== undefined){
                    // chrome.storage.local.set({"visited_value":0});
                    let name = obj.user.split(":");
                    let name_sep = name[0].split(" ");
                    $rootScope.username = name[0];
                    $rootScope.initials = name_sep[0].slice(0, 1).toUpperCase()+name_sep[1].slice(0,1).toUpperCase();
                    $rootScope.loggedin = true;
                    $rootScope.customer_id = name[3];
                    $rootScope.current_credits = name[1];
                    $rootScope.phone_credits = name[4];
                    $rootScope.user_id = name[2];
                    if(name[5] === 'true') {
                        $rootScope.trial_user = true;
                    }
                    else{
                        $rootScope.trial_user = false;
                    }
                    $rootScope.click_settings = false;
                    $scope.checkAll('');
                    $rootScope.company_page_data('init');
                }
                else if (obj.user === undefined) {
                    $rootScope.loggedin= false;
                    $location.path("/ext_login");
                }
            });
        };

        // $scope.get_checkbox_data = function(){
        //     $http({
        //         method: 'GET',
        //         url: consts.linkedin_url + "extension/get_checkbox_value"+"/"+$rootScope.user_id,
        //         // data: {'user_id': $rootScope.user_id, 'website': parenturl,
        //         //     'customer_id':$rootScope.customer_id},
        //         headers: {'Content-Type': 'application/json'}
        //     })
        //         .then(function (details) {
        //            console.log("dddd",details)
        //
        //             if(details.data == "1") {
        //                 $rootScope.check = true;
        //             }
        //             else{
        //                 $rootScope.check = false;
        //
        //             }
        //         });
        // };

        $scope.logout = function () {
            chrome.storage.local.remove("user", function (result) {
                // console.log("remove");
            });
            chrome.storage.local.remove("settings", function (result) {
                // console.log("remove",result);
            });
            // document.body.remove("clodura-icon-dragid");
            $rootScope.loggedin = false;
            $location.path("/ext_login");

            // $rootScope.is_comp_page = false;
        };

        $rootScope.company_page_data = function (flag) {
                let params = (new URL(document.location)).searchParams;
            // chrome.storage.local.get("web_url", function (webb_url) {
            //     console.log("getttttttt",getUrl)
                // let parenturl = getUrl.getElementById("clodura_iframe").src;
                let parenturl ='';
                if(window.location.href.includes("linkedin.com")){
                    // aasasa chrome-extension://bijgcinifnejngfocnoencckkmkpbjkk/source/extension_index.html?parenturl=https://www.linkedin.com/company/talal-abu-ghazaleh-organization/#!/
                    parenturl = window.location.href;
                    parenturl = parenturl.split("parenturl=")[1].replace("#!/","");
                }
                else{
                    parenturl = params.get("parenturl");
                }

                $rootScope.click_settings = false;
                $rootScope.loader_flag = true;
                if ($scope.copy_comp_list.length > 0) {
                    $location.path("/ext_company");
                    $scope.company_list = $scope.copy_comp_list;
                    $scope.listurls = true;
                    $scope.comp_data_len = 2;
                    $rootScope.loader_flag = false;
                    // $rootScope.company_data.website = parenturl;
                    // $rootScope.no_company_data = true;
                    chrome.runtime.sendMessage({
                        path: {
                            "128": "/img/logo-c-blue.png",
                            "48": "/img/logo-c-blue.png",
                            "69": "/img/logo-c-blue.png"
                        }
                    });

                } else {
                    chrome.storage.local.get("toggleflag", function (obj) {
                        if (parenturl !== undefined && (parenturl.indexOf("google.com/search") === -1) && (parenturl.indexOf("linkedin.com/feed/") === -1)) {
                            $rootScope.current_url = parenturl;
                            $http({
                                method: 'POST',
                                url: consts.linkedin_url + "extension/get_comp_page_data",
                                data: {
                                    'user_id': $rootScope.user_id, 'website': parenturl,
                                    'customer_id': $rootScope.customer_id, 'toggleflag': obj.toggleflag
                                },
                                headers: {'Content-Type': 'application/json'}
                            })
                                .then(function (details) {
                                    $rootScope.loader_flag = false;
                                    $rootScope.current_credits = details.data.credits_count;
                                    if ($rootScope.loggedin) {
                                        if (typeof (details.data.result) === 'object' && details.data.result.length > 1) {
                                            if (details.data.result !== 'no_data') {
                                                // $location.path("/ext_company");
                                                $scope.comp_data_len = details.data.result.length;
                                                $scope.company_list = details.data.result;
                                                $scope.copy_comp_list = $scope.company_list;
                                                $scope.listurls = true;
                                                $rootScope.company_data.website = parenturl;
                                                $rootScope.no_company_data = true;
                                                // $scope.company_data.company_name = Object.keys(details.data[0])[0];
                                                $rootScope.company_data.company_name = "List of Companies";
                                                chrome.runtime.sendMessage({
                                                    path: {
                                                        "128": "/img/logo-c-blue.png",
                                                        "48": "/img/logo-c-blue.png",
                                                        "69": "/img/logo-c-blue.png"
                                                    }
                                                });
                                                chrome.runtime.sendMessage({title: "Company found"});
                                            } else {
                                                $rootScope.no_company_data = false;
                                                // chrome.browserAction.setBadgeText({text: " "});
                                                // chrome.runtime.sendMessage({color:"#A83636"});
                                                chrome.runtime.sendMessage({
                                                    path: {
                                                        "128": "/img/logo-c-grey.png",
                                                        "48": "/img/logo-c-grey.png",
                                                        "64": "/img/logo-c-grey.png"
                                                    }
                                                });
                                                chrome.runtime.sendMessage({title: "Company not found"});
                                            }
                                        } else if (typeof (details.data) === 'object') {
                                            if (details.data.data === 'c_data_found') {
                                                // $location.path("/ext_company");
                                                $rootScope.company_data = details.data.result;
                                                $scope.copy_comp_list1 = details.data;
                                                $rootScope.comp_id = details.data.result['company_id'];
                                                $rootScope.comp_website = details.data.result.website;
                                                $rootScope.company_data.website = details.data.result.website;
                                                $scope.comp_data_len = 1;
                                                $scope.person_data = details.data.result['person_data'];
                                                $scope.total_person_count = details.data.result['persons_count'];
                                                $rootScope.no_company_data = true;
                                                chrome.runtime.sendMessage({
                                                    path: {
                                                        "128": "/img/logo-c-blue.png",
                                                        "48": "/img/logo-c-blue.png",
                                                        "69": "/img/logo-c-blue.png"
                                                    }
                                                });
                                                chrome.runtime.sendMessage({title: "Company found"});
                                                // chrome.browserAction.setBadgeText({text: "1"});
                                                // chrome.browserAction.setIcon({path:{"128": "/img/logo-c-green.png",
                                                //         "50": "/img/logo-c-green.png",
                                                //         "48": "/img/logo-c-green.png"}});
                                                // chrome.browserAction.setTitle({title:"Company Found"})
                                                // chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                                                //     chrome.tabs.sendMessage(tabs[0].id, "notify_icon_check");
                                                // });
                                            } else if (details.data.result == "data_found") {
                                                // $location.path("/ext_company");
                                                $rootScope.comp_id = details.data.data['company_id'];
                                                $rootScope.comp_website = details.data.data['website'];
                                                $rootScope.company_data.website = details.data.data.website;
                                                $rootScope.no_company_data = true;
                                                $scope.listurls = false;
                                                $scope.singleurl = true;
                                                chrome.runtime.sendMessage({
                                                    path: {
                                                        "128": "/img/logo-c-blue.png",
                                                        "48": "/img/logo-c-blue.png",
                                                        "69": "/img/logo-c-blue.png"
                                                    }
                                                });
                                                chrome.runtime.sendMessage({title: "Company found"});
                                                // chrome.browserAction.setBadgeText({text: "1"});
                                                // chrome.browserAction.setIcon({path:{"128": "/img/logo-c-green.png",
                                                //         "50": "/img/logo-c-green.png",
                                                //         "48": "/img/logo-c-green.png"}});
                                                // chrome.browserAction.setTitle({title:"Company Found"})
                                                // chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                                                //     chrome.tabs.sendMessage(tabs[0].id, "notify_icon_check");
                                                // });
                                            } else {
                                                $rootScope.no_company_data = false;
                                                $scope.listurls = false;
                                                $scope.singleurl = false;
                                                // chrome.browserAction.setBadgeText({text:" "});
                                                // chrome.runtime.sendMessage({color:"#A83636"});
                                                chrome.runtime.sendMessage({
                                                    path: {
                                                        "128": "/img/logo-c-grey.png",
                                                        "48": "/img/logo-c-grey.png",
                                                        "69": "/img/logo-c-grey.png"
                                                    }
                                                });
                                                chrome.runtime.sendMessage({title: "Company not found"});
                                                // chrome.browserAction.setBadgeText({text: "0"});7E191B
                                                // chrome.browserAction.setIcon({path:{"128": "/img/logo-c-blue.png",
                                                //         "50": "/img/logo-c-green.png",
                                                //         "48": "/img/logo-c-green.png"}});
                                                // chrome.browserAction.setTitle({title:"Company not Found"})
                                                // chrome.browserAction.setIcon({path:chrome.extension.getURL('/img/c-logo.png')});
                                                // chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                                                //     chrome.tabs.sendMessage(tabs[0].id, "notify_icon_cross");
                                                // });
                                            }
                                        }

                                        if (flag !== 'login') {
                                            $location.path("/ext_company");
                                        }
                                    } else {
                                        $location.path("/ext_login");
                                    }
                                }, function (err) {
                                    if ($rootScope.loggedin) {
                                        // $location.path("/ext_company");
                                        $rootScope.company_data = {};
                                        $scope.person_data = [];
                                        $scope.total_person_count = 0;
                                        $rootScope.loader_flag = false;
                                        $rootScope.no_company_data = false;
                                        // chrome.runtime.sendMessage({badgeText: " "});
                                        // chrome.browserAction.setBadgeText({text:" "});
                                        // chrome.runtime.sendMessage({color:"#A83636"});
                                        chrome.runtime.sendMessage({
                                            path: {
                                                "128": "/img/logo-c-grey.png",
                                                "48": "/img/logo-c-grey.png",
                                                "69": "/img/logo-c-grey.png"
                                            }
                                        });
                                        chrome.runtime.sendMessage({title: "Company not found"});
                                        // chrome.browserAction.setIcon({path:{"128": "/img/logo-c-blue.png",
                                        //         "50": "/img/logo-c-green.png",
                                        //         "48": "/img/logo-c-green.png"}});
                                        // chrome.browserAction.setTitle({title:"Company not Found"})
                                        // chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                                        //     chrome.tabs.sendMessage(tabs[0].id, "notify_icon_cross");
                                        // });
                                        if (flag !== 'login') {
                                            $location.path("/ext_company");
                                        }
                                    } else {
                                        $location.path("/ext_login");
                                    }
                                });
                        } else {
                            if ($rootScope.loggedin) {
                                $rootScope.company_data = {};
                                $scope.person_data = [];
                                $scope.total_person_count = 0;
                                $rootScope.loader_flag = false;
                                $rootScope.no_company_data = false;
                                // chrome.browserAction.setBadgeText({text:" "});
                                // chrome.runtime.sendMessage({color:"#A83636"});
                                // chrome.runtime.sendMessage({badgeText: " "});
                                chrome.runtime.sendMessage({
                                    path: {
                                        "128": "/img/logo-c-grey.png",
                                        "48": "/img/logo-c-grey.png",
                                        "69": "/img/logo-c-grey.png"
                                    }
                                });
                                chrome.runtime.sendMessage({title: "Company not found"});
                                // chrome.browserAction.setBadgeText({text: "0"});
                                // chrome.browserAction.setIcon({path:{"128": "/img/logo-c-blue.png",
                                //         "50": "/img/logo-c-green.png",
                                //         "48": "/img/logo-c-green.png"}});
                                // chrome.browserAction.setTitle({title:"Company not Found"})
                                // chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                                //     chrome.tabs.sendMessage(tabs[0].id, "notify_icon_cross");
                                // });
                                if (flag !== 'login') {
                                    $location.path("/ext_company");
                                }
                            } else {
                                $location.path("/ext_login");
                            }
                        }
                    });
                }
            // });
        };

        chrome.runtime.onMessage.addListener(
            function(request, sender, sendResponse) {
                // if(request ==='url_change'){
                //     // $rootScope.company_page_data();
                // }

                if (request==='window_open'){
                    if($scope.listurls === false) {
                        if(sender.tab.url.includes("linkedin.com/company") || sender.tab.url.includes("linkedin.com/sales/company")) {
                            if($scope.no_company_data === false || sender.tab.url.includes("/sales/search/")){
                                $rootScope.company_data = {};
                                $scope.person_data = [];
                                $scope.total_person_count = 0;
                                $rootScope.loader_flag = false;
                                $rootScope.no_company_data = false;
                                // chrome.runtime.sendMessage({badgeText: "0"});
                                // chrome.browserAction.setBadgeText({text:" "});
                                // chrome.runtime.sendMessage({color:"#A83636"});
                                chrome.runtime.sendMessage({path :{"128": "/img/logo-c-grey.png",
                                        "48": "/img/logo-c-grey.png",
                                        "69": "/img/logo-c-grey.png"}});
                                chrome.runtime.sendMessage({title :"Company not found"});
                                // chrome.browserAction.setBadgeText({text: "0"});
                                // chrome.browserAction.setIcon({path:{"128": "/img/logo-c-blue.png",
                                //         "50": "/img/logo-c-green.png",
                                //         "48": "/img/logo-c-green.png"}});
                                // chrome.browserAction.setTitle({title:"Company not Found"})
                                // chrome.browserAction.setIcon({path:chrome.extension.getURL('/img/c-logo.png')});
                                // chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                                //     chrome.tabs.sendMessage(tabs[0].id, "notify_icon_cross");
                                // });
                            }
                            else{
                                $scope.get_toggled_comp_data('',sender.tab.url);
                            }
                        }
                        else{
                            if(sender.tab.url.includes("linkedin.com/in/")){
                                // chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                                //     chrome.tabs.sendMessage(tabs[0].id, "notify_icon_cross");
                                // });
                                // chrome.browserAction.setIcon({path:{"128": "/img/logo-c-blue.png",
                                //         "50": "/img/logo-c-green.png",
                                //         "48": "/img/logo-c-green.png"}});
                                // chrome.browserAction.setBadgeText({text:" "});
                                // chrome.runtime.sendMessage({color:"#A83636"});
                                chrome.runtime.sendMessage({path :{"128": "/img/logo-c-grey.png",
                                        "48": "/img/logo-c-grey.png",
                                        "69": "/img/logo-c-grey.png"}});
                                chrome.browserAction.setTitle({title:"Company not Found"});
                                $rootScope.company_data = {};
                                $scope.person_data = [];
                                $scope.total_person_count = 0;
                                $rootScope.loader_flag = false;
                                $rootScope.no_company_data = false;
                                // chrome.browserAction.setBadgeText({text: "0"});
                            }
                            if($scope.no_company_data === false || sender.tab.url.includes("/sales/search")){
                                $rootScope.company_data = {};
                                $scope.person_data = [];
                                $scope.total_person_count = 0;
                                $rootScope.loader_flag = false;
                                $rootScope.no_company_data = false;
                                // chrome.browserAction.setBadgeText({text:" "});
                                // chrome.runtime.sendMessage({color:"#A83636"});
                                chrome.runtime.sendMessage({path :{"128": "/img/logo-c-grey.png",
                                        "48": "/img/logo-c-grey.png",
                                        "69": "/img/logo-c-grey.png"}});
                                chrome.runtime.sendMessage({title :"Company not found"});
                                // chrome.browserAction.setBadgeText({text: "0"});
                                // chrome.browserAction.setIcon({path:{"128": "/img/logo-c-blue.png",
                                //         "50": "/img/logo-c-green.png",
                                //         "48": "/img/logo-c-green.png"}});
                                // chrome.browserAction.setTitle({title:"Company not Found"})
                                // chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                                //     chrome.tabs.sendMessage(tabs[0].id, "notify_icon_cross");
                                // });
                            }
                            else {
                                $scope.get_toggled_comp_data($rootScope.comp_id, $rootScope.comp_website);
                            }
                        }
                    }
                }
                // console.log(sender.tab ?
                //     "from a content script:" + sender.tab.url :
                //     "from the extension");
                // sendResponse({farewell: "goodbye"});
            });

        $scope.get_toggled_comp_data = function(ids,websites) {
            $rootScope.click_settings = false;
            $rootScope.loader_flag = true;
            if ($scope.copy_comp_list1){
                $rootScope.current_credits = $scope.copy_comp_list1.credits_count;
                $scope.listurls = false;
                $rootScope.loader_flag = false;
                $rootScope.company_data =$scope.copy_comp_list1.result;
                $scope.comp_data_len = 1;
                $scope.company_list = '';
                $rootScope.comp_id = $scope.copy_comp_list1.result['company_id'];
                $rootScope.comp_website = $scope.copy_comp_list1.result.website;
                $rootScope.company_data.website = $scope.copy_comp_list1.result.website;
                $scope.person_data = $scope.copy_comp_list1.result['person_data'];
                $scope.total_person_count = $scope.copy_comp_list1.result['persons_count'];
                $rootScope.no_company_data = true;
                // chrome.runtime.sendMessage({badgeText: "1"});
                chrome.runtime.sendMessage({title :"Company found"});
                chrome.runtime.sendMessage({
                    path: {
                        "128": "/img/logo-c-blue.png",
                        "48": "/img/logo-c-blue.png",
                        "69": "/img/logo-c-blue.png"
                    }
                });
                // chrome.browserAction.setBadgeText({text: "1"});
                // chrome.browserAction.setIcon({path:{"128": "/img/logo-c-green.png",
                //         "50": "/img/logo-c-green.png",
                //         "48": "/img/logo-c-green.png"}});
                // chrome.browserAction.setTitle({title:"Company Found"})
                // chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                //     chrome.tabs.sendMessage(tabs[0].id, "notify_icon_check");
                // });
            }
            else {
                $http({
                    method: 'POST',
                    url: consts.linkedin_url + "extension/get_selected_comp_page_data",
                    data: {
                        'user_id': $rootScope.user_id,
                        'company_id': ids,
                        'customer_id': $rootScope.customer_id,
                        'website': websites
                    },
                    headers: {'Content-Type': 'application/json'}
                })
                    .then(function (details) {
                        $rootScope.loader_flag = false;
                        $rootScope.current_credits = details.data.credits_count;
                        $scope.comp_data_len = 1;
                        $scope.company_list = '';
                        $scope.listurls = false;
                        $scope.copy_comp_list1 = details.data;
                        $rootScope.company_data = details.data.result;
                        $rootScope.comp_id = details.data.result['company_id'];
                        $rootScope.comp_website = details.data.result.website;
                        $rootScope.company_data.website = details.data.result.website;
                        $scope.person_data = details.data.result['person_data'];
                        $scope.total_person_count = details.data.result['persons_count'];
                        $rootScope.no_company_data = true;
                        chrome.runtime.sendMessage({
                            path: {
                                "128": "/img/logo-c-blue.png",
                                "48": "/img/logo-c-blue.png",
                                "69": "/img/logo-c-blue.png"
                            }
                        });
                        chrome.runtime.sendMessage({title :"Company found"});
                        // chrome.browserAction.setBadgeText({text: "1"});
                        // chrome.browserAction.setIcon({path:{"128": "/img/logo-c-green.png",
                        //         "50": "/img/logo-c-green.png",
                        //         "48": "/img/logo-c-green.png"}});
                        // chrome.browserAction.setTitle({title:"Company Found"});

                        // chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                        //     chrome.tabs.sendMessage(tabs[0].id, "notify_icon_check");
                        // });
                        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                            chrome.tabs.sendMessage(tabs[0].id, "toggle1");
                        });
                    });
            }
        };

        $scope.show_selected_company = function(ids,websites){
            $rootScope.click_settings = false;
            $rootScope.loader_flag = true;
            $scope.go_back_flag = true;
            // $rootScope.no_company_data = false;
            $rootScope.company_data.company_name = "List of Companies";
            $http({
                method: 'POST',
                url: consts.linkedin_url + "extension/get_selected_comp_page_data",
                data: {
                    'user_id': $rootScope.user_id,
                    'company_id': ids,
                    'customer_id':$rootScope.customer_id,
                    'website':websites
                },
                headers: {'Content-Type': 'application/json'}
            })
            .then(function (details) {
                $rootScope.loader_flag = false;
                $rootScope.current_credits = details.data.credits_count;
                $scope.comp_data_len = 1;
                $scope.company_list='';
                $scope.listurls = false;
                $rootScope.company_data = details.data.result;
                $rootScope.comp_id = details.data.result['company_id'];
                $rootScope.comp_website = details.data.result.website;
                $rootScope.company_data.website = details.data.result.website;
                $scope.person_data = details.data.result['person_data'];
                $scope.total_person_count = details.data.result['persons_count'];
                $rootScope.no_company_data = true;
                // chrome.runtime.sendMessage({badgeText: "1"});
                // chrome.browserAction.setBadgeText({text: "1"});
                // chrome.browserAction.setIcon({path:{"128": "/img/logo-c-green.png",
                //         "50": "/img/logo-c-green.png",
                //         "48": "/img/logo-c-green.png"}});
                // chrome.browserAction.setTitle({title:"Company Found"});

                chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
                    chrome.tabs.sendMessage(tabs[0].id,"toggle1");
                });
            });
        };

        $scope.prospect_page_ui = function () {
            $rootScope.click_settings = false;
            $location.path("/ext_prospect");
        };

        $scope.company_page_ui = function () {
            $rootScope.click_settings = false;
            $location.path("/ext_company");
        };

        $scope.settings_page_ui = function(){
            $rootScope.click_settings = true;
            $location.path("/ext_settings");
            chrome.storage.local.get("settings", function (obj1) {
                if (obj1.settings !== undefined) {
                        $rootScope.check = obj1.settings;
                }
            });
        };

        $scope.checkAll = function(value){
            let data = {};
            $rootScope.click_settings = true;
            data['extension_flag'] = value;
            data['user_id'] = $rootScope.user_id;
            // $rootScope.is_comp_page = false;
            // if($scope.saved_data){
            //     chrome.storage.local.set({'settings': details.data});
            //     $rootScope.check = details.data;
            // }
            // else {
                $http({
                    method: 'PUT',
                    url: consts.linkedin_url + 'extension/modify_extension_flag',
                    data: data,
                    headers: {'Content-Type': 'application/json'}
                })
                    .then(function (details) {
                        chrome.storage.local.set({'settings': details.data});
                        $rootScope.check = details.data;
                        $scope.saved_data = details.data;
                    }, function (err) {
                        console.log('');
                    });
            // }
        };

        $scope.person_search = function (word) {
            $rootScope.loader_flag = true;
            $scope.search_flag = true;
            if (word !== '' && word !== undefined) {
                $scope.person_data = [];
                $scope.total_person_count = 0;
                $http({
                    method: 'PUT',
                    url: consts.linkedin_url + "extension/get_comp_page_data",
                    data: {'user_id': $rootScope.user_id, 'company_id': $rootScope.company_data['company_id'],
                           'customer_id':$rootScope.customer_id,'search_word':word},
                    headers: {'Content-Type': 'application/json'}
                })
                .then(function (details) {
                    $scope.search_word = word;
                    if($rootScope.loggedin) {
                        $rootScope.loader_flag = false;
                        $scope.person_data = details.data['person_data'];
                        $scope.total_person_count = details.data['persons_count'];
                    }
                    else {
                        $location.path("/ext_login");
                    }
                }, function (err) {
                    if($rootScope.loggedin) {
                        $rootScope.loader_flag = false;
                        $scope.person_data = [];
                        $scope.total_person_count = 0;
                    }
                    else {
                        $location.path("/ext_login");
                    }
                });
            }
        };

        $scope.reset_person_search = function () {
            $rootScope.loader_flag = true;
            $scope.person_data = $rootScope.company_data['person_data'];
            $scope.total_person_count = $rootScope.company_data['persons_count'];
            $scope.search_word = '';
            $rootScope.loader_flag = false;
        };

        $scope.toggle_window = function () {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
                chrome.tabs.sendMessage(tabs[0].id,"toggle");
            })
        };
        
        $scope.add_comp_to_radar = function () {
            // $('#addtoradar a').click(function(e){
            //  $("#addtoradar").attr("id", "clodura-loading");
            // $('#addtoradar').parent().removeClass();
            // $('#addtoradar').addClass('clodura-loading');
            $("#addtoradar").replaceWith('<button id="addtoradar" type="button"  class="btn btn-sm btn-default clodura-blueOutlinedBtn pull-right"  style="border-radius: 6px;border-color: grey;margin-left: 3%;margin-right: 3%;width:80px"><img style="width:20px;height:20px" src="../img/loader1.gif"></button>');
            // });
            $http({
                method: 'POST',
                url: consts.linkedin_url + "extension/add_comp_to_radar",
                data: {'user_id': $rootScope.user_id, 'company_id': $rootScope.company_data['company_id'],
                       'customer_id':$rootScope.customer_id},
                headers: {'Content-Type': 'application/json'}
            })
                .then(function (details) {
                    if (details.data.result === 'company_present' || details.data.result === 'true' || details.data.result === 'not_unlocked'){
                       $("#addtoradar").replaceWith('<button id="addtoradar" type="button"  class="btn btn-sm btn-default clodura-blueOutlinedBtn pull-right"  style="border-radius: 6px;border-color: grey;margin-left: 3%;margin-right: 3%;width:80px">Added</button>');
                    }
                    else if (details.data.result ==='blacklisted'){
                        $("#addtoradar").replaceWith('<button id="addtoradar" type="button"  class="btn btn-sm btn-default clodura-blueOutlinedBtn pull-right"  style="border-radius: 6px;border-color: grey;margin-left: 3%;margin-right: 3%;width:80px">Blacklisted</button>');
                    }
                    else if(details.data.result === 'credits_over'){
                        $("#addtoradar").replaceWith('<button id="addtoradar" type="button"  class="btn btn-sm btn-default clodura-blueOutlinedBtn pull-right"  style="border-radius: 6px;border-color: grey;margin-left: 3%;margin-right: 3%;width:80px">Credits over</button>');
                    }
                    else if(details.data.result === true){
                        $("#addtoradar").replaceWith('<button id="addtoradar" type="button"  class="btn btn-sm btn-default clodura-blueOutlinedBtn pull-right"  style="border-radius: 6px;border-color: grey;margin-left: 3%;margin-right: 3%;width:80px">Added</button>');
                    }
                    else if(details.data.result === false){
                        $("#addtoradar").replaceWith('<button id="addtoradar" type="button"  class="btn btn-sm btn-default clodura-blueOutlinedBtn pull-right"  style="border-radius: 6px;border-color: grey;margin-left: 3%;margin-right: 3%;width:80px">Error</button>');
                    }
                    else{
                        $("#addtoradar").replaceWith('<button id="addtoradar" type="button"  class="btn btn-sm btn-default clodura-blueOutlinedBtn pull-right"  style="border-radius: 6px;border-color: grey;margin-left: 3%;margin-right: 3%;width:80px">Add to Radar</button>');
                    }
                    $rootScope.current_credits = details.data.count;
                }, function (err) {
                    console.log("");
                    // $rootScope.loader_flag = false;
                    // $scope.person_data = [];
                    // $scope.total_person_count = 0;
                });
        };

        $scope.go_back = function () {
            $scope.go_back_flag = false;
            $rootScope.company_data.company_name = "List of Companies";
            $rootScope.company_page_data('init');
            // $location.path("/ext_company");
            $("#addtoradar").replaceWith('');
        };

         $scope.check_login = function () {
             if(!($rootScope.loggedin)){
                 $location.path("/ext_login");
             }
             else{
                 $location.path("/ext_company");
             }
         }

        // $scope.get_phone_number = function (person_id,first_name,last_name,email,designation,company_id,d){
        //     var name = first_name+" "+last_name;
        //     var per_details = {"user_id":$rootScope.user_id,"person_id":person_id,"name":name,
        //         "email":email,"designation":designation,"company_id":company_id,
        //         "customer_id":$rootScope.customer_id};
        //     $http({
        //         method: 'POST',
        //         url : consts.linkedin_url + 'get_phone_numbers/',
        //         data : per_details,
        //         headers: {'Content-Type': 'application/json'}
        //     }).then(function(details) {
        //         console.log(details);
        //         if(details.data === "In Process"){
        //             d.phone_status = 'pending';
        //         }else if(details.data === 'Phone Credits 0'){
        //             alert("You Don't have Phone Credits");
        //         }else if(details.data === 'Error'){
        //             d.phone_status = 'Not_in_database';
        //         }
        //     },function(err) {
        //         console.log(err);
        //     });
        // }

    }
})();