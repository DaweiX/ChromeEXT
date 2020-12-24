var c_data = null;
//var serviceUrl = 'http://localhost:5000/api/v1/';
 var serviceUrl = 'https://product.clodura.ai/api/v1/';
//var serviceUrl = 'https://beta.clodura.com/api/v1/';

var user_d = {
    api_key:"",
    credits:"",
    initials:"",
    user_id:""
};

var urlnew = '';
var oldu='';
(function ($) {
    var msg = null;
    var api_key = "";
    var credits = "";
    var initials = "";
    var user_id = "";
    var currentURL = "";
    var is_loggedin = null;

    chrome.storage.local.get("user", function (obj) {
            // let name = obj.user.split(":");
            // window.setTimeout(function () {
            if (obj && obj.user != undefined) {
                $("#btnlogout").show();
                // $('html, body').css("height", "30%");
                is_loggedin = obj;
                $("#basic-search").hide();
                api_key = obj.user.split(':')[0];
                credits = obj.user.split(':')[1];
                user_id = obj.user.split(':')[2];
                if (api_key != '' || api_key != undefined) {
                    try {
                        initials = (api_key.split(" ")[0][0] + api_key.split(" ")[1][0]).toUpperCase();
                    }
                    catch (err) {
                        initials = '';
                    }
                }
                user_d.api_key = api_key;
                user_d.initials = initials;
                user_d.credits = credits;
                user_d.user_id = user_id;
                // consts.credits = credits;
                setTimeout(function () {
                    init();
                },4000);
            }
            // else if (Object.keys(obj).length === 0) {
            //     $("#show_logout").hide();
            //     $("#advanced-search").hide();
            //     $("#btnlogout").hide();
            //     $("#basic-search").show();
            //     // $('html, body').css("height", "50%");
            // }
        // },4000);
    });

    function checkURLchange(currentURL){
        if(currentURL.includes("/sales/company/")){
            if((currentURL != consts.oldURL)){
                consts.oldURL = currentURL;

                // $('html, body').animate({scrollTop: $(document).height() - $(window).height()}, 70, function () {
                //     $(this).animate({scrollTo: 500}, 70);
                //     $(this).animate({scrollTop: 0}, 70);
                // });
                salesN_company_functions.scrapIt(salesN_company_functions.checkCompany);
                // setTimeout(function () {
                salesN_company_functions.show_salesN_company_button();
                // salesN_company_functions.checkCompany();
                // },5000);
            }
        }
        else if(currentURL.includes("/company/")){
            // if (consts.oldURL != currentURL || urlnew != currentURL) {
                if (currentURL !== consts.oldURL) {
                    try {
                        document.getElementById("demo").remove();
                    }
                    catch(err){}
                    if(currentURL.includes("/about/")) {
                        setTimeout(function () {
                            sessionStorage.removeItem("urlbyguid");
                            sessionStorage.removeItem("website");
                            company_functions.show_company_button();
                            company_functions.scrapIt();
                        }, 1000);
                        setTimeout(function(){
                            company_functions.checkCompany();
                        },3000);
                    }
                    else{
                        sessionStorage.removeItem("urlbyguid");
                        company_functions.show_company_button();
                        company_functions.scrapeGuid();
                    }
                    oldu = currentURL.replace("about/","");
                    urlnew = currentURL;
                }
            // }
            consts.oldURL = currentURL;
        }
        else if(currentURL.includes('/sales/search/companies')){
            if (currentURL != consts.oldURL) {
                $('html, body').animate({scrollTop: $(document).height() - $(window).height()}, 500, function () {
                    $(this).animate({ scrollTo: 1000 }, 100);
                    $(this).animate({ scrollTop: 0 }, 100)
                });
                salesN_company_functions.show_salesN_add_all_compbtn("old");
                setTimeout(function(){
                    salesN_company_functions.Sales_show_compbtn_single("old");
                    consts.oldURL = currentURL;
                },600);
            }
        }
        else if(currentURL.includes('/sales/search/company')){
            if (currentURL != consts.oldURL) {
                setTimeout(function(){
                    $(window).scroll(function() {
                        var scroll = $(window).scrollTop();
                        if (scroll >= 500) {
                            salesN_company_functions.Sales_show_compbtn_single("new");
                        }
                    });

                    if(consts.oldURL!='' && consts.oldURL!=null) {
                        salesN_company_functions.show_salesN_add_all_compbtn("new");
                        salesN_company_functions.Sales_show_compbtn_single("new");
                    }

                    if(sessionStorage.getItem('cflag')==='cadd_pages') {
                        if ($(".display-flex.flex-column.search-results").length > 0){
                            // console.log("checkURLchange in if");
                            scrollingElement = (document.scrollingElement || document.body);
                            $(scrollingElement).animate({scrollTop: document.body.scrollHeight}, 1400);
                            $(scrollingElement).animate({scrollTop: 0}, 1600);
                        }
                        else{
                            $('html, body').animate({scrollTop: $(document).height() - $(window).height()}, 70, function () {
                                $(this).animate({scrollTo: 500}, 70);
                                $(this).animate({scrollTop: 0}, 70);
                            });
                        }
                        salesN_company_functions.sales_company_add_all("new");
                    }
                    if(parseInt(sessionStorage.getItem("cnoofpages")) === parseInt(sessionStorage.getItem("cvisitednoofpages"))){
                        setTimeout(function(){
                            swal("Done.");
                        },210000);
                        sessionStorage.removeItem("cvisitednoofpages");
                        sessionStorage.removeItem("cnoofpages");
                        sessionStorage.removeItem("cflag");
                    }
                    consts.oldURL = currentURL;
                },4000);
            }
        }
        else if(currentURL.includes('/sales/search')){
            if (!currentURL.includes("/sales/search/companies")) {
                if (currentURL != consts.oldURL) {
                   // setTimeout(function(){
                    if(consts.oldURL!='' && consts.oldURL!=null) {
                        salesN_prospect_functions.show_salesN_add_all_btn();
                        salesN_prospect_functions.Sales_All_prospcet();
                    }
                        $(window).scroll(function() {
                            var scroll = $(window).scrollTop();
                            if (scroll >= 500) {
                                salesN_prospect_functions.Sales_All_prospcet();
                            }
                        });
                        // salesN_all_prosp_add.checkAllProspect();
                        if (sessionStorage.getItem('flag') === 'add_pages') {
                            if ($(".display-flex.flex-column.search-results").length > 0 ){
                                scrollingElement = (document.scrollingElement || document.body);
                                $(scrollingElement).animate({scrollTop: document.body.scrollHeight}, 1400);
                                $(scrollingElement).animate({scrollTop: 0}, 1600);
                            }
                            else{
                                $('html, body').animate({scrollTop: $(document).height() - $(window).height()}, 70, function () {
                                    $(this).animate({scrollTo: 500}, 70);
                                    $(this).animate({scrollTop: 0}, 70);
                                });
                            }
                            setTimeout(function () {
                                salesN_prospect_functions.Sales_All_prospcet();
                            },6000);
                            setTimeout(function () {
                                salesN_prospect_functions.sales_person_add_all();
                            },6400);
                        }
                        consts.oldURL = currentURL;
                        if(parseInt(sessionStorage.getItem("noofpages")) === parseInt(sessionStorage.getItem("visitednoofpages"))){
                            setTimeout(function(){
                                // functionAlert("Done","Ok");
                                swal("Done.");
                            },210000);
                            sessionStorage.removeItem("visitednoofpages");
                            sessionStorage.removeItem("noofpages");
                            sessionStorage.removeItem("flag");
                        }
                   // },4000);
                }
            }
        }
        else if(currentURL.includes("/in/")){
            consts.flag='prospect';
            // prospect_add.scrapItProspect();
            if(currentURL != consts.oldURL ) {
                setTimeout(function(){
                    prospect_functions.show_prospect_button();
                    prospect_functions.scrapItProspect();
                    prospect_functions.checkProspect();
                    // $(window).scroll(function() {
                    //     var scroll = $(window).scrollTop();
                    //     if (scroll >= 500) {
                    //         prospect_functions.scrapItProspect();
                    //         prospect_functions.checkProspect();
                    //     }
                    // });salesN_prospect_functions
                },2000);
                consts.oldURL = currentURL;
            }
        }
        else if(currentURL.includes("/sales/people/") || currentURL.includes("/sales/profile/")){
            // consts.flag='prospect';
            if(currentURL != consts.oldURL ) {
                setTimeout(function(){
                    salesN_prospect_functions.show_single_person();
                    salesN_prospect_functions.scrap_single__prospect_data('','check_prosp');
                },1000);

                setTimeout(function(){
                    salesN_prospect_functions.checkProspect();
                },3000);
                consts.oldURL = window.location.href;
                // prospect_add.checkProspect();
            }
        }
    }

    setInterval(function() {
        if(is_loggedin) {
            let c_ur = window.location.href;
            if (c_ur.includes("/company/") || c_ur.includes("/in/") || c_ur.includes("/sales/")) {
                checkURLchange(c_ur);
            }
        }
    }, 9000);

    setInterval(function(){
        if(is_loggedin) {
            salesN_prospect_functions.add_pages();
        }
    },210000);

    setInterval(function(){
        if(is_loggedin) {
            salesN_company_functions.add_pages();
        }
    },210000);

    function init() {
        let currentURL = window.location.href;
        if (currentURL.includes("/sales/company/")){
            if(currentURL != consts.oldURL){
                consts.oldURL = currentURL;
                // $('html, body').animate({scrollTop: $(document).height() - $(window).height()}, 70, function () {
                //     $(this).animate({scrollTo: 500}, 70);
                //     $(this).animate({scrollTop: 0}, 70);
                // });
                salesN_company_functions.show_salesN_company_button();
                salesN_company_functions.scrapIt(salesN_company_functions.checkCompany);
                setTimeout(function () {
                    salesN_company_functions.checkCompany();
                },5000);
            }
        }
        else if(currentURL.includes("/company/")){
            //sessionStorage.removeItem("website");
            if(currentURL != consts.oldURL) {
                try {
                    document.getElementById("demo").remove();
                }catch(err){}
                setTimeout(function(){
                    sessionStorage.removeItem("urlbyguid");
                    company_functions.scrapeGuid();
                    company_functions.show_company_button();
                },2000);
                if(currentURL.includes("/about/")) {
                    sessionStorage.removeItem("urlbyguid");
                    sessionStorage.removeItem("website");
                    // company_functions.show_company_button();
                    company_functions.scrapIt();
                    setTimeout(function(){
                        company_functions.checkCompany();
                    },3000);
                    consts.oldURL = urlnew;
                }
            }
            //consts.oldURL = urlnew;
        }
        else if(currentURL.includes('/sales/search/companies')){
            if (currentURL != consts.oldURL) {
                $('html, body').animate({scrollTop: $(document).height() - $(window).height()}, 500, function () {
                    $(this).animate({ scrollTo: 1000 }, 100);
                    $(this).animate({ scrollTop: 0 }, 100)
                });
                salesN_company_functions.show_salesN_add_all_compbtn("old");
                setTimeout(function(){
                    salesN_company_functions.Sales_show_compbtn_single("old");
                    consts.oldURL = currentURL;
                },600);
            }
        }
        else if(currentURL.includes('/sales/search/company')){
            if (currentURL != consts.oldURL) {
                // setTimeout(function(){
                    salesN_company_functions.show_salesN_add_all_compbtn("new");
                    salesN_company_functions.Sales_show_compbtn_single("new");
                    $(window).scroll(function() {
                        var scroll = $(window).scrollTop();
                        if (scroll >= 500) {
                            //clearHeader, not clearheader - caps H
                            salesN_company_functions.Sales_show_compbtn_single("new");
                        }
                    });

                    if(sessionStorage.getItem('cflag')==='cadd_pages') {
                        if ($(".display-flex.flex-column.search-results").length > 0){
                            // console.log("checkURLchange in if");
                            scrollingElement = (document.scrollingElement || document.body);
                            $(scrollingElement).animate({scrollTop: document.body.scrollHeight}, 1400);
                            $(scrollingElement).animate({scrollTop: 0}, 1600);
                        }
                        else{
                            $('html, body').animate({scrollTop: $(document).height() - $(window).height()}, 70, function () {
                                $(this).animate({scrollTo: 500}, 70);
                                $(this).animate({scrollTop: 0}, 70);
                            });
                        }
                        setTimeout(function(){
                            salesN_company_functions.Sales_show_compbtn_single("new");
                        },6000);
                        setTimeout(function(){
                            salesN_company_functions.sales_company_add_all("new");
                        },6400);
                    };
                    if(parseInt(sessionStorage.getItem("cnoofpages")) === parseInt(sessionStorage.getItem("cvisitednoofpages"))){
                        setTimeout(function() {
                            swal("Done.");
                        },210000);
                        sessionStorage.removeItem("cvisitednoofpages");
                        sessionStorage.removeItem("cnoofpages");
                        sessionStorage.removeItem("cflag");
                    }
                    consts.oldURL = currentURL;
                // },4000);
            }
        }
        else if(currentURL.includes('/sales/search')) {
            if (!currentURL.includes("/sales/search/companies")) {
                if (currentURL !== consts.oldURL) {

                    // setTimeout(function () {
                        salesN_prospect_functions.show_salesN_add_all_btn();
                        salesN_prospect_functions.Sales_All_prospcet();
                        $(window).scroll(function() {
                            var scroll = $(window).scrollTop();
                            if (scroll >= 500) {
                                salesN_prospect_functions.Sales_All_prospcet();
                            }
                        });
                        // salesN_all_prosp_add.checkAllProspect();

                       if (sessionStorage.getItem('flag') === 'add_pages') {
                            if ($(".display-flex.flex-column.search-results").length > 0){
                                // $('html, body').animate({scrollTop: $(document).height() - $(window).height()}, 500, function () {
                                //     $(this).animate({scrollTo: 2000}, 500);
                                //     $(this).animate({scrollTop: 0}, 200);
                                // });
                                scrollingElement = (document.scrollingElement || document.body);
                                $(scrollingElement).animate({scrollTop: document.body.scrollHeight}, 1400);
                                $(scrollingElement).animate({scrollTop: 0}, 1600);

                                // window.scrollTo(0,document.body.scrollHeight);

                                // var scrollingElement = (document.scrollingElement || document.body);
                                // $(scrollingElement).animate({ scrollTo: 10000 }, 5000);
                                // $(scrollingElement).animate({ scrollTop: 0 }, 8000)
                            }
                            else{
                                $('html, body').animate({scrollTop: $(document).height() - $(window).height()}, 70, function () {
                                    $(this).animate({scrollTo: 500}, 70);
                                    $(this).animate({scrollTop: 0}, 70);
                                });
                            }
                            setTimeout(function () {
                                salesN_prospect_functions.Sales_All_prospcet();
                            },6000);
                            setTimeout(function () {
                                salesN_prospect_functions.sales_person_add_all();
                            },6400);
                        }
                        if (parseInt(sessionStorage.getItem("noofpages")) === parseInt(sessionStorage.getItem("visitednoofpages"))) {
                            setTimeout(function () {
                                // alertify.alert("Done.");
                                // functionAlert("Done","Ok");
                                swal("Done.")
                            }, 210000);
                            sessionStorage.removeItem("visitednoofpages");
                            sessionStorage.removeItem("noofpages");
                            sessionStorage.removeItem("flag");
                        }
                        consts.oldURL = currentURL;
                    // }, 4000);
                }
            }
        }
        else if(currentURL.includes("/in/")){
            consts.flag = 'prospect';
            prospect_functions.show_prospect_button();
            consts.oldURL = currentURL;
        }
        else if(currentURL.includes("/sales/people/") || currentURL.includes("/sales/profile/")){
            consts.flag='prospect';
            setTimeout(function(){
                salesN_prospect_functions.show_single_person();
                salesN_prospect_functions.scrap_single__prospect_data('','check_prosp');
            },1500);

            setTimeout(function(){
                salesN_prospect_functions.checkProspect();
            },3000);
            consts.oldURL = currentURL;
        }
    }
    // Linkedin api calls
    $("body").on("click", ".indi_add", function (event) {
        let current = window.location.href;
        event.preventDefault();
        // To add individual linkedin company by visiting company page
        if(current.includes("/company/")){
            var that = $(this);
            if(company_functions.c_data['website']!='' || company_functions.c_data['website']!=undefined){
                company_functions.single_company_add(that,'linkedin_company');
            }
            else{
                swal("Sorry, We can not identify website for this Company.");
            }
        }
        // To add single company from list of 10 companies.
        else if(current.includes("/search/results/companies")) {
            var that = $(this);
            company_functions.add_single_from_add_all(that);
        }
        // To add individual prospect from linkedin by visiting page
        else{
            let that = $(this);
            $('html, body').delay(1000).animate({scrollTop: 2000 }, 1500, function () {
                $(this).animate({ scrollTo: 2000 });
                $(this).animate({ scrollTop: 0 })
            });
            setTimeout(function(){
                prospect_functions.scrapItProspect();
                prospect_functions.add_single_prospect(that,'');
            },2500);
        }
    });

    // To add all companies of a page at a time from linkedin
    $("body").on("click",".add_all_comp_btn", function(event){
        company_functions.add_all_companies_li();
    });
    // Add all persons of a page from linkedin to database after clicking button
    $("body").on("click", ".add_all_btn", function (event) {
        prospect_functions.linkedin_person_add_all();
    });

    // To add single person from list of page from linkedin.
    $("body").on("click",".indi_add1" ,function (event){
        var that = $(this);
        prospect_functions.single_person_add_all(that);
    });

    //Sales navigator api calls
    // To add single company from list of page sales navigator.
    $("body").on("click", ".sales_navi_singlecmp_add", function (event) {
        event.preventDefault();
        var that = $(this);
        var parent = $(that).parent();
        var ur = $(that).attr('data-url');
        currentURL = window.location.href;
        if(currentURL.includes('/sales/search/companies')){
            ur = ur.split("companyId=");
            var url = ur[1].split("&");
            var u = url[0];
            var id = "#"+u;
            url = "https://www.linkedin.com/company/"+u;
            company_visit.sales_n_comp_arry = [];
            $(id).removeClass("sales_navi_singlecmp_add").removeAttr("style").css("background", "").html(consts.success_button_ui.loader);
            company_visit.sales_nav_cmp_visit(url+'/','',id,'add_single_compsdb');
        }else if(currentURL.includes('/sales/search/company')){
            ur= ur.split("?");
            var url = ur[0].split("/company/");
            var id = "#"+url[1];
            url = "https://www.linkedin.com/company/"+url[1];
            company_visit.sales_n_comp_arry = [];
            $(id).removeClass("sales_navi_singlecmp_add").removeAttr("style").css("background", "").html(consts.success_button_ui.loader);
            company_visit.sales_nav_cmp_visit(url+'/','',id,'add_single_compsdb');
        }

    });

    // To add all companies of a page from sales navigator.
    $("body").on("click", ".sales_navi_all_companies", function (event) {
        if ($(".display-flex.flex-column.search-results").length> 0 ){
            // console.log("checkURLchange in if");
            scrollingElement = (document.scrollingElement || document.body);
            $(scrollingElement).animate({scrollTop: document.body.scrollHeight}, 1500);
            $(scrollingElement).animate({scrollTop: 0}, 1600);
        }
        setTimeout(function(){
            salesN_company_functions.Sales_show_compbtn_single("new");
        },6000);
        setTimeout(function(){
            currentURL = window.location.href;
            salesN_company_functions.myFunction();
            sessionStorage.setItem("cnoofpages", salesN_company_functions.default_page_no);
            sessionStorage.setItem("cflag","cadd_pages");
            if(currentURL.includes('/sales/search/companies')){
                salesN_company_functions.sales_company_add_all("old");
            }
            else if(currentURL.includes('/sales/search/company')){
                if(sessionStorage.getItem("cnoofpages")==1){
                    salesN_company_functions.sales_company_add_all("new");
                    sessionStorage.removeItem("cvisitednoofpages");
                    sessionStorage.removeItem("cnoofpages");
                    sessionStorage.removeItem("cflag");
                }
                else if ((sessionStorage.getItem("cnoofpages") >= 2 && sessionStorage.getItem("cnoofpages") <= consts.c_pages)) {
                    salesN_company_functions.count = parseInt(salesN_company_functions.count) + 1;
                    sessionStorage.setItem("cvisitednoofpages", salesN_company_functions.count);
                    salesN_company_functions.sales_company_add_all("new");
                }
            }
        },6400)
    });

    // To add individual company from sales navigator by visiting page.
    $("body").on("click", ".sales_navi_cmp_add", function (event) {
        event.preventDefault();
        var that = $(this);
        var website = salesN_company_functions.c_data['website'];
        if(salesN_company_functions.c_data['website']!='' ){
            salesN_company_functions.single_company_add(that,'salesN');
        }
        else {
            swal("Sorry, We can not identify website for this Company.");
            $('.add_comp_btn').remove();
        }
    });

    // To add single prospect from list of a page sales navigator.
    $("body").on("click",".indi_add2" ,function (event){
        event.preventDefault();
        var that = $(this);
        salesN_prospect_functions.single_sales_person_add(that);
    });

    // To add all prospects of a page from sales navigator.
    $("body").on("click", ".sales_navi_all_prospect", function (event) {
        if ($(".display-flex.flex-column.search-results").length > 0){
            scrollingElement = (document.scrollingElement || document.body);
            $(scrollingElement).animate({scrollTop: document.body.scrollHeight}, 1200);
            $(scrollingElement).animate({scrollTop: 0}, 1500);
        }
        setTimeout(function(){
            // salesN_prospect_functions.show_salesN_add_all_btn();
            salesN_prospect_functions.Sales_All_prospcet();
        },6000);
        setTimeout(function(){
            salesN_prospect_functions.myFunction();
            sessionStorage.setItem("noofpages", salesN_prospect_functions.default_page_no);
            sessionStorage.setItem("flag","add_pages");
            // let href_url1 = 'https://www.linkedin.com/sales/search/people/list/employees-for-account/623875?searchSessionId=P6ZmJyIgQ9aae%2Bz1A8%2Bfjg%3D%3D';
            if(sessionStorage.getItem("noofpages")==1){
                salesN_prospect_functions.sales_person_add_all();
                sessionStorage.removeItem("visitednoofpages");
                sessionStorage.removeItem("noofpages");
                sessionStorage.removeItem("flag");
            }
            else {
                if ((sessionStorage.getItem("noofpages") >= 2 && sessionStorage.getItem("noofpages") <= consts.pages)) {
                    salesN_prospect_functions.count = parseInt(salesN_prospect_functions.count) + 1;
                    sessionStorage.setItem("visitednoofpages", salesN_prospect_functions.count);
                    salesN_prospect_functions.sales_person_add_all();
                }
            }
        },6400)
    });

    // To add individual prospect from sales navigator by visiting page.
    $("body").on("click", ".single_indi_add", function (event) {
        event.preventDefault();
        var that = $(this);
        salesN_prospect_functions.scrap_single__prospect_data(that,'add_prosp');
    });

    // Ui functions
    $("body").on("click", ".al-slide-left", function () {
        $(".al_sidebar").hide("slide", { direction: "right", distance: "330px" }, 1000, function () {
            $(".al-slide-left").css("right", 0).addClass("al-slide-right");
            $(".al-slide-left i").addClass("fa-angle-double-left");
        });
    });

    $("body").on("click", ".al-slide-right", function () {
        $(".al_sidebar").show("slide", { direction: "right", distance: "-330px" }, 1000, function () {
            $(".al-slide-left").css("right", "330px").removeClass("al-slide-right");
            $(".al-slide-left i").removeClass("fa-angle-double-left");
        });
    });

    $("body").on("click", ".side_push", function () {
        $(".als_content").toggle("slide", { "direction": "right" }, 50);
        $(".side_push i").toggleClass("fa-chevron-left").toggleClass("fa-chevron-right");
    });

    $("body").on("click", ".al_slide_button", function () {
        $(".al_side").toggleClass("closed");
    });

})(jQuery);
