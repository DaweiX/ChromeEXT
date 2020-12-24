
var prospect_functions = {
    person_arr:[],
    p_data:{},
    cll:[],
    count:0,
    show_button:function(){
        $('.add_all_btn').remove();
        $("#processing").remove();
        let ll_array =[];
        let all_data= $(".search-results__primary-cluster div.search-results__cluster-content ul.results-list li");
        if (all_data.length==0){
            all_data= $(".search-results .blended-srp-results-js ul.search-results__list li");
        }
        $.each(all_data, function (i, el) {
            let t = $(el).find("span.actor-name").text();
            if (t != "LinkedIn Member") {
                ll_array.push('Linkedin member')
            }
        });
        let all_props_add = "<button id='add_all_prosp' class='add_all_btn' title='Add All to Clodura'><img  src='" + chrome.extension.getURL('/img/person_add.jpeg') + "' width='17px' height='20px' style='vertical-align: top;'/><span style='padding-left: 4px;font-size: 15px;'>Add All</span></button>";
        if (ll_array.length>0) {
            if ($('.search-results__container').length > 0) {
                $('.search-results__container').parent().prepend('');
                $('.search-results__container').parent().prepend(all_props_add);
            }
            else if ($('.blended-srp-results-js').length > 0) {
                $('.blended-srp-results-js').parent().prepend('');
                $('.blended-srp-results-js').parent().prepend(all_props_add);
            }
        }
     },
    pageProspect_arr1:[],
    linkedin_visited_per_url:[],
    All_prospcet: function(){
        let all_data= $(".search-results__primary-cluster div.search-results__cluster-content ul.results-list li");
        if (all_data.length==0){
            all_data= $(".search-results .blended-srp-results-js ul.search-results__list li");
        }
        let i = 0;
        let collective_data = [];
        let prospect_data = {};
        let current_company = '';
        $.each(all_data, function (i, el) {
            let t = $(el).find("span.actor-name").text();
            if (t.includes(",")){
                t = t.split(',')[0];
            }
            var title = t.replace(/ *\([^)]*\) */g, " ").replace(/[\.(),':-]+/g, "");
            if (title != "LinkedIn Member" ) {
                let ul = "https://www.linkedin.com";
                let u = $(el).find("a.search-result__result-link").attr('href');
                let url = ul + u;
                //           var ll_pid= url.split("/")[4];
                let current_location = $(el).find("p.subline-level-2").text();
                let current_position = $(el).find("p.search-result__snippets").text();
                let description = $(el).find("p.subline-level-1").text();
                if (current_position) {
                    current_position = current_position.split(":")[1];
                    if (current_position.includes(" at ")) {
                        current_company = current_position.split(" at ")[1];
                    }
                    else if (current_position.includes(" @ ")){
                        current_company = description.split(" @ ")[1];
                    }
                    else{
                        if(current_position.includes(",")) {
                            current_company = current_position.split(",")[1];
                        }
                        current_company= current_company.split('.').join("");
                    }
                }
                else {
                    if (description.includes(" at ")) {
                        current_company = description.split(" at ")[1];
                    }
                    else if (description.includes(" @ ")){
                        current_company = description.split(" @ ")[1];
                    }
                }
                if (current_company == undefined) {
                    current_company = '';
                }
                let company_linkedinurl = '';
                let expe = '';
                let details_str = '';
                // var cll = '';
                let spli_ui_id = url.split('/');
                let ui_id = spli_ui_id[spli_ui_id.length - 2];
                if(ui_id.includes("%")) {
                    ui_id = title.replace(/[^\x00-\x7F]/g, "");
                    ui_id =ui_id.split(" ")
                    ui_id =ui_id[0]+"-"+ui_id[1];
                }
                else{
                    ui_id = ui_id;
                }
                prospect_data = {
                    'url': url,
                    'll_pid': '',
                    'title': title,
                    'location': current_location,
                    'current_company': current_company,
                    'description': description,
                    'current_position': current_position,
                    'details_str': details_str,
                    'picture': '',
                    'previous': '',
                    'industry': '',
                    'company_linkedinurl': company_linkedinurl,
                    'expe': expe,
                    'company_ll_name': '',
                    'added_person':false,
                    'ui_id':ui_id
                };
                if (title != '') {
                    collective_data.push(prospect_data);
                }
                let single_add = "<button class='add_one_btn' title='Add to Clodura' style='padding: 1px 7px 25px 9px;'><div class='indi_add1' id='"+ ui_id +"' data-url='"+ url +"' ><img src='"+ chrome.extension.getURL('/img/Add.png') +"' style='width: 20px;height: 20px;margin-top: 2px;'/></div></button>";
                $(el).find('.search-result__image-wrapper').parent().prepend(single_add);
            }
            else {
                let single_add = "<div style='padding: 1px 4px 25px 5px;margin-left: 40px;'></div>";
                $(el).find('.search-result__image-wrapper').parent().prepend(single_add);
            }
        });
        // all_prosp_add.pageProspect2(collective_data);
        prospect_functions.pageProspect_arr1 = collective_data;
    },

    show_prospect_button:function(){
        let url = window.location.href;
        if(url.includes("?")){
            url= url.split("?");
            url= url[0];
        }
        $('.add_prosp_btn').remove();
        let single_add = "<button class='add_prosp_btn' title='Add to Clodura'><div class='indi_add'  style='vertical-align: top;font-size: 16px;' data-url='"+ url +"'><img src='"+ chrome.extension.getURL('/img/Add.png') +"' style='width: 17px;height: 18px;vertical-align:text-bottom'/><span style='padding-left:8px'>Add</span></div></button>";
        if($('.pv-top-card--list.inline-flex').length > 0){
            $('.pv-top-card--list.inline-flex li').parent().append('');
            $('.pv-top-card--list.inline-flex li').parent().append(single_add);
        }
        else if($('.pv-top-card-v3--list.inline-flex').length>0){
            $('.pv-top-card-v3--list.inline-flex li').parent().append(single_add);
        }
        else{
            $('.pv-top-card-v3--list.mt1 .pv-top-card-v3__distance-badge').parent().append(single_add);
        }
    },
    pageProspect_arr:[],
    scrapItProspect : function(){
        let url = window.location.href.replace(/\/$/, "");
        let ll_pid= url.split("/")[4];
        let title ='';
        if($(".pv-top-card-section__name").length >0 ) {
            title = $(".pv-top-card-section__name").text();
        }
        else if($('.pv-top-card--list.inline-flex').length>0){
            title = $('.pv-top-card--list.inline-flex li:first').text().trim();
        }
        else{
            title = $(".pv-top-card-v3--list.mt1 li:first").text();
        }
        let current_company="";
        let currcomp= $(".pv-top-card-section__body .pv-top-card-section__information .pv-top-card-section__experience .pv-top-card-section__company");
        if(currcomp.length>0 && currcomp){
            current_company = $(currcomp).text();
        }
        else {
            current_company = $(".current-position header h5 span strong a");
            if(current_company.length>0){
                current_company = $(current_company).first().text();
            }
            else if($('.pv-entity__company-summary-info').length>0){
                current_company = $(".pv-entity__company-summary-info h3 span:nth-child(2)").text().trim();
            }
            else if($("#overview-summary-current a[name=company]").length>0){
                current_company = $("#overview-summary-current a[name=company]").first().text();
            }
            else if($(".pv-profile-section .experience-section").length>0){
                current_company = $(".pv-profile-section .experience-section ul li:first .pv-entity__secondary-title").text();
            }

            else current_company = "NA";
        }
        let current_position="";
        let curr_position = $(".pv-top-card-section__body .pv-top-card-section__information h2");
        if(curr_position.length > 0 ){
          //  console.log("in ifff",curr_position)
            current_position= $(".pv-top-card-section__body .pv-top-card-section__information h2").text();
            current_position.trim();
            current_position=current_position.split(" at ")[0];
            current_position.trim();
        }
        else{
           // console.log("in elsee")
            curr_position = $(".current-position header h4 a");
            if(curr_position.length > 0){
                current_position = $(current_position).first().text();
            }
            else if($(".pv-top-card-section__headline").length>0){
                current_position = $("h2.pv-top-card-section__headline").text().trim();
            }
            else if($('.flex-1.mr5').length>0){
                current_position = $('.flex-1.mr5 h2').text().trim();
            }
            else current_position = "NA";
        }
        //console.log("curr ",current_position)
        let current_location='';
        if($(".pv-top-card-section__location").length>0) {
            current_location = $(".pv-top-card-section__location").text().trim();
        }
        else{
            current_location = $(".pv-top-card--list.pv-top-card--list-bullet.mt1 li:first").text().trim();
        }
        let profile_pic = "";
        if ($(".presence-entity.pv-top-card-section__image.presence-entity--size-9").length > 0) {
            profile_pic = $(".presence-entity.pv-top-card-section__image.presence-entity--size-9 img")[0].src;
        }
        else if($('.presence-entity.pv-top-card-section__image.presence-entity--size-9').length > 0){
            profile_pic = $(".presence-entity.pv-top-card-section__image.presence-entity--size-9 img")[0].src;
        }
        else{
            if ($(".profile-picture img") && $(".profile-picture img").length > 0) {
                profile_pic = $(".profile-picture img")[0].src;
            }
        }

        let prevcompany = "";
        if ($("#overview-summary-past")) {
            prevcompany = $("#overview-summary-past li").text();
        }
        let industry = "";
        if ($("#demographics .industry")) {
            industry = $("#demographics .industry").text();
        }
        let company_ll_name ='';
        try{
            company_ll_name= $(".profile-detail .pv-oc .background-details .pv-profile-section .pv-profile-section ul.pv-profile-section__section-info li:first a .pv-entity__summary-info h4 .pv-entity__secondary-title").text();
        }
        catch(err){company_ll_name='';}
        let member_id='';
        let salesn_url='';
        try{
            salesn_url=$(".pv-top-card-v2-section__actions.mt2.display-flex .pv-top-card-v2-section__actions a:first").attr('href');
            member_id = salesn_url.split(",");
            member_id = member_id[0].split("/profile/");
            member_id= member_id[1];
        }
        catch(err){
            salesn_url ='';
            member_id ='';
        }
        let description= null;
        try {
            description = $(".pv-top-card-section__summary").text();
            if (description.length <= 0) {
                description = $(".pv-recent-activity-article-v2__preview-text").text().trim();
            }
        }
        catch (err) {

        }
        let profile_position=null;
        try {
            profile_position = $(".pv-top-card-v2-section__info h2.pv-top-card-section__headline").text().trim();
            if (profile_position.length <= 0) {
                profile_position = current_position;
            }
        }
        catch(err){
        }
        $.when(prospect_functions.myTimer()).then(function(data){
            prospect_functions.final_data = data;
            let designation = prospect_functions.final_data.designation;
            prospect_functions.cll = prospect_functions.final_data.cll;
            prospect_functions.p_data = {
                "url": url,
                "public_identifier": ll_pid,
                "fullname": title,
                "firstName":'',
                "lastName":'',
                "flag":'linkedin_single',
                "location": current_location,
                "company": current_company,
                "current_position": current_position,
                "picture": profile_pic,
                "previous": prevcompany,
                "industryName": industry,
                "islinkedin":true,
                "description": description,
                "company_linkedinurl": prospect_functions.final_data.cll,
                "expe": prospect_functions.final_data.experience,
                "skills":null,
                "company_ll_name": company_ll_name,
                "cll": prospect_functions.final_data.cll,
                'memberId': member_id,
                'salesN_url': salesn_url,
                'designation': current_position,
                "twitter_profile":null,
                "personal_website":null,
                "occupation":null,
                "profile_position":profile_position
            };
            if (prospect_functions.cll.length > 0) {
                let str = JSON.stringify(prospect_functions.p_data);
                prospect_functions.pageProspect_arr.push(str);
            }
        }, function (error){
            console.log("");
        });
      },

    final_data:{},
    myTimer : function() {
        var defer = jQuery.Deferred();
        let designation = [];
        let expe=[];
        let cll=[];
        let cll2=[];
        let start_date ='';
        let desgi ='';
        let exp_dict={};
        let s_i='';
        let comp_name,c_url,comp_url;
        // try {
            if ($(".pv-profile-section.experience-section").length >0) {
                if($(".pv-profile-section.experience-section ul.pv-profile-section__section-info.section-info.pv-profile-section__section-info--has-no-more").length > 0) {
                    s_i = $(".pv-profile-section.experience-section ul.pv-profile-section__section-info.section-info.pv-profile-section__section-info--has-no-more li");
                }
                else{
                    s_i = $(".pv-profile-section.experience-section ul.pv-profile-section__section-info.section-info.pv-profile-section__section-info--has-more li");
                }
                let date_array =[];
                $.each(s_i,function(j, s_i1) {
                    comp_url = $(s_i1).find("a[data-control-name = 'background_details_company']").attr('href');
                    if($('.pv-entity__company-summary-info').length>0) {
                        comp_name = $(s_i1).find(".pv-entity__company-summary-info h3 span:eq(1)").text().trim();
                    }
                    else{
                        comp_name= $(s_i1).find("a[data-control-name = 'background_details_company'] .pv-entity__summary-info.pv-entity__summary-info--v2 h4:first-child span:eq(1)").text();
                    }
                    c_url = "https://www.linkedin.com" + comp_url;
                    // let check_class = $(s_i1).find(".pv-entity__position-group.mt2");
                    if($(s_i1).find(".pv-entity__position-group.mt2")) {
                        let sd = $(s_i1).find(".pv-entity__position-group.mt2 li");
                        $.each(sd, function (i, sd1) {
                            start_date = $(sd1).find(".pv-entity__date-range.inline-block").text().trim().replace("Dates Employed", "");
                            if(start_date === ''){
                                start_date = $(sd1).find(".pv-entity__date-range").text().trim().replace("Dates Employed", "");
                            }
                            if($('.pv-entity__summary-info-v2').length >0 ){
//                                desgi = $(sd1).find(".pv-entity__summary-info-v2.pv-entity__summary-info--v2.pv-entity__summary-info-margin-top h3").text().trim().replace("Title", "");
                                desgi = $(sd1).find(".pv-entity__summary-info-margin-top h3").text().trim().replace("Title", "");
                            }
                            else {
                                desgi = $(sd1).find(".pv-entity__summary-info.pv-entity__summary-info--v2.pv-entity__summary-info-margin-top h3").text().trim().replace("Title", "");
                            }
                            //console.log("desgiii",desgi);
                            if (start_date.includes("Present") && desgi) {
                                designation.push(desgi + " at " + comp_name);
                                if (cll.indexOf(c_url) == -1) {
                                    cll.push(c_url.slice(0, -1));
                                }
                            }
                            let date = start_date.trim().split("–");
                            exp_dict = {};
                            exp_dict['companyUrl'] = c_url.slice(0, -1);
                            exp_dict['company'] = comp_name;
                            exp_dict['designation'] = desgi.trim().replace("Title", "");
                            exp_dict['startDate'] = date[0];
                            exp_dict['duration'] = '';
                            date_array.push(date[1]);

                            if(date[1]) {
                                exp_dict['endDate'] = date[1];
                            }
                            else{
                                exp_dict['endDate'] = '';
                            }
                            // if(expe[0]['designation']!=exp_dict['designation']) {
                            let found = expe.some(function (el) {
                                return el.designation === desgi.trim().replace("Title", "");
                            });
                            if (!found) {
                                if(date_array.length > 1 && date_array.indexOf("Present") !== -1){
                                    expe.push(exp_dict);
                                }
                                else if (date_array.length <=1  && date_array.indexOf("Present") === -1){
                                    expe.push(exp_dict);
                                }
                            }
                        });
                    }
                });
                prospect_functions.final_data = {'designation':designation,'experience':expe,'cll':cll};
                defer.resolve(prospect_functions.final_data);
            }
        // }
        // catch(err){}

        try{
            let dt = $("a[data-control-name='background_details_company']").
            filter(".profile-detail .pv-oc .background-details .pv-profile-section.pv-profile-section--reorder-enabled.background-section.artdeco-container-card.ember-view .pv-profile-section.experience-section.ember-view ul.pv-profile-section__section-info li.pv-profile-section__sortable-card-item.pv-position-entity.ember-view")["prevObject"];
            let i=0;
            $.each(dt,function(i, el) {
                let desg = $(el).find(".pv-entity__summary-info h3").text().replace(/'/g,'').replace(/"/g, '');
                let exp_text = $(el).find(".pv-entity__summary-info h4.pv-entity__date-range span:eq(1)").text();
                let date = exp_text.trim().split("–");
                let duration = $(el).find(".pv-entity__summary-info h4:eq(2)").text().replace(/,/g,' ');
                let company_name = $(el).find(".pv-entity__summary-info h4:eq(0) span.pv-entity__secondary-title").text().replace("'",' ');
                if(exp_text.includes("Present")){  //&& el.href.includes("linkedin.com/company/")
                    designation.push(desg + " at " + company_name);
                    let el1 = el.href.replace(/\/$/, "");
                    cll.push(el1);
                }
                else{
                    cll2.push("not present");
                }
                if(desg && exp_text) {
                    exp_dict={};
                    exp_dict['designation']= desg.trim();
                    exp_dict['startDate'] = date[0];
                    if(date[1]) {
                        exp_dict['endDate'] = date[1];
                    }
                    else{
                        exp_dict['endDate'] = '';
                    }
                    exp_dict['duration']= duration.trim().replace("Employment Duration","");
                    exp_dict['companyUrl'] = el.href.replace(/\/$/, "") ;
                    exp_dict['company']= company_name;
                    expe.push(exp_dict);
                    // expe.push('{"designation":"' + desg + '","startDate":"' + exp_text + '","duration":"' + duration + '","companyUrl":"' + el.href.replace(/\/$/, "") + '","company":"' + company_name + '"}');
                }
            });
            prospect_functions.final_data={'designation':designation,'experience':expe,'cll':cll,'cll2':cll2};
            defer.resolve(prospect_functions.final_data);
        }
        catch(err){
        }
        return defer.promise();
    },


    checkProspect : function() {
        $(".indi_add").each(function () {
            let that = this;
            let cll = prospect_functions.cll;
            let parent = $(that).parent();
            $(parent).removeAttr("style").css("background", "").html(consts.success_button_ui.loader);
            let data = {};
            data['flag']='linkedin_single';
            data['user_id'] = user_d.user_id;
            data['all_prosp_d'] = prospect_functions.p_data;
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
                    $(parent).html(consts.person_added.success).attr('title','Added');
                }
                else if (response.res == false || response.res == "false") {
                    //prospect_functions.add_single_prospect(that,'add_p');
                    prospect_functions.show_prospect_button();
                }
                else if (response.res == 'srf') {
                    $(parent).html(consts.person_added.error_msg).attr('title','Sorry, This person has not mentioned his Present company in his experience. So we are not able to add this person.');
                }
                else{
                    prospect_functions.show_prospect_button();
                }
                consts.oldURL = window.location.href;
            });
        });
    },

    add_single_prospect:function(that,flag_prospAdd){
        let cll = prospect_functions.cll;
        let parent = $(that).parent();
        $(parent).removeAttr("style").css("background", "").html(consts.success_button_ui.loader);
        // for (let i =0; i < cll.length; i++){
        if (cll.length > 0) {
            if (cll[0].includes("/company/")) {
                company_visit.sales_nav_cmp_visit((cll[0] + "/"), '', parent, 'add_single_prosp');
            }
        }
        else{
            $(parent).removeAttr("style").css("background", "").html(consts.person_added.error_msg).attr('title','Sorry, This person has not mentioned his Present company in his experience. So we are not able to add this person.');
        }
        // }
        setTimeout(function(){
            if (cll.length > 0) {
                prospect_functions.send_data_tobackend_singleprops(parent, flag_prospAdd)
            }
        },5000);
    },

    send_data_tobackend_singleprops:function(parent,flag_prospAdd){
        let data={};
        let p_data=[];
        prospect_functions.p_data['flag']='linkedin_single';
        p_data.push(prospect_functions.p_data);
        data['flag'] = 'linkedin';
        data['user_id'] = user_d.user_id;
        data['all_prosp_d'] = p_data;
        data['cmp_data'] = company_visit.company_data;
        data['islinkedin'] = true;
        data['flag_prospAdd']= flag_prospAdd;
        $.ajax({
            dataType: "json",
            url: consts.linkedin_url + "extension/add_one_prospect",
            contentType: "application/json",
            type: "post",
            data: JSON.stringify(data)
        }).success(function (response) {
            // $("#processing").remove();
            var res_list = Object.keys(response['pers']);
            var a = JSON.parse(JSON.stringify(p_data));
            if (Object.keys(response['pers']).length != 0) {
                consts.credits = response.track_res.credit;
                for (var i = 0; i < a.length; i++) {
                    if (res_list.indexOf(a[i]['public_identifier']) >= 0) {
                        if (response.track_res.flag == 'credit_over') {
                            $('loader1').remove();
                            // alert("Sorry, You don't have enough credits to add this Person's Company.");
                            $(parent).css('padding', '0px 4px 25px').html(consts.person_added.error_msg).attr("title", "Sorry, You don't have enough credits to add this Person's Company.");
                        }
                        else if (response.track_res.blacklisted && response.track_res.blacklisted.length != 0) {
                            $(parent).removeClass("indi_add1").css('padding', '1px 5px 27px 5px').html(consts.person_added.blacklisted).attr('title', response.track_res.blacklisted + " is blacklisted, Please remove the Company from blacklist to add this Contact.");
                        }
                        else if (response.pers) {
                            $('loader1').remove();
                            $(parent).html(consts.company_button_ui.success).attr('title', "Contact added for " + response.company);
                        }
                        else if (response.track_res.blacklisted.length == 0 && Object.keys(response['pers']).length > 0) {
                            $('loader1').remove();
                            $(parent).html(consts.person_added.singlep_success).attr('title', "Contact added for " + response.company);
                        }
                        else {
                            $(parent).css('padding', '0px 4px 25px').html(consts.person_added.error_msg);
                        }
                    }else if (response.res_msg === 'add_company_for_prospects_flag'){
                        $(parent).css('padding', '0px 4px 25px').html(consts.person_added.singlep_success);
                    }
                    else if (response.res_msg === 'no_cmp_found') {
                        $(parent).css('padding', '0px 4px 25px').html(consts.person_added.error_msg).attr("title", "Sorry, company is not linked.");
                    }
                    else {
                        $(parent).css('padding', '0px 4px 25px').html(consts.person_added.error_msg).attr("title", "Sorry, either company is not linked or website is not linked.");
                    }
                }
            }else if (response.res_msg === 'add_company_for_prospects_flag'){
                $(parent).css('padding', '0px 4px 25px').html(consts.person_added.singlep_success);
            }
            else if (Object.keys(response['pers']).length != 0 && response.res_msg === 'no_cmp_found') {
                $(parent).css('padding', '0px 4px 25px').html(consts.person_added.error_msg).attr("title", "Sorry, company is not linked.");
            }
            else {
                $(parent).css('padding', '0px 4px 25px').html(consts.person_added.error_msg).attr("title", "Sorry, either company is not linked or website is not linked.");
            }
        });
    },

    single_person_add_all:function (that) {

        var purl= $(that).attr("data-url");
        var parent = $(that).parent();
        var salesn_url='';
        var interval = 2000;
        $(parent).removeAttr("style").css("background", "").html(consts.success_button_ui.loader);
        // prospect_visit.visited_cmp_for_prosp =[];
        // company_visit.company_data =[];
        var s_person_add_flag ='s_person_add_flag';
        setTimeout(prospect_visit.visit_prospect(purl,salesn_url, parent,s_person_add_flag), interval);
        // prospect_visit.visit_prospect(purl,salesn_url, parent,s_person_add_flag);
    },

    send_data_to_cbackend: function (purl, parent) {
        var p_data =[];
        var data = {};
        data['flag']='linkedin';
        var list = $('#list_options').find(":selected").val();
        for (var j=0; j< prospect_functions.person_arr.length;j++){
            var u = prospect_functions.person_arr[j]['public_identifier']
            u = 'https://www.linkedin.com/in/'+u+"/";
            if (u === purl && (p_data.indexOf(prospect_functions.person_arr[j])===-1)){
                p_data.push(prospect_functions.person_arr[j]);
            }
        }
            data['user_id'] = user_d.user_id;
            data['all_prosp_d'] = p_data;
            data['cmp_data'] = company_visit.company_data;
            data['islinkedin'] = true;
            // setTimeout(function(){
            $.ajax({
                dataType: "json",
                url: consts.linkedin_url + "extension/add_one_prospect",
                type: "post",
                contentType: "application/json",
                data: JSON.stringify(data)
            }).success(function (response) {
                $("#processing").remove();
                var res_list = Object.keys(response['pers']);
                var a = JSON.parse(JSON.stringify(p_data));
                if (Object.keys(response['pers']).length != 0) {
                    consts.credits = response.track_res.credit;
                    for (var i = 0; i < a.length; i++) {
                        if (res_list.indexOf(a[i]['public_identifier']) >= 0) {
                            if (response.track_res.added == "" && response.track_res.flag == 'credit_over') {
                                $('loader1').remove();
                                // alert("Sorry, You don't have enough credits to add this Person's Company.");
                                $(parent).css('padding', '0px 4px 25px').html(consts.person_added.error_msg).attr("title", "Sorry, You don't have enough credits to add this Person's Company.");
                            }
                            else if (!response.track_res.blacklisted) {
                                $('loader1').remove();
                                $(parent).html(consts.person_added.singlep_success).attr('title', "Contact added for " + response.company);
                            }
                            else if (response.track_res.blacklisted.length == 0 && Object.keys(response['pers']).length > 0) {
                                $('loader1').remove();
                                $(parent).html(consts.person_added.singlep_success).attr('title', "Contact added for " + response.company);
                            }
                            else if (response.track_res.blacklisted && response.track_res.blacklisted.length != 0) {
                                $(parent).removeClass("indi_add1").css('padding', '1px 5px 27px 5px').html(consts.person_added.blacklisted).attr('title', response.track_res.blacklisted + " is blacklisted, Please remove the Company from blacklist to add this Contact.");
                            }
                            else {
                                $(parent).css('padding', '0px 4px 25px').html(consts.person_added.error_msg);
                            }
                        }
                        else if (response.res_msg === 'add_company_for_prospects_flag'){
                            $(parent).css('padding', '0px 4px 25px').html(consts.person_added.singlep_success);
                        }
                        else if (response.res_msg === 'no_cmp_found') {
                            $(parent).css('padding', '0px 4px 25px').html(consts.person_added.error_msg).attr("title", "Sorry, company is not linked.");
                        }
                        else {
                            $(parent).css('padding', '0px 4px 25px').html(consts.person_added.error_msg).attr("title", "Sorry, company is not linked.");
                        }
                    }
                }else if (response.res_msg === 'add_company_for_prospects_flag'){
                    $(parent).css('padding', '0px 4px 25px').html(consts.person_added.singlep_success);
                }
                else if (Object.keys(response['pers']).length != 0 && response.res_msg === 'no_cmp_found') {
                    $(parent).css('padding', '0px 4px 25px').html(consts.person_added.error_msg).attr("title", "Sorry, company is not linked.");
                }
                else {
                    $(parent).css('padding', '0px 4px 25px').html(consts.person_added.error_msg).attr("title", "Sorry, company is not linked.");
                }
            })
    },

    linkedin_person_add_all:function () {
        prospect_functions.search_result_cnt = 0;
        prospect_functions.person_arr = [];
        company_visit.company_data=[];
        $(".add_all_btn").remove();
        $('.search-results__container').parent().prepend(consts.success_button_ui.add_all_loader);
        var add_all_flag ='add_all_prosp_flag';
        var id ='';
        for (var d=0 ; d< prospect_functions.pageProspect_arr1.length; d++) {
            if (prospect_functions.pageProspect_arr1[d].ui_id.includes("%")) {
                id = prospect_functions.pageProspect_arr1[d].title.replace(/[^\x00-\x7F]/g, "");
                id = id.split(" ");
                id = id[0] + "-" + id[1];
                id = "#" + prospect_functions.pageProspect_arr1[d].title;
            }
            else {
                id = "#" + prospect_functions.pageProspect_arr1[d].ui_id;
            }
            $(id).removeClass(".add_butn1").removeAttr("style").html(consts.success_button_ui.loader);
        }

        prospect_functions.slowEach( prospect_functions.pageProspect_arr1, 10000, function( element, d ) {
            if(prospect_functions.pageProspect_arr1[d].ui_id.includes("%")) {
                id = prospect_functions.pageProspect_arr1[d].title.replace(/[^\x00-\x7F]/g, "");
                id = id.split(" ");
                id = id[0]+"-"+id[1];
                id = "#" + prospect_functions.pageProspect_arr1[d].title;
                prospect_visit.visit_prospect(prospect_functions.pageProspect_arr1[d].url,'', id,add_all_flag);
            }
            else{
                id = "#" + prospect_functions.pageProspect_arr1[d].ui_id;
                prospect_visit.visit_prospect(prospect_functions.pageProspect_arr1[d].url,'', id,add_all_flag);
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

    scrap_prospect_data : function (callback) {
        var curl = document.location.href;
        linkedin_path = 'https://www.linkedin.com/search/results/';
        if (curl.indexOf(linkedin_path) > -1) {
            var b = $('a').attr('data-control-name', 'search_srp_result');
            var c = [];
            for (var i = 0; i < b.length; i++) {
                try {
                    if (b[i].href === undefined) {
                        continue
                    }
                } catch (e) {
                    // console.log('error in reading search result')
                }
                if (b[i].href.indexOf("https://www.linkedin.com/in/") === 0) {
                    c.push(b[i].href);

                    var url = b[i].href;
                    if ($.inArray(url, prospect_functions.linkedin_visited_per_url) === -1) {
                        prospect_functions.linkedin_visited_per_url.push(url);
                        prospect_visit.visit_prospect(url,'');
                    }
                }
            }
        }
        else{
            prospect_functions.search_result_cnt = prospect_functions.search_result_cnt+1;
        }
        callback();
    },

    all_prospect_addition : function (data) {
        var credits = $('.credits');
        var names =[];
        var that = $(this);
        var parent = $(that).parent();
        $.ajax({
            dataType: "json",
            url: consts.linkedin_url + "extension/add_all_prospect",
            type: "post",
            contentType: "application/json",
            data: JSON.stringify(data)
        })
            .success(function (response) {
                var count=0;
                var res_list = Object.keys(response['pers']);
                $("#processing").remove();
                var count=0;
                var a = JSON.parse(JSON.stringify(prospect_functions.pageProspect_arr1));
                $(credits).html(response.track_res.credit);
                for (var i = 0; i < a.length; i++) {
                    var result = /[^a-z0-9\\%]/g;
                    if(a[i]["ui_id"].includes("%")) {
                        id = a[i].title.replace(/[^\x00-\x7F]/g, "");
                        id = id.split(" ");
                        id = id[0]+"-"+id[1];
                        id = "#" + a[i]["title"];
                    }
                    else{
                        id = "#" + a[i]["ui_id"];
                    }
                    if (a[i].added_person === false) {
                        // var a_title = a[i].title.replace(/[^\x00-\x7F]/g, "");
                        // a_title = a_title.replace("Dr ", "").replace("dr ", "").replace(".", "").replace("Er ", "").replace("Mr ", "").trim();
                        if (res_list.indexOf(a[i]['ui_id']) > -1) {
                            if(response.track_res.added=="" && response.track_res.flag=='credit_over' && Object.keys(response['pers']).length == 0){
                                // alert("Sorry, You dont have enough credits to add all Person's Company.");
                                $('#loader1').remove();
                                $(id).removeClass("indi_add1").css('padding', '0px 0px 28px 0px').html(consts.person_added.error_msg).attr('title', "Sorry, You dont have enough credits to add all Person's Company.");
                            }
                            else if (!response.track_res.blacklisted && response['pers'][a[i]['ui_id']][0]!=undefined && response['pers'][a[i]['ui_id']][0]) {
                                a[i].added_person = true;
                                $('#loader1').remove();
                                $(id).removeClass("indi_add1").removeAttr("style").html(consts.person_added.singlep_success).attr('title', "Contact added for " + response['pers'][a[i]['ui_id']][0]);
                            }
                            else if (response.track_res.blacklisted && response.track_res.blacklisted.length == 0 && response['pers'][a[i]['ui_id']][0]!=undefined && response['pers'][a[i]['ui_id']][0]) {
                                a[i].added_person = true;
                                $('#loader1').remove();
                                $(id).removeClass("indi_add1").removeAttr("style").html(consts.person_added.singlep_success).attr('title', "Contact added for " + response['pers'][a[i]['ui_id']][0]);
                            }
                            else if (response.track_res.blacklisted && response.track_res.blacklisted.length != 0) {
                                $('#loader1').remove();
                                $(id).parent().css('padding', '1px 5px 27px 5px');
                                $(id).removeClass("indi_add1").html(consts.person_added.blacklisted).attr('title', response['pers'][a[i]['ui_id']][0] + ' is blacklisted, Please remove the Company from blacklist to add this Contact.');
                            }

                            else {
                                $('#loader1').remove();
                                $(id).removeClass("indi_add1").css('padding', '0px 0px 28px 0px').html(consts.person_added.error_msg).attr('title', "Please try to add by visiting page.")
                            }
                        }
                        else {
                            $('#loader1').remove();
                            $(id).removeClass("indi_add1").css('padding', '0px 0px 28px 0px').html(consts.person_added.error_msg).attr('title', "Please try to add by visiting page.")
                        }
                    }
                    else {
                        $('#loader1').remove();
                        $(id).removeClass("indi_add1").css('padding', '0px 0px 28px 0px').html(consts.person_added.error_msg).attr('title', "Please try to add again by visiting profile page.");
                    }
                }
            })
            .fail(function (response) {

            })
    },
};
