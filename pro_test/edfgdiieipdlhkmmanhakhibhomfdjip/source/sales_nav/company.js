
var salesN_company_functions ={
    c_data :{},
    default_page_no:0,
    count:0,

    show_salesN_company_button:function(){
        $('.add_comp_btn').remove();
        var single_add = "<button class='add_comp_btn' style='height: 40px;' title='Add to Clodura'><div class='sales_navi_cmp_add'  style='vertical-align: top;font-size: 16px;'><img src='"+ chrome.extension.getURL('/img/Add.png') +"' style='width: 17px;height: 18px;vertical-align:text-bottom'/></div></button>";
        if($('.save-button-banner').length > 0){
            $('.save-button-banner').append(single_add);
        }
        else{
            var single_add1 = "<button class='add_comp_btn' style='height: 30px;margin-left: 10px' title='Add to Clodura'><div class='sales_navi_cmp_add'  style='vertical-align: top;font-size: 16px;'><img src='"+ chrome.extension.getURL('/img/Add.png') +"' style='width: 17px;height: 18px;vertical-align:text-bottom'/></div></button>";
            $('.flex.align-items-center.mb1').append(single_add1);
        }
    },

    show_salesN_add_all_compbtn:function(ui){
        var all_data = $(".bulk-actions");
        $(".c_pages").remove();
        $(".pagination_c_class").remove();
        $('.sales_navi_all_companies').remove();
        var all_props_add = "<button style='margin-left:10px' class='sales_navi_all_companies' title='Add all to Clodura'><img  src='" + chrome.extension.getURL('/img/person_add.jpeg') + "' width='17px' height='20px' style='vertical-align: top;'/><span style='padding-left: 4px;font-size: 15px;'>Add All</span></button>";
        let page_numbers_button = "<span style='font-size: 15px;margin-left: 10px' class='c_pages'>Select Pages</span>&nbsp;&nbsp;<select class='pagination_c_class' style='width: 60px;height:36px;padding-left:10px;' id='myselectc'></select>";
        if(ui=="old"){
            if ($('#results-list').length > 0) {
                $('#results-list').parent().prepend(page_numbers_button);
                $('#results-list').parent().prepend(all_props_add);
            }
            else {
                $('#results-list').parent().prepend(page_numbers_button);
                $('#results-list').parent().prepend(all_props_add);
            }
        }else if(ui=="new"){
            if ($('.search-results__result-list').length > 0) {
                $('.bulk-actions').append(page_numbers_button);
                $('.bulk-actions').append(all_props_add);
            }
            else {
                $('.bulk-actions').append(page_numbers_button);
                $('.bulk-actions').append(all_props_add);
            }
        }
        $(function(){
            var $select = $(".pagination_c_class");
            for (i=1;i<=consts.c_pages;i++){
                $select.append($('<option></option>').val(i).html(i));
            }
        });
        salesN_company_functions.default_page_no = $( "#myselectc" ).val();
    },

    myFunction: function(){
        salesN_company_functions.default_page_no = $( "#myselectc" ).val();
    },

    Sales_show_compbtn_single: function (ui){

        if(ui=="old"){
            var all_data = $(".spotlights-and-results-container section.search-results-container ul li.result.loading.company");
            $.each(all_data, function (i, el) {
                var url2 = $(el).find("a.image-wrapper.account-link").attr('href');
                var ur = url2.split("companyId=");
                var url1 = ur[1].split("&");
                var id =  url1[0];
                var single_add = "<button class='sales_navigator_single_btn'  title='Add to Clodura'><div class='sales_navi_singlecmp_add' id='"+id+"'data-url='"+ url2 +"' ><img src='"+ chrome.extension.getURL('/img/Add.png') +"' style='width: 20px;height: 20px;margin-top: 2px;'/></div></button>";
                $(el).find('.info').prepend(single_add);
            });
        }else if(ui=="new"){
            var all_data = $("ol.search-results__result-list li.pv5.ph2.search-results__result-item");
            $.each(all_data, function (i, el) {
                // var url2 = $(el).find("result-lockup__name a").attr('href');
               // var url2 = $(el).find(".flex.full-width.deferred-area.ember-view .search-results__result-container article .");
                //console.log("aaa111",url2);
                let url2 = $(el).find(".flex.full-width.deferred-area.ember-view .search-results__result-container article .result-lockup .horizontal-square-entity-lockup-5.result-lockup__entity dl dt.result-lockup__name a");
                url2 = url2[0];
                try {
                    url2 = jQuery(url2).attr('href');
                    var ur = url2.split("?");
                    var url1 = ur[0].split("/company/");
                    var id = url1[1];
                    var single_add = "<li><button class='sales_navigator_single_btn'  title='Add to Clodura'><div class='sales_navi_singlecmp_add' id='" + id + "'data-url='" + url2 + "' ><img src='" + chrome.extension.getURL('/img/Add.png') + "' style='width: 20px;height: 20px;margin-top: 2px;'/></div></button></li>";
                    var isbuttonpresent = el.getElementsByClassName('sales_navigator_single_btn');
                    if (isbuttonpresent.length == 0) {
                        $(el).find('.result-lockup__common-actions').append(single_add);
                    }
                }catch(err){}
            });
        }
    },

    scrapIt : function (callback) {
        var cmp_url = window.location.href;
        var ur = cmp_url.split("?")[0];
        var sales_n_url = ur.replace('/sales','').replace('people','').replace('insights','');
        company_visit.sales_nav_cmp_visit(sales_n_url,'','','', callback);
    },

    checkCompany : function() {
        $(".sales_navi_cmp_add").each(function () {
            var that = $(this);
            var parent = $(that).parent();
            $(parent).removeAttr("style").css("background", "").html(consts.success_button_ui.loader).css('margin-left','20px');
            if(salesN_company_functions.c_data['website'] != undefined || salesN_company_functions.c_data['website']!=''){
                salesN_company_functions.c_data['user_id']= user_d.user_id;
                salesN_company_functions.c_data['flag'] ="single_comp";
                salesN_company_functions.c_data['h_flag'] ="salesN";
                // console.log("salesN_company_functions.c_data",salesN_company_functions.c_data);
                $.ajax({
                    dataType: "json",
                    url: consts.linkedin_url + 'extension/check',
                    type: "post",
                    contentType: "application/json",
                    data: JSON.stringify(salesN_company_functions.c_data)
                }).success(function (response) {
                    if(response != null) {
                        if (response.res == true || response.res == "true") {
                            $(parent).html(consts.company_button_ui.success).css('top', '12px').css('margin-left','20px');								// $(credits).html(response.credits);
                        }
                        else if (response.res == false || response.res == "false") {
                            salesN_company_functions.show_salesN_company_button();
                        }
                        else if (response.res =='website_not_present'){
                            $(parent).html(consts.company_button_ui.website_error);
                        }
                        else{
                            $(parent).html(consts.company_button_ui.error_msg);
                        }
                    }
                    else{
                        salesN_company_functions.show_salesN_company_button();
                    }
                    consts.oldURL = window.location.href;
                });
                $(parent).css('height','40px');
            }
        });
    },

    single_add_from_list: function(that, ui, flag){
        if(ui=="old"){
            var parent = $(that).parent();
            var ur = $(that).attr('data-url');
            ur = ur.split("companyId=");
            var url = ur[1].split("&");
            var id = "#"+url[0];
            url = "https://www.linkedin.com/company/"+url[0];
        }else if(ui=="new"){
            var parent =that;
            var data ={};
            that_ = that.replace("#",'');
            url = "https://www.linkedin.com/company/"+that_;
        }
        if (flag=="single_add"){
            company_visit.sales_n_comp_arry = [];
            company_visit.sales_nav_cmp_visit(url+'/','','','');
        }
        $(parent).removeClass("sales_navi_singlecmp_add").removeAttr("style").css("background", "").html(consts.success_button_ui.loader);
        // setTimeout(function(){
            // for (var i=0; i<company_visit.sales_n_comp_arry.length;i++) {
                var i = 0;
                var data_comp = {};
                if(company_visit.sales_n_comp_arry.length > 0){
                    var website = company_visit.sales_n_comp_arry[i]['website'];
                    data_comp = company_visit.sales_n_comp_arry[i];
                }else{
                    data_comp['linkedin_url'] = url;
                }
                // if (website != '' || website != undefined) {
                  data_comp['user_id'] = user_d.user_id;
                  data_comp['islinkedin'] = true;
                  data_comp['id'] = that;
                  data_comp['flag'] = 'salesN';
                  data = JSON.stringify(data_comp);
                    // extension_functions.single_company_add(that, 'salesN_All');
                    $(parent).removeAttr("style").css("background", "").html(consts.success_button_ui.loader);
                    // var url = baseurl ;
                    $.ajax({
                        dataType : "json",
                        url: consts.linkedin_url+"extension/add_company",
                        type: "post",
                        contentType: "application/json",
                        data: data
                    }).success(function (response) {
                        //console.log("res111111111",response);
                            // consts.credits = response.credits;
                            company_visit.sales_n_comp_arry = [];
                            if (response!= null) {
                                if (response.res == 'failure') {
                                    $(parent).html(consts.company_button_ui.error_msg);
                                }
                                else if (response.res == 'success') {
                                    $(parent).html(consts.success_button_ui.success).css('top', '12px');
                                }
                                else if (response.res == 'blacklisted') {
                                    $(parent).html(consts.company_button_ui.blacklisted);
                                    alert("Sorry, this Company is blacklisted, Please remove the Company from blacklist to add in your Radar.");
                                }
                                else if (response.res =='website_not_present'){
                                    $(parent).html(consts.person_added.error_msg).attr('title','Sorry, Website is not present of this Company');
                                }
                                else if (response.credits <= 0) {
                                    alert("Sorry, You don't have enough credits to add this Company.");
                                    $(parent).html(consts.person_added.error_msg);
                                }
                            }
                            else{
                                $(parent).html(consts.company_button_ui.error_msg);

                            }
                        })
                        .fail(function (response) {
                            if(response.responseText == "failure")
                            {
                                $(parent).html("<span class='error_message'>Re-login</span>");
                            }
                        });
    },

    multiple_add_from_list: function(that, ui, flag){
        // company_visit.cmp_d=[];
        // company_visit.sales_n_comp_arry=[];
        if(ui=="old"){
            var parent = $(that).parent();
            var ur = $(that).attr('data-url');
            ur = ur.split("companyId=");
            var url = ur[1].split("&");
            var id = "#"+url[0];
            url = "https://www.linkedin.com/company/"+url[0];
        }else if(ui=="new"){
            var parent =that;
            var data ={};
            that_ = that.replace("#",'');
            url = "https://www.linkedin.com/company/"+that_;
        }
        if (flag=="single_add"){
            company_visit.sales_n_comp_arry = [];
            company_visit.sales_nav_cmp_visit(url+'/','','','');
        }
        $(parent).removeClass("sales_navi_singlecmp_add").removeAttr("style").css("background", "").html(consts.success_button_ui.loader);
        // setTimeout(function(){
        // for (var i=0; i<company_visit.sales_n_comp_arry.length;i++) {
        var i = 0;
        var data_comp = {};
        if(company_visit.sales_n_comp_arry.length > 0){
            var website = company_visit.sales_n_comp_arry[i]['website'];
            data_comp = company_visit.sales_n_comp_arry[i];
        }else{
            data_comp['linkedin_url'] = url;
        }
        // if (website != '' || website != undefined) {
        data_comp['user_id'] = user_d.user_id;
        data_comp['islinkedin'] = true;
        data_comp['id'] = that;
        data_comp['flag'] = 'salesN';
        data = JSON.stringify(data_comp);
        // extension_functions.single_company_add(that, 'salesN_All');
        $(parent).removeAttr("style").css("background", "").html(consts.success_button_ui.loader);
        // var url = baseurl ;
        $.ajax({
            dataType : "json",
            url: consts.linkedin_url+"extension/add_company",
            type: "post",
            contentType: "application/json",
            data: data,
            async: "false"
        }).success(function (response) {
            //console.log('ressssssss',response);
            // consts.credits = response.credits;
            company_visit.sales_n_comp_arry = [];
            if (response!= null) {
                if (response.res == 'failure') {
                    $(parent).html(consts.company_button_ui.error_msg);
                }
                else if (response.res == 'success') {
                    $(parent).html(consts.success_button_ui.success).css('top', '12px');
                }
                else if (response.res == 'blacklisted') {
                    $(parent).html(consts.company_button_ui.blacklisted);
                    alert("Sorry, this Company is blacklisted, Please remove the Company from blacklist to add in your Radar.");
                }
                else if (response.res =='website_not_present'){
                    $(parent).html(consts.person_added.error_msg).attr('title','Sorry, Website is not present of this Company');
                }
                else if (response.credits <= 0) {
                    alert("Sorry, You don't have enough credits to add this Company.");
                    $(parent).html(consts.person_added.error_msg);
                }
            }
            else{
                $(parent).html(consts.company_button_ui.error_msg);

            }
        })
            .fail(function (response) {
                if(response.responseText == "failure")
                {
                    $(parent).html("<span class='error_message'>Re-login</span>");
                }
            });
    },


    single_company_add:function (that,flag) {
        let data = '';
        let parent = $(that).parent();
        if(flag === 'salesN'){
            salesN_company_functions.c_data['user_id'] = user_d.user_id;
            salesN_company_functions.c_data['islinkedin'] = true;
            salesN_company_functions.c_data['flag'] = 'salesN';
            data = JSON.stringify(salesN_company_functions.c_data);
        }
        else {
            company_functions.c_data['user_id'] = user_d.user_id;
            company_functions.c_data['islinkedin'] = true;
            // company_functions.c_data['user'] = api_key;
            company_functions.c_data['flag'] = 'linkedin_company';
            data = JSON.stringify(company_functions.c_data);
        }
        $(parent).removeAttr("style").css("background", "").html(consts.success_button_ui.loader).css('margin-left','20px');
        $.ajax({
            dataType: "json",
            url: consts.linkedin_url + "extension/add_company",
            type: "post",
            contentType: "application/json",
            // headers: {
            //     Authorization: 'Bearer ' + token
            // },
            data: data
        })
            .success(function (response) {
                //console.log("ressss",response)
                // consts.credits = response.credits;
                // if (consts.credits > 0) {
                    if (response != null) {
                        if (response.res == 'failure') {
                            $(parent).html(consts.company_button_ui.error_msg);
                        }
                        else if (response.res == 'success') {
                            $(parent).html(consts.company_button_ui.success).css('top', '12px').css('margin-left','20px');
                        }
                        else if (response.res == 'blacklisted') {
                            $(parent).html(consts.company_button_ui.blacklisted);
                            alert("Sorry, this Company is blacklisted, Please remove the Company from blacklist to add in your Radar.");
                        }
                        else if (response.credits <= 0) {
                            alert("Sorry, You don't have enough credits to add this Company.");
                            $(parent).html(consts.company_button_ui.error_msg);
                        }
                    }
                    else {
                        $(parent).html(consts.company_button_ui.error_msg);
                    }
                // }
                // else{
                //     alert("Sorry, You don't have enough credits to add this Company.");
                //     $(parent).html(consts.person_added.error_msg).attr("title","Sorry, You don't have enough credits to add this Company.");
                // }
            })
            .fail(function (response) {
                if (response.responseText == "failure") {
                    $(parent).html("<span class='error_message'>Re-login</span>");
                }
            });

        if(flag === 'salesN'){
            $(parent).css('height','40px');
        }
    },

    add_pages:function() {
        let href_url = '';
        let href_url1 = window.location.href;
        if (href_url1.includes("/sales/search/companies")) {
            if (href_url1.includes("&start=")) {
                let href_url2 = href_url1.split("&start=");
                let href_ur3 = href_url2[1].split("&");
                let href4 = href_ur3[1] + "&" + href_ur3[2];
                if ((sessionStorage.getItem("cnoofpages") >= 2 && sessionStorage.getItem("cnoofpages") <= consts.c_pages)) {
                    href_ur3 = parseInt(href_ur3[0]) + 25;
                    let count_value = sessionStorage.getItem("cvisitednoofpages");
                    salesN_company_functions.count = parseInt(count_value) + 1;
                    sessionStorage.setItem("cvisitednoofpages", salesN_company_functions.count);
                    href_url = href_url2[0] + "&start=" + href_ur3 + "&" + href4;
                    window.location.replace(href_url);
                    salesN_company_functions.sales_company_add_all('new');

                }
            }
            else {
                if ((sessionStorage.getItem("cnoofpages") >= 2 && sessionStorage.getItem("cnoofpages") <= consts.c_pages)) {
                    let href_url2 = href_url1.split("pivotType");
                    let href_ur3 = href_url2[0] + "count=25&start=25&pivotType" + href_url2[1];
                    window.location.replace(href_ur3);
                    salesN_company_functions.count = parseInt(salesN_company_functions.count) + 1;
                    sessionStorage.setItem("cvisitednoofpages", salesN_company_functions.count);
                    salesN_company_functions.sales_company_add_all('new');
                }
            }
        }
        else if (href_url1.includes("/sales/search/company?")) {
            if (href_url1.indexOf("page=") === -1) {
                // https://www.linkedin.com/sales/search/people/list/employees-for-account/1976?searchSessionId=mIN%2Fq%2BxsQquUHQxl9iETOQ%3D%3D
                let href_url2 = href_url1.split("searchSessionId=");
                let href_ur3 = href_url2[0] + "page=2&searchSessionId=" + href_url2[1];
                if ((sessionStorage.getItem("cnoofpages") >= 2 && sessionStorage.getItem("cnoofpages") <= consts.c_pages)) {
                    window.location.replace(href_ur3);
                    salesN_company_functions.count = parseInt(salesN_company_functions.count) + 1;
                    sessionStorage.setItem("cvisitednoofpages", salesN_company_functions.count);
                    salesN_company_functions.sales_company_add_all('new');
                }
            }
            else {
                let href_url2 = href_url1.split("page=");
                let href_ur3 = href_url2[1].split("&searchSessionId");
                let href4 = href_ur3[1];
                if ((sessionStorage.getItem("cnoofpages") >= 2 && sessionStorage.getItem("cnoofpages") <= consts.c_pages)) {
                    href_ur3 = parseInt(href_ur3[0]) + 1;
                    let count_value = sessionStorage.getItem("cvisitednoofpages");
                    salesN_company_functions.count = parseInt(count_value) + 1;
                    sessionStorage.setItem("cvisitednoofpages", salesN_company_functions.count);
                    href_url = href_url2[0] + "page=" + href_ur3 + "&searchSessionId"+ href4;
                    window.location.replace(href_url);
                    salesN_company_functions.sales_company_add_all('new');
                }
            }
        }
    },


    url_list:[],
    visited_url:[],
    sales_company_add_all:function(ui){
        $(".c_pages").remove();
        $(".pagination_c_class").remove();
        $('.sales_navi_all_companies').remove();

        if(ui=="old"){
            var all_data = $(".spotlights-and-results-container section.search-results-container ul li.result.loading.company");
            $('#results-list').parent().prepend(consts.success_button_ui.add_all_loader);
        }else if(ui=="new"){
            $('.bulk-actions').append(consts.success_button_ui.add_all_loader);
            var all_data = $("ol.search-results__result-list li.search-results__result-item");
        }
        // $(".sales_navi_all_companies").remove();
        $('#processing').css('margin-top','10px').css('margin-bottom','10px');
        var cm_data={};
        // console.log("alll data",all_data);
        salesN_prospect_functions.slowEach(all_data, 4000, function (el, i){
        // $.each(all_data, function(i, el){
            var deferred = $.Deferred();
            var cmp_url ='';
            var url1='';
            var u='';
            if(ui=="old"){
                let ur = $(el).find("a.image-wrapper.account-link").attr('href');
                ur = ur.split("companyId=");
                url1 = ur[1].split("&");
                u = url1[0];
            }else if(ui=="new"){
                let ur = $(el).find(".result-lockup__name a").attr('href');
                ur = ur.split("?");
                url1 = ur[0].split("/company/");
                u = url1[1];
            }
            var id='';
            if (url1.indexOf('undefined') == -1) {
                cmp_url = 'https://www.linkedin.com/company/'+u;
                salesN_company_functions.url_list.push({'url': u});
                id = "#"+ u;
                $(id).css("background", "").removeAttr("style").html(consts.success_button_ui.loader);
            }
            var url_ = "https://www.linkedin.com/company/"+u+"/";

            if (salesN_company_functions.visited_url.indexOf(url_) === -1) {
                // salesN_company_functions.visited_url.push(url_);
                var comps_size='';
                var comps_location='';
                var comps_industry ='';
                var size_comps='';
                var comp_name='';
                try {
                    comp_name = $(el).find("dt.result-lockup__name").text();
                    comps_industry = $(el).find("ul.mv1.result-lockup__misc-list li:first").text();
                    if (comps_industry.indexOf('employees') > -1) {
                        // size_comps = comps_industry;
                    } else {
                        comps_industry = comps_industry;
                    }
                    comps_size = $(el).find("ul.mv1.result-lockup__misc-list li:nth-child(2)").text();
                    if($("ul.mv1.result-lockup__misc-list li:nth-child(3)").length>0) {
                        comps_location = $(el).find("ul.mv1.result-lockup__misc-list li:nth-child(3)").text();
                    }
                    // console.log('compssssssssssizeee',comps_size,comps_size.indexOf('employees'))
                    if (comps_size.indexOf('employees') > -1) {
                        comps_size = comps_size;
                        size_comps = comps_size.replace("employees", "").replace(",", "").trim();
                        if (comps_size.indexOf("-") > -1) {
                            size_comps = comps_size.split("-");
                            size_comps = size_comps[0].replace(",", "").trim() + "-" + size_comps[1].replace(",", "").trim();
                            size_comps = size_comps.replace("employees", "");
                        }
                    }
                    else{
                        comps_location = comps_size;
                    }

                    // if (comps_size.indexOf("-") > -1) {
                    //     size_comps = comps_size.split("-");
                    //     size_comps = size_comps[0].replace(",", "").trim() + "-" + size_comps[1].replace(",", "").trim();
                    //     size_comps = size_comps.replace("employees", "");
                    // } else {
                    //     size_comps = comps_size.replace("employees", "").replace(",", "").trim();
                    // }
                }catch(err){console.log("")}
                var c_flag ='add_all_compsdb';
                cm_data['user_id'] = user_d.user_id;
                cm_data['flag'] = "check_comp";
                cm_data['linkedin_url']= cmp_url;
                cm_data['size']= size_comps;
                cm_data['location'] = comps_location.trim();
                cm_data['industry']= comps_industry.trim();
                cm_data['comps_flag'] ='company';
                cm_data['comp_name'] =comp_name;
                // console.log("cmdtaaaaaaa",cm_data);
                $.ajax({
                    dataType: "json",
                    url: consts.linkedin_url + 'extension/check',
                    type: "post",
                    contentType: "application/json",
                    data: JSON.stringify(cm_data),
                    async: "false"
                }).success(function (response) {
                    // console.log("res company check",response.res)
                    if (response.res == true || response.res == "true") {
                        company_visit.sales_n_comp_arry=[];
                        company_visit.company_data=[];
                        salesN_company_functions.multiple_add_from_list(id, "new", "multiple_add");
                    }
                    else if (response.res == false || response.res == "false") {
                        // company_visit.visit_cmp_page(url,'','','');
                        company_visit.sales_n_comp_arry = [];
                        company_visit.company_data=[];
                        company_visit.sales_nav_cmp_visit(response.linkedin_url+'/','',id,c_flag);
                        // company_visit.sales_n_comp_arry = [];
                    }
                });
            }
            $('#processing').remove();
            // salesN_company_functions.add_all_companies_db();
        });
    },


    add_all_companies_db:function(){
            // if(salesN_company_add.c_data['website'] != undefined || salesN_company_add.c_data['website']!=''){
            var data = {
                "user_id": user_d.user_id,
                "cmp_data": company_visit.company_data,
                "islinkedin": true,
                'flag': "sales_nav_allcomp"
            };
            $.ajax({
                dataType: "json",
                url: consts.linkedin_url + 'extension/add_all_sn_companies',
                type: "post",
                contentType: "application/json",
                data: JSON.stringify(data)
            }).success(function (response) {
                consts.credits = response.credits;
                if (response) {
                    $('#processing').remove();
                    var res_list = Object.keys(response['res']);
                    var a = JSON.parse(JSON.stringify(salesN_company_functions.url_list));
                    var id = '';
                    for (var d = 0; d < a.length; d++) {
                        id = a[d]['url'];
                        if (res_list.indexOf(id) >= 0) {
                            if (response.res[id] == 'success') {
                                $("#" + id).html(consts.success_button_ui.success).css('top', '12px').attr("title", "Added to Clodura");								// $(credits).html(response.credits);
                            }
                            else if (response.res[id] == 'failure' && response.credits > 0) {
                                $("#" + id).html(consts.person_added.error_msg).css('top', '12px').attr("title", "Company website is not mentioned, So we can not add this Company.");
                            }
                            else if (response.res[id] == 'failure' && response.credits == 0) {
                                $("#" + id).html(consts.person_added.error_msg).css('top', '12px').attr("title", "Sorry, You don't have enough credits to add this Company.");
                            }
                            else if (response.res[id] == 'blacklisted') {
                                $("#" + id).html(consts.person_added.blacklisted).css('top', '12px').attr("title", "Company is blacklisted, Please remove the Company from blacklist and try to add it again.");
                            }
                            else {
                                $("#" + id).html(consts.company_button_ui.error_msg).css('top', '12px').attr('title', "Error");
                            }
                        }
                        else {
                            $("#" + id).html(consts.company_button_ui.error_msg).css('top', '12px').attr("title", "Error");
                        }
                    }
                }
                else{
                    alert("Sorry, You don't have enough credits to add this Companies.")
                    for (let d=0 ; d< salesN_company_functions.url_list.length; d++){
                        let id = "#"+salesN_company_functions.url_list[d]['url'];
                        // if (company_visit.company_data[d]['added_person'] === false) {
                        $(id).html(consts.person_added.error_msg).css('top', '12px').attr("title", "Sorry, You don't have enough credits to add this Company.");
                        // }
                    }
                }

            });
    }

};
