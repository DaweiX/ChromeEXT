(function() {
    'use strict';
    angular
        .module('clodura_extension', ["ngRoute"])
        .directive('ngEnter', function () {
            return function (scope, element, attrs) {
                element.bind("keydown keypress", function (event) {
                    if (event.which === 13) {
                        scope.$apply(function () {
                            scope.$eval(attrs.ngEnter);
                        });
                        event.preventDefault();
                    }
                });
            };
        })
        .config(function($routeProvider) {
            $routeProvider
                .when("/", {
                    templateUrl: "/source/company/default.html"
                })
                .when("/ext_company", {
                    templateUrl: "/source/company/company.html"
                })
                .when("/ext_login", {
                    templateUrl: "/source/company/new_login.html"
                })
                .when("/ext_prospect",{
                    templateUrl : "/source/company/person.html"
                })
                .when("/ext_settings",{
                    templateUrl : "/source/company/settings.html"
                })
            ;
        });
})();