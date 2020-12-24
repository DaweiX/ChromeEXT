
var salesN_prospect_functions = {

    person_arr : [],
    search_result_cnt :0,
    pageProspect_arr1:[],
    url_list:[],
    visited_url:[],
    visit_url_array:[],
    default_page_no:0,
    no_ofpeople_visited :0,
    pages_flag: '',
    count:0,

    show_single_person: function () {
        $('.add_prosp_btn').remove();
        var single_add = "<button class='add_prosp_btn' style='padding-left:5px' title='Add to Clodura'><div class='single_indi_add'  style='vertical-align: top;font-size: 16px;width:70px'><img src='" + chrome.extension.getURL('/img/Add.png') + "' style='width: 17px;height: 18px;vertical-align:middle'/><span style='padding-left:8px'>Add</span></div></button>";
        if ($('.profile-badges').length > 0) {
            $('.profile-badges.flex.align-items-center').parent().append('');
            $('.profile-badges.flex.align-items-center').parent().append(single_add);
        }
        else if($('.profile-topcard-person-entity__content').length > 0){
            $('.profile-topcard-person-entity__content dl dt ul.ml2').parent().append('');
            $('.profile-topcard-person-entity__content dl dt ul.ml2').parent().append(single_add);
        }
        else{
            $('.profile-topcard__connections-data').parent().append('');
            $('.profile-topcard__connections-data').parent().append(single_add)
        }
    },

    show_salesN_add_all_btn:function(){
        $('.sales_navi_all_prospect').remove();
        $('.pages').remove();
        $('.pagination_class').remove();
        let all_data = $(".spotlights-and-results-container section.search-results-container ul li");
        let i = 0;
        let ll_array =[];
        $.each(all_data, function (i, el) {
            let t = $(el).find("div.name-container").text();
            if (t != "LinkedIn Member") {
                ll_array.push("linkedin member")
            }
        });
        let all_props_add = "<span style='margin:13px;'></span><button class='sales_navi_all_prospect' title='Add all to Clodura'><img  src='" + chrome.extension.getURL('/img/person_add.jpeg') + "' width='17px' height='18px' style='vertical-align: top;'/><span style='padding-left: 4px;font-size: 15px;'>Add All</span></button>";
        let page_numbers_button = "<span style='font-size: 15px;margin-left: 10px' class='pages'>Select Pages</span>&nbsp;&nbsp;<select class='pagination_class' style='width: 60px;height:36px;padding-left:10px;' id='myselect'></select>";
        if ($('#results-list').length > 0) {
            $('#results-list').parent().prepend(all_props_add);
            $('#results-list').parent().prepend(page_numbers_button);
        }
        else {
            $('.search-results__result-list').parent().prepend(all_props_add);
            $('.search-results__result-list').parent().prepend(page_numbers_button);
        }
        $(function(){
            var $select = $(".pagination_class");
            for (i=1;i<=consts.pages;i++){
                $select.append($('<option></option>').val(i).html(i));
            }
        });
        salesN_prospect_functions.default_page_no = $( "#myselect" ).val();
    },

    myFunction: function(){
        salesN_prospect_functions.default_page_no = $( "#myselect" ).val();
    },

    Sales_All_prospcet: function () {
        let all_data='';
        if($(".spotlights-and-results-container section.search-results-container").length>0){
            all_data = $(".spotlights-and-results-container section.search-results-container ul li");
        }
        else if($(".search-results__result-list li.pv5.pr6.search-results__result-item").length>0){
            all_data = $(".search-results__result-list li.pv5.pr6.search-results__result-item");
        }
        else if($(".search-results__result-list li.pv5.ph2.search-results__result-item").length > 0){
            all_data = $(".search-results__result-list li.pv5.ph2.search-results__result-item");
        }
        let collective_data = [];
        let current_company = '';
        $.each(all_data, function (i, el) {
            let t, title,ul,url,current_location,current_position,cll,description,company_linkedinurl,expe,mem_id,p_id;
            if($("div.name-container").length>0) {
                t = $(el).find("div.name-container").text();
            }
            else{
                t = $(el).find(".result-lockup__name").text();
            }
            if (t.includes(",")) {
                t = t.split(',')[0];
            }
            title = t.replace(/ *\([^)]*\) */g, " ").replace(/[\.(),':-]+/g, "");
            title = title.replace(/[^\x00-\x7F]/g, "").replace("{","").replace("}","").replace("#","").replace("`","").trim();
            if (title != "LinkedIn Member") {
                ul = "https://www.linkedin.com";
                if($("a.name-link.profile-link").length>0) {
                    url = ul + $(el).find("a.name-link.profile-link").attr('href');
                    url = url.split('?')[0];
                }
                else{
                    url = ul + $(el).find(".result-lockup__name a").attr('href');
                    url = url.split('?')[0];
                }
                if (url.indexOf('undefined')==-1){
                    salesN_prospect_functions.url_list.push({'url':url,'name':title});
                }
                if($("div.info p:nth-child(3)").length>0) {
                    current_location = $(el).find("div.info p:nth-child(3)").text();
                }
                else{
                    current_location = $(el).find(".result-lockup__misc-list").text().trim();
                }
                if($("div.info p:first").length>0) {
                    current_position = $(el).find("div.info p:first").text();
                }
                else{
                    current_position = $(el).find(".result-lockup__highlight-keyword span:first").text().trim();
                }
                try {
                    description = $(el).find("p.subline-level-1").text();
                }
                catch (err) {

                }
                if($("a.company-name.company-link").length>0) {
                    cll = $(el).find("a.company-name.company-link").attr('href');
                }
                else{
                    cll = $(el).find("span.result-lockup__position-company a").attr("href");
                }
                if (cll) {
                    try {
                        company_linkedinurl = cll.split("companyId=");
                        company_linkedinurl = company_linkedinurl[1].split("&");
                        company_linkedinurl = "https://www.linkedin.com/company/" + company_linkedinurl[0];
                    }
                    catch (err) {
                        company_linkedinurl = cll.split("/sales/");
                        company_linkedinurl = "https://www.linkedin.com/" + company_linkedinurl[1];
                    }
                }
                if($(".company-name").length>0){
                    current_company = $(el).find(".company-name").text();
                    if (!current_company){
                        current_company = $(el).find("span.company-name").text();
                    }
                }
                else{
                    current_company = $(el).find(".result-lockup__highlight-keyword span.result-lockup__position-company a span:first").text().toString().trim();
                    current_company = current_company.replace(/\n|\r/g,"");
                }

                expe = '';
                mem_id = url.split(",");
                mem_id = mem_id[0].split("/profile/");
                if (mem_id[1]){
                    p_id = mem_id[1];
                }
                else{
                    let title1 = title.replace(" Dr. ","").replace(" dr ","").replace(" Dr ","").replace(" dr. ","").replace(" Er. ","").replace("/","").replace(/"/g, "").replace("{","").replace("}","").replace("#","").replace("`","");
                    title1 = title1.split(" ");
                    p_id = title1[0]+"-"+title1[1];
                }
                if(p_id.indexOf("&")> 0){
                    p_id = p_id.replace("&","-");
                }
                let prospect_data = {
                    'url': url,
                    'll_pid': '',
                    'title': title,
                    'location': current_location,
                    'current_company': current_company,
                    'description': description,
                    'current_position': current_position,
                    'details_str': '',
                    'picture': '',
                    'previous': '',
                    'industry': '',
                    'company_linkedinurl': company_linkedinurl,
                    'expe': expe,
                    'company_ll_name': '',
                    'member_id':mem_id[1],
                    'added_person':false,
                    'p_id':p_id
                };

                // if (title != '' && current_company) {
                    collective_data.push(prospect_data);
                // }
                let single_add = "<button class='sales_navigator_single_btn' title='Add to Clodura'><div class='indi_add2' id='"+ p_id +"' data-url='"+ url +"' data-title='"+title+"'><img src='"+ chrome.extension.getURL('/img/Add.png') +"' style='width: 20px;height: 20px;margin-top: 2px;'/></div></button>";
                if($('.info').length>0){
                    $(el).find('.info').prepend(single_add);
                }
                else{
                    var isbuttonpresent1 = el.getElementsByClassName('sales_navigator_single_btn');
                    if (isbuttonpresent1.length == 0) {
                        $(el).find('.result-lockup__common-actions').append(single_add);
                    }
                }
            }
        });
        salesN_prospect_functions.pageProspect_arr1 = collective_data;
    },


    single_sales_person_add:function (that) {
        // var that = $(this);
        let purl= $(that).attr("data-url");
        let id = "#"+$(that).attr("id");
        let name,fname,lname,oname,c_url,position,location,company;
        let english = /^[- &+(),A-Za-z0-9 _]*$/;
        name =$(that).attr("data-title");
        if (name.includes(",")){
            oname = name.split(',');
            fname = oname[0].replace(/'/g, '');
            lname = oname[1].replace(/'/g, '');
        }
        else {
            oname = name.split(' ');
            fname = oname[0].replace(/'/g, '');
            oname.shift();
            lname = oname.join(' ').replace(/'/g, '');
        }
        // var parent = $(that).parent();
        for (var d = 0; d < salesN_prospect_functions.pageProspect_arr1.length; d++) {
            var cmp_url = salesN_prospect_functions.pageProspect_arr1[d].url;
            if (cmp_url === purl) {
                c_url= salesN_prospect_functions.pageProspect_arr1[d].company_linkedinurl;
                try {
                    c_url = c_url.split('?')[0];
                }
                catch (e) {
                    var split_url = '';
                    split_url = c_url;
                    c_url = split_url;
                }
                position = salesN_prospect_functions.pageProspect_arr1[d].current_position;
                location = salesN_prospect_functions.pageProspect_arr1[d].location;
                company = salesN_prospect_functions.pageProspect_arr1[d].current_company;
                if ((c_url || english.test(company)) && (english.test(name) || name.includes("@") || name.includes("&"))) {
                    if(name){
                        $(id).removeAttr("style").css("background", "").html(consts.success_button_ui.loader);
                    }
                    else{
                        $(id).removeAttr("style").css("background", "").html(consts.person_added.error_msg).attr('title', 'Sorry, we can not add this Person.');
                    }
                }
                else{
                    $(id).removeAttr("style").css("background", "").html(consts.person_added.error_msg).attr('title', 'Sorry, we can not add this Person as Company is not linked.');
                }
                break;
            }
        }
        salesN_prospect_functions.person_arr=[];
        prospect_visit.salesN_visited_cmp_for_prosp =[];
        company_visit.company_data =[];
        var flag ='sales_n_single_add';
        let prospect_data = {
            flag: 'sales_nav',
            current_url: purl,
            firstName: fname,
            lastName: lname,
            fullName: name,
            designation: position,
            industry: '',
            profileLink: '',
            publicLink: '',
            twitter_profile: '',
            personal_website: '',
            memberId: '',
            description: '',
            skills: '',
            location: location,
            educationsView: {},
            company: company,
            companyUrl: c_url,
            expe: {},
            linkedinUrl: '',
            public_identifier: '',
            salesN_url: purl,
        };
        if((c_url || english.test(company)) && english.test(name) || name || name.includes("@")) {
            prospect_visit.visit_salesN_prospect(purl, name, id, flag, c_url, prospect_data);
        }
    },

    add_pages:function() {
        let href_url = '';
        let href_url1 = window.location.href;
        if (href_url1.includes("/sales/search?")) {
            if (href_url1.includes("&start=")) {
                let href_url2 = href_url1.split("&start=");
                let href_ur3 = href_url2[1].split("&");
                let href4 = href_ur3[1] + "&" + href_ur3[2];
                if ((sessionStorage.getItem("noofpages") >= 2 && sessionStorage.getItem("noofpages") <= consts.pages)) {
                    href_ur3 = parseInt(href_ur3[0]) + 25;
                    let count_value = sessionStorage.getItem("visitednoofpages");
                    salesN_prospect_functions.count = parseInt(count_value) + 1;
                    sessionStorage.setItem("visitednoofpages", salesN_prospect_functions.count);
                    href_url = href_url2[0] + "&start=" + href_ur3 + "&" + href4;
                    window.location.replace(href_url);
                    salesN_prospect_functions.sales_person_add_all();

                }
            }
            else {
                if ((sessionStorage.getItem("noofpages") >= 2 && sessionStorage.getItem("noofpages") <= consts.pages)) {
                    let href_url2 = href_url1.split("pivotType");
                    let href_ur3 = href_url2[0] + "count=25&start=25&pivotType" + href_url2[1];
                    window.location.replace(href_ur3);
                    salesN_prospect_functions.count = parseInt(salesN_prospect_functions.count) + 1;
                    sessionStorage.setItem("visitednoofpages", salesN_prospect_functions.count);
                    salesN_prospect_functions.sales_person_add_all();
                }
            }
        }
        else if (href_url1.includes("/sales/search/people")) {
            if (href_url1.indexOf("page=") === -1) {
                // https://www.linkedin.com/sales/search/people/list/employees-for-account/1976?searchSessionId=mIN%2Fq%2BxsQquUHQxl9iETOQ%3D%3D
                // https://www.linkedin.com/sales/search/people?geoIncluded=africa%3A0&logHistory=true&page=1&searchSessionId=fsGI7RHyQXKRoxei4Uh9GA%3D%3D
                let href_url2 = href_url1.split("&page=1&searchSessionId=");
                let href_ur3 = href_url2[0] + "&page=2&searchSessionId=" + href_url2[1];
                if ((sessionStorage.getItem("noofpages") >= 2 && sessionStorage.getItem("noofpages") <= consts.pages)) {
                    window.location.replace(href_ur3);
                    salesN_prospect_functions.count = parseInt(salesN_prospect_functions.count) + 1;
                    sessionStorage.setItem("visitednoofpages", salesN_prospect_functions.count);
                    salesN_prospect_functions.sales_person_add_all();
                }
            }
            else {
                // https://www.linkedin.com/sales/search/people?doFetchHeroCard=false&geoIncluded=africa%3A0&logHistory=true&page=2searchSessionId=b84rGPQpQ2ejFmcQ6dEXVA%3D%3D&seniorityIncluded=9
                // https://www.linkedin.com/sales/search/people?doFetchHeroCard=false&geoIncluded=africa%3A0&logHistory=true&page=1&searchSessionId=9JxSzl8zQeuIwZsRjY24fw%3D%3D&seniorityIncluded=9
                let href_url2 = href_url1.split("page=");
                let href_ur3 = '';
                let flag11 = false;
                if(href_url2[1].indexOf('&rsLogId') !== -1) {
                    href_ur3 = href_url2[1].split("&rsLogId");
                    flag11 = true;
                }
                else{
                    href_ur3 = href_url2[1].split("&searchSessionId");
                    flag11 = false;
                }
                let href4 = href_ur3[1];
                let href_ur33='';
                if ((sessionStorage.getItem("noofpages") >= 2 && sessionStorage.getItem("noofpages") <= consts.pages)) {
                    href_ur33 = parseInt(href_ur3[0]) + 1;
                    let count_value = sessionStorage.getItem("visitednoofpages");
                    salesN_prospect_functions.count = parseInt(count_value) + 1;
                    sessionStorage.setItem("visitednoofpages", salesN_prospect_functions.count);
                    if(flag11 === true) {
                        href_url = href_url2[0] + "page=" + href_ur33 + "&rsLogId" + href4;
                    }
                    else{
                        href_url = href_url2[0] + "page=" + href_ur33 + "&searchSessionId" + href4;
                    }
                    window.location.replace(href_url);
                    salesN_prospect_functions.sales_person_add_all();
                }
                // if ((sessionStorage.getItem("noofpages") >= 2 && sessionStorage.getItem("noofpages") <= consts.pages)) {
                //     // href_ur3 = parseInt(href_ur3[0]) + 1;
                //     var regex = /page=(\d)/;
                //     var found = href_url1.match(regex);
                //    // console.log(found);
                //     var num = Number(found[1]);
                //     var temp = found[0].split("=");
                //     num = num + 1;
                //     var str = temp[0] + "=" + num;
                //     let count_value = sessionStorage.getItem("visitednoofpages");
                //     salesN_prospect_functions.count = parseInt(count_value) + 1;
                //     sessionStorage.setItem("visitednoofpages", salesN_prospect_functions.count);
                //     // href_url = href_url2[0] + "page=" + href_ur3;
                //     href_url = href_url1.replace(regex, str);
                //     window.location.replace(href_url);
                //     salesN_prospect_functions.sales_person_add_all();
                // }
            }
        }
    },

    sales_person_add_all:function () {
        $(".pages").remove();
        $(".pagination_class").remove();
        $(".sales_navi_all_prospect").remove();
        $('#results-list').parent().prepend(consts.success_button_ui.add_all_loader);
        $('#processing').css('margin-top', '10px').css('margin-bottom', '10px');
        prospect_visit.salesN_visited_cmp_for_prosp =[];
        // company_visit.company_data =[];
        salesN_prospect_functions.person_arr=[];
        for (let d = 0; d < salesN_prospect_functions.pageProspect_arr1.length; d++) {
            let id = "#" + salesN_prospect_functions.pageProspect_arr1[d].p_id;
            // let purl= salesN_prospect_functions.pageProspect_arr1[d].url;
            var name ='';
            try {
                name = salesN_prospect_functions.pageProspect_arr1[d].title;
            }
            catch(err){
                name ='';
            }
            // let flag='sales_n_add_all';
            let cmp_url = salesN_prospect_functions.pageProspect_arr1[d].company_linkedinurl;
            let cmp_name = salesN_prospect_functions.pageProspect_arr1[d].current_company;
            let english = /^[- &+(),A-Za-z0-9 _]*$/;
            if (salesN_prospect_functions.pageProspect_arr1[d]['added_person'] === false && (english.test(name) || name.includes("@") || name.includes("&"))) {
                if(cmp_url!== undefined ) {
                    $(id).removeClass("indi_add2").css("background", "").removeAttr("style").html(consts.success_button_ui.loader);
                }
                else if(cmp_name){
                    if (english.test(cmp_name) && (english.test(name) || name.includes("@") || name.includes("&"))) {
                        if(name || name.includes("@")){
                            $(id).removeClass("indi_add2").css("background", "").removeAttr("style").html(consts.success_button_ui.loader);
                        }
                        else{
                            $(id).removeAttr("style").css("background", "").html(consts.person_added.error_msg).attr('title', 'Sorry, we can not add this Person.');
                        }
                    }
                    else{
                        $(id).removeClass("indi_add2").html(consts.person_added.error_msg).attr('title',"Sorry, we can not add this Person as company is not linked.");
                    }
                }
                else if(cmp_url ===undefined){
                    if(!cmp_name)
                    $(id).removeClass("indi_add2").html(consts.person_added.error_msg).attr('title',"Company is not linked");
                }
            }
            else{
                $(id).removeClass("indi_add2").html(consts.person_added.error_msg).attr('title',"Sorry, we can not add this Person");
            }
        }

       salesN_prospect_functions.slowEach( salesN_prospect_functions.pageProspect_arr1, 3000, function( element, d ) {
            var oname,fname,lname;
            let english = /^[- &+(),A-Za-z0-9 _]*$/;
            let id = "#" + salesN_prospect_functions.pageProspect_arr1[d].p_id;
            let purl= salesN_prospect_functions.pageProspect_arr1[d].url;
            let name = salesN_prospect_functions.pageProspect_arr1[d].title;
            let c_name = salesN_prospect_functions.pageProspect_arr1[d].current_company;
            if (name.includes(",")){
               oname = name.split(',');
               fname = oname[0].replace(/'/g, '');
               lname = oname[1].replace(/'/g, '');
            }
            else {
               oname = name.split(' ');
               fname = oname[0].replace(/'/g, '');
               oname.shift();
               lname = oname.join(' ').replace(/'/g, '');
            }
            let flag='sales_n_add_all';
            let cmp_url = salesN_prospect_functions.pageProspect_arr1[d].company_linkedinurl;
            let prospect_data = {
               flag: 'sales_nav',
               current_url: purl,
               firstName: fname,
               lastName: lname,
               fullName: name,
               designation: salesN_prospect_functions.pageProspect_arr1[d].current_position,
               industry: '',
               profileLink: '',
               publicLink: '',
               twitter_profile: '',
               personal_website: '',
               memberId: '',
               description: '',
               skills: '',
               location: salesN_prospect_functions.pageProspect_arr1[d].location,
               educationsView: {},
               company: salesN_prospect_functions.pageProspect_arr1[d].current_company,
               companyUrl: cmp_url,
               expe: {},
               linkedinUrl: '',
               public_identifier: '',
               salesN_url: purl,
           };
            if (english.test(name) || name || name.includes("@")) {
                if (english.test(c_name) || english.test(c_name[0]) || cmp_url) {
                    prospect_visit.visit_salesN_prospect(purl, name, id, flag, cmp_url, prospect_data);
                }
            }
        });
    },

    slowEach:function (array, interval, callback ) {
        if( ! array.length ) return;
        var i = 0;
        next();
        function next() {
            if( callback( array[i], i ) !== false ) {
                if( ++i < array.length ) {
                    setTimeout( next, interval );
                }
            }
        }
    },

    prospect_add :[],
    cll:[],
    prospect_data:{},
    scrap_single__prospect_data: function (that,check_flag) {
        let fname,lname,oname,c_url,position,location,company;
        let name = $(".profile-topcard-person-entity__name").text().trim();
        let purl = window.location.href;
        purl= purl.split("?")[0];
        let parent = $(that).parent();
        if(name.includes("LinkedIn Member")) {
            $(parent).removeAttr("style").css("background", "").html(consts.person_added.error_msg).attr('title',"Sorry, we cannot add Linkedin member");
        }
        else {
            $(parent).removeAttr("style").css("background", "").html(consts.success_button_ui.loader);
        }
        salesN_prospect_functions.person_arr=[];
        prospect_visit.salesN_visited_cmp_for_prosp =[];
        company_visit.company_data =[];
        if($(".profile-topcard__current-positions div.profile-topcard__summary-position:eq( 0 ) span a.li-i18n-linkto.inverse-link-on-a-light-background:eq( 0 )").length>0) {
            company = $(".profile-topcard__current-positions div.profile-topcard__summary-position:eq( 0 ) span a.li-i18n-linkto.inverse-link-on-a-light-background:eq( 0 )").text();
        }
        else{
            company = $(".profile-topcard__current-positions div.profile-topcard__summary-position:eq( 0 ) span:eq( 2 )").text();
        }
        position = $(".profile-topcard__summary-position-title:eq( 0 )").text().trim();
        position = position + " at "+ company;
        location = $(".profile-topcard__location-data").text().trim();
        try {
            c_url = $(".profile-topcard__current-positions div.profile-topcard__summary-position:eq( 0 ) a").attr('href');
            c_url = c_url.replace("/sales", "");
            c_url = "https://www.linkedin.com" + c_url;
        }
        catch(err){
            c_url='';
        }
        let english = /^[- &+(),A-Za-z0-9 _]*$/;
        if (name.includes(",")){
            oname = name.split(',');
            fname = oname[0].replace(/'/g, '');
            lname = oname[1].replace(/'/g, '');
        }
        else {
            oname = name.split(' ');
            fname = oname[0].replace(/'/g, '');
            oname.shift();
            lname = oname.join(' ').replace(/'/g, '');
        }
        salesN_prospect_functions.prospect_data = {
            flag: 'sales_nav',
            current_url: purl,
            firstName: fname,
            lastName: lname,
            fullName: name,
            fullname:name,
            designation: position,
            industry: '',
            profileLink: '',
            publicLink: '',
            twitter_profile: '',
            personal_website: '',
            memberId: '',
            description: '',
            skills: '',
            location: location,
            educationsView: {},
            company: company,
            companyUrl: c_url,
            expe: {},
            linkedinUrl: '',
            public_identifier: '',
            salesN_url: purl,
            company_linkedinurl:[c_url],
        };
        if(check_flag!=='check_prosp') {
            if ((c_url || english.test(company)) && english.test(name) || name || name.includes("@")) {
                prospect_visit.visit_salesN_prospect(purl, name, parent, '', c_url, salesN_prospect_functions.prospect_data);
            }
            else {
                $(parent).removeAttr("style").css("background", "").html(consts.person_added.error_msg).attr('title', "Sorry, we cannot add this Person");
            }
        }
    },

    checkProspect:function(){
        $(".single_indi_add").each(function () {
            let that = this;
            let cll = prospect_functions.cll;
            let parent = $(that).parent();
            var name = salesN_prospect_functions.prospect_data.fullName;
            if(name.includes("LinkedIn Member")) {
                $(parent).removeAttr("style").css("background", "").html(consts.person_added.error_msg).attr('title',"Sorry, we cannot add Linkedin member");
            }
            else {
                $(parent).removeAttr("style").css("background", "").html(consts.success_button_ui.loader);
                let data = {};
                data['flag'] = 'salesnav_check';
                data['user_id'] = user_d.user_id;
                data['all_prosp_d'] = salesN_prospect_functions.prospect_data;
                data['cmp_data'] = company_visit.company_data;
                data['islinkedin'] = true;
                $.ajax({
                    dataType: "json",
                    url: consts.linkedin_url + "extension/check_prospect",
                    type: "post",
                    contentType: "application/json",
                    data: JSON.stringify(data)
                }).success(function (response) {
                    if (response.res == "true") {
                        $(parent).html(consts.person_added.success).attr('title', 'Added');
                    }
                    else if (response.res == false || response.res == "false") {
                        salesN_prospect_functions.show_single_person();
                    }
                    else if (response.res == 'srf') {
                        $(parent).html(consts.person_added.error_msg).attr('title', 'Sorry, This person has not mentioned his Present company in his experience. So we are not able to add this person.');
                    }
                    else {
                        salesN_prospect_functions.show_single_person();
                    }
                    consts.oldURL = window.location.href;
                });
            }
        });
    },


   send_data_to_sales_backend: function (purl, parent) {
        // if (salesN_prospect_functions.visit_url_array.indexOf(purl) === -1) {
            salesN_prospect_functions.visit_url_array.push(purl);
            var p_data = [];
            var data = {};
            data['flag'] = 'sales_nav';
            var list = $('#list_options').find(":selected").val();
            for (var j=0; j< salesN_prospect_functions.person_arr.length;j++){
                var u = salesN_prospect_functions.person_arr[j]['current_url'];
                // u = 'https://www.linkedin.com/in/'+u+"/";
                if (u === purl){
                    p_data.push(salesN_prospect_functions.person_arr[j]);
                }
            }
            data['user_id'] = user_d.user_id;
            data['all_prosp_d'] = p_data;
            data['cmp_data'] = company_visit.company_data;
            data['islinkedin'] = true;
            //print("dtaaaaaaaaaaaaaaa",data);
            // if(salesN_prospect_functions.person_arr.length > 0) {
            if(data['all_prosp_d'].length !=0) {
                $.ajax({
                    url: consts.linkedin_url + "extension/salesn_add_one_prospect",
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(data)
                }).success(function (response) {
                    // console.log("in res of personsss",response)
                    var res_list = Object.keys(response['pers_mid']);
                    var a = JSON.parse(JSON.stringify(salesN_prospect_functions.person_arr));
                    consts.credits = response.track_res.credit;
                    $("#processing").remove();
                    for (var i = 0; i < a.length; i++) {
                        var c_url = a[i]['current_url'].split('?')[0];
                        if (response.company != "" && Object.keys(response.pers_mid).length!==0) {
                            if (res_list.indexOf(c_url) > -1) {
                                if (!response.track_res.blacklisted) {
                                    // if (response['pers'][a[i]['public_identifier']].length > 0) {
                                    $(parent).removeClass("indi_add2").html(consts.success_button_ui.success).attr("title", "Contact added for " + response.company);
                                    for (var j = 0; j < salesN_prospect_functions.pageProspect_arr1.length; j++) {
                                        if (salesN_prospect_functions.pageProspect_arr1[j]['url'] === purl) {
                                            salesN_prospect_functions.pageProspect_arr1[j]['added_person'] = true;
                                            break;
                                        }
                                    }
                                    break;
                                }
                                else if (response.track_res.blacklisted && response.track_res.blacklisted.length != 0) {
                                    alert(response.track_res.blacklisted[0] + " is Blacklisted, Please remove the Company from blacklist to add this Contact.");
                                    $(parent).css('height', '29px').removeClass("indi_add2").html(consts.person_added.blacklisted).attr("title", response.track_res.blacklisted[0] + " is blacklisted, Please remove the Company from blacklist to add this Contact.");
                                    break;
                                }
                                else if (response.track_res.blacklisted && response.track_res.blacklisted.length == 0 && response.company == '' && response.track_res.flag == 'credit_over') {
                                    $(parent).css('height', '29px').removeClass("indi_add2").html(consts.person_added.error_msg).attr("title", "Sorry, You don't have enough credits to add this Person's Company");
                                    break;
                                }
                                else if (response.track_res.blacklisted && response.track_res.blacklisted.length == 0 && response.company != '' && response.track_res.flag == "true") {
                                    if (response['pers_mid'][c_url].length > 0) {
                                        $(parent).html(consts.success_button_ui.success).attr("title", "Contact added for " + response.company);
                                        for (var j = 0; j < salesN_prospect_functions.pageProspect_arr1.length; j++) {
                                            if (salesN_prospect_functions.pageProspect_arr1[j]['url'] === purl) {
                                                salesN_prospect_functions.pageProspect_arr1[j]['added_person'] = true;
                                                break;
                                            }
                                        }
                                        break;
                                    }
                                }
                                else {
                                    $(parent).html(consts.success_button_ui.error_msg);
                                }
                            }
                        }else if (response.res_msg === 'add_company_for_prospects_flag'){
                          $(parent).css('padding', '0px 4px 25px').html(consts.person_added.singlep_success);
                       }
                        else if(response.company==='' &&  Object.keys(response.pers_mid).length===0){
                            $(parent).html(consts.person_added.error_msg).attr("title", "Sorry, Company is not linked.");
                        }
                        else if (response.company !=='' && Object.keys(response.pers_mid).length === 0) {
                            $(parent).removeClass("indi_add2").html(consts.success_button_ui.error_msg);
                        }
                        else if(response.company==='' && response.count===0 && response.track_res.flag == 'credit_over'){
                            $(parent).removeClass("indi_add2").html(consts.person_added.error_msg).attr('title',"Sorry, You don't have enough credits to add this Person's Company.");
                            // alert("Sorry, You don't have enough credits to add this Person's Company.")
                        }
                        else if (response.company === '') {
                            if (response.track_res.blacklisted.length != 0) {
                                // alert(response.track_res.blacklisted[0] + " is Blacklisted, Please remove the Company from blacklist to add this Contact.");
                                $(parent).css('height', '29px').removeClass("indi_add2").html(consts.person_added.blacklisted).attr("title", response.track_res.blacklisted[0] + " is blacklisted, Please remove the Company from blacklist to add this Contact.");
                            }
                            break;
                        }
                        else {
                            $('#loader1').remove();
                            $(parent).html(consts.person_added.error_msg);
                        }
                    }
                })
            }
            else{
                $(parent).html(consts.person_added.error_msg).attr("title","Sorry, its Linkedin member.");
            }
     }
};
