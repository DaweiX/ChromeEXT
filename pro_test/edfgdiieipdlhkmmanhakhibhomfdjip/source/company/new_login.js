
(function()
{
    'use strict';
    angular.module('clodura_extension').controller('ExtLoginCtrl', ExtLoginCtrl);
    function ExtLoginCtrl($scope,$location,$http,$rootScope)
    {
        $scope.extlogin = function () {
            $scope.apiCalled=true;
            var data_ ={
                email: $scope.cloduraEmail,
                password: $scope.cloduraPassword
            };
            if ($scope.cloduraEmail && $scope.cloduraPassword) {
                $http({
                    method: "POST",
                    url: consts.linkedin_url + 'extension/login',
                    data: data_,
                    headers: {'Content-Type': 'application/json'}
                }).then(function (return_result) {
                    $scope.apiCalled = false;
                    $rootScope.loggedin=true;
                    chrome.storage.local.set({'toggleflag': 'open'});
                    chrome.storage.local.set({"web_url":window.location.href});
                    if(return_result.data !== "Record Not Found") {
                        var fname = return_result.data.firstname.charAt(0).toUpperCase() + return_result.data.firstname.slice(1);
                        var lname = return_result.data.lastname.charAt(0).toUpperCase() + return_result.data.lastname.slice(1);
                        chrome.storage.local.set({'user': fname + " " + lname + ":" + return_result.data.current_credits + ":" + return_result.data.id +
                                ":" + return_result.data.customer_id+":"+return_result.data.phone_credits+":"+return_result.data.trial_user});
                        chrome.storage.local.set({'settings': return_result.data.extension_flag});
                        $rootScope.username= fname+" "+lname;
                        $rootScope.initials = fname.slice(0, 1).toUpperCase()+lname.slice(0,1).toUpperCase();
                        $rootScope.customer_id = return_result.data.customer_id;
                        $rootScope.phone_credits = return_result.data.phone_credits;
                        $rootScope.user_id = return_result.data.id;
                        $rootScope.check = return_result.data.extension_flag;
                        $rootScope.trial_user = return_result.data.trial_user;
                        $rootScope.current_credits = return_result.data.current_credits;
                        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
                            chrome.tabs.sendMessage(tabs[0].id,"insert_icon");
                        });
                        $location.path("/ext_company");
                        $rootScope.company_page_data('login');
                    }
                    else {
                        $location.path("/ext_login");
                    }
                }, function (err) {
                    if(err.data === 'Password Not Matched') {
                        $scope.wrong_data = 'wrong_password';
                    }
                    else if(err.data === 'Record Not Found'){
                        $scope.wrong_data = 'wrong_email';
                    }
                    else if(err.data === 'user unsubscribe'){
                        $scope.wrong_data = 'unsub_user';
                    }
                    else{
                        $scope.wrong_data = 'log_failed';
                    }
                    $scope.apiCalled = false;
                    $location.path("/ext_login");
                });
            }
            else {
                chrome.storage.local.set({'toggleflag': 'open'});
                $scope.apiCalled = false;
            }
        };
    }
})();