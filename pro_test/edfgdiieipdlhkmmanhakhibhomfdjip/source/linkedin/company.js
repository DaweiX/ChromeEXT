var link_flag =false;
var company_functions = {
    c_data:{},
    show_company_button:function(){
        $('.add_comp_btn').remove();
        $(".org-top-card__left-col").css('max-width','680px');
        var single_add = "<button class='add_comp_btn' id='addbutton'  title='Add to Clodura'><div class='indi_add'  style='vertical-align: top;font-size: 16px;'><img src='"+ chrome.extension.getURL('/img/Add.png') +"' style='width: 17px;height: 18px;vertical-align:text-bottom'/><span style='padding-left:3px'>Add</span></div></button><span style='font-size: 13px;display:inline;margin-left:5px' id='demo'></span>";
        // var pa = "<span style='font-size: 13px' id='demo'></span>";
        if($('.inline-block.org-top-card-actions').length > 0){
            $('.inline-block.org-top-card-actions').parent().append('');
            $('.inline-block.org-top-card-actions').parent().append(single_add);
        }
        else if($('.display-flex.justify-space-between.pl5.pt3.pr4.pb4 .org-top-card__left-col .mt4 .inline-block.v-align-top').length>0){
            $('.display-flex.justify-space-between.pl5.pt3.pr4.pb4 .org-top-card__left-col .mt4 .inline-block.v-align-top').parent().append('');
            $('.display-flex.justify-space-between.pl5.pt3.pr4.pb4 .org-top-card__left-col .mt4 .inline-block.v-align-top').parent().append(single_add);
        }
        else if($('.org-top-card-primary-actions.inline-block.mt4.mr2.ember-view').length >0){
            // var el = document.querySelector('.org-top-card__left-col');
            // el.innerHTML = el.innerHTML.replace(/&nbsp;/g,'');
            $('.org-top-card-primary-actions.inline-block.mt4.mr2.ember-view').parent().append('');
            $('.org-top-card-primary-actions.inline-block.mt4.mr2.ember-view').parent().append(single_add);
        }
        else if( $('.org-top-card-summary__info-item.org-top-card-summary__industry').length > 0){
            $('.org-top-card-summary__info-item.org-top-card-summary__industry').parent().append('');
            $('.org-top-card-summary__info-item.org-top-card-summary__industry').parent().append(single_add);
        }
        else{
            $('.org-top-card-summary__info-item.org-top-card-summary__headquarter').parent().append('');
            $('.org-top-card-summary__info-item.org-top-card-summary__headquarter').parent().append(single_add);
        }
    },

    show_comp_button:function(){
        $('.add_all_comp_btn').remove();
        $("#processing").remove();
        var all_props_add = "<button class='add_all_comp_btn' title='Add All to Clodura'><img  src='" + chrome.extension.getURL('/img/person_add.jpeg') + "' width='17px' height='20px' style='vertical-align: top;'/><span style='padding-left: 4px;font-size: 15px;'>Add All</span></button>";
        if ($('.search-results__container').length > 0) {
            $('.search-results__container').parent().append('');
            $('.search-results__container').parent().prepend(all_props_add);
        }
        else if ($('.blended-srp-results-js').length > 0) {
            $('.blended-srp-results-js').parent().append('');
            $('.blended-srp-results-js').parent().prepend(all_props_add);
        }
    },

    show_all_companies:function(){
        var all_data= $(".search-results__primary-cluster div.search-results__cluster-content ul.results-list li");
        if (all_data.length==0){
            all_data= $(".search-results .blended-srp-results-js ul.search-results__list li");
        }
        var i = 0;
        collective_data = [];
        var data = {};
        current_company = '';
        $.each(all_data, function (i, el) {
            var ul = "https://www.linkedin.com";
            var u = $(el).find("a.search-result__result-link").attr('href');
            var id ='';
            try{
                id = u.replace("/company/","").replace("/","");
            }
            catch (err) {
            }

            var url = ul + u;
            var single_add = "<button class='add_one_btn' title='Add to Clodura' style='padding: 1px 7px 25px 9px;'><div class='indi_add'  id='"+id+"' data-url='"+ url +"' ><img src='"+ chrome.extension.getURL('/img/Add.png') +"' style='width: 20px;height: 20px;margin-top: 2px;'/></div></button>";
            $(el).find('.search-result__image-wrapper').parent().prepend(single_add);
        })
    },

    scrapeGuid : function () {
        var lllink_byid='';
        var lllink_byid4='';
        var picture_url= null;
        var loc = null;
        var comp_name = null;
        let indus = null;
        let urlname = null;
        try{
            lllink_byid =$('.inline-block.org-top-card-actions a')[0].href;
            var lllink_byid1 = lllink_byid.split("?");
            var lllink_byid2 = lllink_byid1[1].split("&");
            var lllink_byid3 = lllink_byid2[0].split("=");
            lllink_byid4 = "https://www.linkedin.com/company/"+lllink_byid3[1];
           
        }
        catch(err){
            if($(".feed-shared-actor__title").length>0) {
                lllink_byid4 = $('.feed-shared-actor__title span').attr('data-entity-hovercard-id');
            }
            else{
                try {
                    lllink_byid4 = $(".feed-shared-actor__meta a")[0].href;
                    lllink_byid4 = lllink_byid4.split("?")[0];
                }
                catch(err){

                }
            }
         }
        sessionStorage.setItem("urlbyguid", lllink_byid4);
    },

    scrapIt : function () {
        company_functions.c_data={};
        let industry= '';
        try{
            var companyname='';
            if($(".org-top-card-module__name").length>0){
                companyname=$('.org-top-card-module__name')[0].textContent.trim();}
            else {
                companyname=$("h1.org-top-card-summary__title.t-24.t-black.truncate").text().trim();
            }
            var companylogotitle='';
            if($(".org-top-card-module__container").length>0){
                companylogotitle = $(".org-top-card-module__container img").attr("src");
            }
            else{
                try {
                    companylogotitle = $(".org-top-card-primary-content__logo-container img")[0].src;
                }catch(err){}
            }
            try{
                if($(".company-industries").length > 0){
                    industry = $(".company-industries")[0].textContent.trim();
                }
                // else if($( "dl dt:nth-child(5):contains('Industry')")){
                //     industry=  $( "dl dt:nth-child(5):contains('Industry')" )
                //         .next().text().trim();
                //     console.log("in iff11",industry)
                // }
                else{
                    industry=  $( "dl dt:nth-child(5):contains('Industry')")
                             .next().text().trim();
                    if (industry =='') {
                        industry = $("dl dt:nth-child(3):contains('Industry')")
                            .next().text().trim();
                    }
                }
            }
            catch(err){industry ='';}
            var companysize ='';
            try {
                if ($(".org-about-company-module__company-staff-count-range").length>0) {
                    companysize = $(".org-about-company-module__company-staff-count-range")[0].textContent.trim();
                }
                // else if($( "dl dt:nth-child(7):contains('Company size')")){
                //     companysize=  $( "dl dt:nth-child(7):contains('Company size')" )
                //         .next().text().trim();
                // }
                else{
                    companysize=  $( "dl dt:nth-child(7):contains('Company size')" )
                        .next().text().trim();
                    if (companysize =='') {
                        companysize = $("dl dt:nth-child(5):contains('Company size')")
                            .next().text().trim();
                    }
                }
            }
            catch(err){}

            var no_of_emp='';
            try{
                if($(".org-company-employees-snackbar__see-all-employees-link").length>0){
                    var str = $(".org-company-employees-snackbar__see-all-employees-link").text();
                    no_of_emp = str.replace( /\D+/g, '');
                }
                else{no_of_emp='';}
            }
            catch(err){no_of_emp='';}

            var type = "";
            var specialties ='';
            try{
                if($(".org-about-company-module__specialities").length>0){
                    specialties = $(".org-about-company-module__specialities").text().trim();
                }
                // else if($( "dl dt:nth-child(15):contains('Specialties')" )){
                //     specialties= $( "dl dt:nth-child(15):contains('Specialties')" )
                //         .next().text().trim();
                // }
                else{
                    specialties= $( "dl dt:nth-child(13):contains('Specialties')" )
                        .next().text().trim();
                    if(specialties == ''){
                        specialties= $( "dl dt:nth-child(15):contains('Specialties')" )
                            .next().text().trim();
                    }
                    if (specialties == ''){
                        specialties= $( "dl dt:nth-child(11):contains('Specialties')" )
                            .next().text().trim();
                    }
                }
            }
            catch(err){}

            var website ='';
            if($("div.org-about-company-module__company-page-url").length>0){
                if ($("div.org-about-company-module__company-page-url a")[0]){
                    website = $("div.org-about-company-module__company-page-url a")[0].href;
                }
                if (!website && $("div.org-about-company-module__company-page-url a")[0]){
                    website = $("div.org-about-company-module__company-page-url a")[0].text.trim();
                }
            }
            else{
                try {
                    var web_title= $(".org-page-details__definition-term.t-14.t-black.t-bold:first").text();
                    if (web_title.trim() =='Website') {
                        website = $(".org-page-details__definition-text.t-14.t-black--light.t-normal:first").text().trim();
                    }
                }
                catch(err){}
            }
            sessionStorage.setItem("website",website);
            var companytype='';
            try{
                if($(".org-about-company-module__company-type").length>0){
                    companytype = $(".org-about-company-module__company-type").text().trim();
                }
                // else if($( "dl dt:nth-child(11):contains('Type')" )){
                //     companytype = $( "dl dt:nth-child(11):contains('Type')" )
                //         .next().text().trim()
                // }
                else{
                    companytype= $( "dl dt:nth-child(9):contains('Type')" )
                        .next().text().trim();
                    if(companytype ==''){
                        companytype = $( "dl dt:nth-child(11):contains('Type')")
                            .next().text().trim()
                    }
                    if (companytype == ''){
                        companytype= $( "dl dt:nth-child(7):contains('Type')" )
                            .next().text().trim();
                    }
                }
            }catch(err){}
            var founded='';
            try{
                if($(".org-about-company-module__founded").length>0){
                    founded = $(".org-about-company-module__founded").text().trim();}
                // else if($( "dl dt:nth-child(13):contains('Founded')" )){
                //     founded = $( "dl dt:nth-child(13):contains('Founded')" )
                //         .next().text().trim();
                // }
                else{
                    founded= $( "dl dt:nth-child(11):contains('Founded')" )
                        .next().text().trim();
                    if(founded == ''){
                        founded = $( "dl dt:nth-child(13):contains('Founded')" )
                            .next().text().trim();
                    }
                    if (founded == ''){
                        founded= $( "dl dt:nth-child(9):contains('Founded')" )
                            .next().text().trim();
                    }
                }
            }catch(err){}

            var description='';
            try{
                if($(".org-about-us-organization-description__text").length>0){
                    description = $(".org-about-us-organization-description__text").text();}
                else{description='';}
            }catch(err){}

            var cont='';
            try {
                if ($(".org-top-card-module__location").length>0) {
                    cont = $(".org-top-card-module__location").textContent;
                }
                else{cont='';}
            }catch(err){}

            var headquarters='';
            try {
                if ($(".org-top-card-summary__info-item.org-top-card-summary__headquarter").length>0) {
                    headquarters = $(".org-top-card-summary__info-item.org-top-card-summary__headquarter").text().trim();
                }
                else{
                    headquarters= $( "dl dt:nth-child(7):contains('Headquarters')" )
                        .next().text().trim();
                }
            }catch(err){headquarters='';}

            var matches = $("body").html().match(/companyId=(\d+)/);
            if (!matches) {
                matches = window.location.href.match(/\/recruiter\/company\/(\d+)/);
            }
            var linkedinurlbycname = window.location.href;

        }
        catch(err) {
            console.log("");
        }

        var that = $(this);
        var urlguid='';
        try {
            urlguid = sessionStorage.getItem("urlbyguid");
        }catch(err){
            urlguid = null;
        }
        var web = sessionStorage.getItem("website");
        company_functions.c_data["urlbycname"] = linkedinurlbycname;
        company_functions.c_data["companylogo"]= companylogotitle;
        company_functions.c_data["name"]= companyname;
        company_functions.c_data["industry"] = industry;
        company_functions.c_data["size"]= companysize;
        company_functions.c_data["specialities"]=specialties;
        company_functions.c_data["website"]=web;
        company_functions.c_data["companytype"]=companytype;
        company_functions.c_data["founded"]=founded;
        company_functions.c_data["description"]=description;
        company_functions.c_data["headquarters"]=headquarters;
        company_functions.c_data["no_of_emp"]= no_of_emp;
        company_functions.c_data["urlbyguid"] = urlguid;
       // console.log("aaaaaa",company_functions.c_data);
    },

    checkCompany : function() {
        // company_functions.scrapIt();
        // console.log("in check comp")
        $(".add_comp_btn .indi_add").each(function () {
            // debugger;
            var website ='';
            website = sessionStorage.getItem("website");
            var linkedinurlbycname = window.location.href;
            var title = $(this).attr("data-name");
            var credits = $('.credits');
            var that = $(this);
            var parent = $(that).parent();
            $(parent).removeAttr("style").css("background", "").html(consts.success_button_ui.loader);
            var ur = window.location.href;
            // console.log("in check", company_functions.c_data);
            setTimeout(function() {
                if (website != '' && ur.includes('/about/')) {
                    company_functions.c_data['user_id'] = user_d.user_id;
                    company_functions.c_data['flag'] = "single_comp";
                    // setTimeout(function() {
                    $.ajax({
                        dataType: "json",
                        url: consts.linkedin_url + 'extension/check',
                        type: "post",
                        mode:'no-cors',
                        contentType: "application/json",
                        data: JSON.stringify(company_functions.c_data)
                    }).success(function (response) {
                        // console.log("resssssssss",response);
                        if (response.res == true || response.res == "true") {
                            // ('#loader1').remove();
                            $(parent).html(consts.company_button_ui.success).css('top', '12px');								// $(credits).html(response.credits);
                        }
                        else if (response.res == false || response.res == "false") {
                            company_functions.show_company_button();
                        }
                        consts.oldURL = window.location.href;
                    });
                    // },1000);
                }
                else if(ur.includes('/about/') && website==''){
                    $(parent).html(consts.person_added.error_msg).css('top', '12px').attr("title","Sorry, Website is not linked, So we can not add this Company");

                }
            },1000);
        });
    },


    single_company_add:function (that,flag) {
        var window_url= window.location.href;
        var data = '';
        var selected = [];
        var parent = $(that).parent();
        var credits = consts.credits;
        var list = $('#list_options').find(":selected").val();

        if (!(window_url.includes("/about/"))) {
            var txt = "Please visit  'About'  page to add this Company.";
            // window.location.href= window_url+"about/";
            // company_functions.scrapIt();
            // company_functions.checkCompany();
            document.getElementById("demo").innerHTML = txt;
        }
        else {
            try{
                document.getElementById("demo").remove();
            }
            catch(err){};
            var url = consts.linkedin_url ;
            $(parent).removeAttr("style").css("background", "").html(consts.success_button_ui.loader);
            company_functions.scrapIt();
            if(flag === 'salesN'){
                salesN_company_add.c_data['user_id'] = user_d.user_id ;
                salesN_company_add.c_data['islinkedin'] = true;
                salesN_company_add.c_data['flag'] = 'salesN';
                data = JSON.stringify(salesN_company_add.c_data);
            }
            else {
                company_functions.c_data['user_id'] = user_d.user_id;
                company_functions.c_data['islinkedin'] = true;
                // company_functions.c_data['user'] = api_key;
                company_functions.c_data['flag'] = 'linkedin_company';
                data = JSON.stringify(company_functions.c_data);
            }
            $.ajax({
                dataType: "json",
                url: url + "extension/add_company",
                type: "post",
                contentType: "application/json",
                // headers: {
                //     Authorization: 'Bearer ' + token
                // },
                data: data
            })
                .success(function (response) {
                    // console.log("ressss",response)
                    // consts.credits = response.credits;
                    // if (consts.credits > 0) {
                    if (response != null) {
                        if (response.res == 'failure') {
                            $(parent).html(consts.company_button_ui.error_msg);
                        } else if (response.res === 'success') {
                            $(parent).html(consts.company_button_ui.success).css('top', '12px');
                        } else if (response.res === 'blacklisted') {
                            $(parent).html(consts.company_button_ui.blacklisted);
                            alert("Sorry, this Company is blacklisted, Please remove the Company from blacklist to add in your Radar.");
                        } else if (response.credits <= 0) {
                            alert("Sorry, You don't have enough credits to add this Company.");
                            $(parent).html(consts.company_button_ui.error_msg);
                        }
                    } else {
                        $(parent).html(consts.company_button_ui.error_msg);
                    }

                })
                .fail(function (response) {
                    if (response.responseText == "failure") {
                        $(parent).html("<span class='error_message'>Re-login</span>");
                    }
                });
        }


        if(flag === 'salesN'){
            $(parent).css('height','40px');
        }
    },

    add_single_from_add_all:function(that){
        let purl = $(that).attr("data-url");
        let parent = $(that).parent();
        let id ="#"+$(that).attr("id");
        $(id).removeAttr("style").css("background", "").html(consts.success_button_ui.loader);
        let flag_comp = 'addcomp_single_list';
        company_visit.company_data=[];
        company_visit.sales_nav_cmp_visit(purl,parent,id,flag_comp);
    },

    addcomp_call_backend:function(parent,id,flag){
        let data = {};
        for(let i=0 ;i< company_visit.company_data.length;i++) {
            let comp_data = company_visit.company_data[i]
            comp_data['flag'] = 'linkedin_company';
            comp_data['user_id'] = user_d.user_id;
            comp_data['islinkedin'] = true;
            data = comp_data;
            if (data.hasOwnProperty("website")) {
                $.ajax({
                    dataType: "json",
                    url: consts.linkedin_url + "extension/add_company",
                    type: "post",
                    contentType: "application/json",
                    data: JSON.stringify(data)
                })
                    .success(function (response) {
                        if (response != null) {
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
                            else if (response.credits <= 0) {
                                if (id===false && flag !=='addcomp_single_list') {
                                    alert("Sorry, You don't have enough credits to add this Company.");
                                    id = true;
                                }
                                else if (flag ==='addcomp_single_list'){
                                    alert("Sorry, You don't have enough credits to add this Company.");
                                }
                                $(parent).html(consts.person_added.error_msg).attr("title","Sorry, You don't have enough credits to add this Company.");
                            }
                        }
                        else {
                            $(parent).html(consts.company_button_ui.error_msg);
                        }
                    })
                    .fail(function (response) {
                        if (response.responseText == "UnauthorizedError: jwt expired") {
                            $(parent).html("<span class='error_message'>Re-login</span>");
                        }
                        else $(parent).html("<span class='error_message' style='font-size: small'>Error</span>");
                    })
            }
            else {
                $(parent).html(consts.company_button_ui.error_msg).attr('title', 'Sorry, website is not found for this Company, So we can not add it.');
            }
        }
    },

    comps_url_list:[],
    comps_visited_urls:[],
    add_all_companies_li:function(){
        if($('ul.results-list').length>0){
            var all_data = $("ul.results-list li.search-result.search-result__occluded-item");
        }else{
            var all_data = $("ul.search-results__list li.search-result.search-result__occluded-item");
        }
        let i = 0;
        let b_flag= false;
        $(".add_all_comp_btn").remove().parent().prepend(consts.success_button_ui.add_all_loader);
        $('#processing').css('margin-top','10px').css('margin-bottom','10px');
        $.each(all_data, function (i, el) {
            let id = '';
            try {
                let ur = $(el).find("a.search-result__result-link").attr('href');
                let u = ur.replace("/company/", "").replace("/", "");
                let url = "https://www.linkedin.com" + ur;
                if (url.indexOf('undefined') === -1) {
                    id = "#" + u;
                    company_functions.comps_url_list.push({'url': u, 'id': id});
                    $(id).removeClass("indi_add").css("background", "").removeAttr("style").html(consts.success_button_ui.loader);
                }
            }
            catch (err) {

            }
        });
        company_functions.slowEach(company_functions.comps_url_list, 2000, function( element, d ) {
            company_visit.company_data=[];
            let s_url = "https://www.linkedin.com/company/"+company_functions.comps_url_list[d]['url']+"/";
            if (company_functions.comps_visited_urls.indexOf(s_url) === -1) {
                company_functions.comps_visited_urls.push(s_url);
                let comp_flag = 'add_all_comp_li';
                company_visit.sales_nav_cmp_visit(s_url,b_flag,company_functions.comps_url_list[d]['id'],comp_flag);
                b_flag = true;
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

    check_comp:function(cm_data,parent,url,flag){
        $.ajax({
            dataType: "json",
            url: consts.linkedin_url + 'extension/check',
            type: "post",
            contentType: "application/json",
            data: JSON.stringify(cm_data)
        }).success(function (response) {
            if (response.res == true || response.res == "true") {
                if(flag ==='sales_n_add_all'){
                    salesN_prospect_functions.send_data_to_sales_backend(url, parent);
                }
                else {
                    prospect_functions.send_data_to_cbackend(url, parent);
                }
            }
            else if (response.res == false || response.res == "false") {
                if(flag ==='sales_n_add_all'){
                    company_visit.sales_nav_cmp_visit(response.linkedin_url, parent, url, flag);
                }
                else {
                    company_visit.sales_nav_cmp_visit(response.linkedin_url, parent, url, flag);
                }
            }
        });
    }
};
