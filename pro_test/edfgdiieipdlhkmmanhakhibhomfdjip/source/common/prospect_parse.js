
var prospect_visit = {

    visited_cmp_for_prosp:[],
    salesN_visited_cmp_for_prosp :[],
    visited_prosp_url:[],
    visit_prospect : function (url, salesn_url, parent,flag) {
        var list_cmp =[];
        $.get(url,function (data,status) {
            var h, j, l, inc, obj, parsed = {},Position = [],skills=[];
            var DateRange=[],Date=[],expe=[],cur,expe_d={},Profile=[],mini_profile='';
            parsed.flag='linkedin';
            h = $("<div />", {
                html: data
            });
            j = h.find("code:contains('patentView')").html();
            obj = JSON.parse(j);
            parsed.salesN_url = salesn_url;
            parsed.memberId='';
            parsed.description='';
            parsed.skills='';
            parsed.location='';
            parsed.designation='';
            parsed.twitter_profile ='';
            parsed.personal_website='';
            parsed.memberId='';
            parsed.industryName='';
            inc = obj.included;
            l = inc.length;
            for (var i = l - 1; i >= 0; i--) {
                var url_split = url.split("/");
                var publicIdentifier = url_split[4];
                // parsed.salesN_url=salesn_url;
                // parsed.member_id='';
                if(inc[i].$type === 'com.linkedin.voyager.identity.shared.MiniProfile' && inc[i].publicIdentifier === publicIdentifier){
                    parsed.firstName = inc[i].firstName;
                    var l_name = inc[i].lastName;
                    var t = l_name;
                    if (t.includes(",")){
                        t = t.split(',')[0];
                    }
                    var title = t.replace(/ *\([^)]*\) */g, " ").replace(/[\.(),:-]+/g, "");
                    title= title.replace(/[^\x00-\x7F]/g, "");
                    parsed.lastName = title;
                    parsed.public_identifier = inc[i].publicIdentifier;
                    parsed.occupation = inc[i].occupation;
                    var mem_id = inc[i].objectUrn;
                    var split_mem_urn_id = mem_id.split(':');
                    if(split_mem_urn_id.length > 0) {
                        parsed.memberId = split_mem_urn_id[split_mem_urn_id.length - 1];
                    }
                    mini_profile = inc[i].entityUrn;
                }
                if(inc[i].$type === 'com.linkedin.voyager.identity.profile.Profile'){
                    Profile.push(inc[i]);
                }
                if(inc[i].$type === 'com.linkedin.voyager.identity.profile.Skill'){
                    skills.push(inc[i].name);
                }
                if(inc[i].$type === "com.linkedin.voyager.identity.profile.Position"){
                    Position.push(inc[i]);
                }
                try{
                    parsed.designation =Position[0].title;
                }
                catch(err){}
                if(inc[i].$type=== "com.linkedin.voyager.common.DateRange"){
                    DateRange.push(inc[i]);
                }
                if(inc[i].$type=== "com.linkedin.common.Date"){
                    Date.push(inc[i]);
                }
            }
            if(skills.length > 0){
                parsed.skills = skills.join(',');
            }
            if(Profile.length > 0){
                for (var k = 0; k < Profile.length; k++){
                    if(mini_profile === Profile[k].miniProfile){
                        parsed.location = Profile[k].locationName || '';
                        parsed.description = Profile[k].summary || '';
                        parsed.industryName = Profile[k].industryName || '';
                    }
                }
            }
            for (var k = 0; k < Position.length; k++){
                expe_d ={};
                expe_d.companyUrl='';
                if (Position[k].companyName && Position[k].$type === 'com.linkedin.voyager.identity.profile.Position') {
                    expe_d.title = Position[k].title;
                    expe_d.company = Position[k].companyName;
                    expe_d.designation = Position[k].title;
                    if (Position[k].companyUrn && Position[k].companyUrn.split(':').length > 0) {
                        splitUrn = Position[k].companyUrn.split(':');
                        expe_d.companyUrl = 'https://www.linkedin.com/company/' + splitUrn[splitUrn.length - 1];
                    }
                }
                var timePeriod = Position[k].timePeriod;
                var startDate = '',endDate ='';
                for(var dr =0; dr < DateRange.length; dr++){
                    var month_nm='';
                    if(timePeriod === DateRange[dr].$id){
                        for(var dt = 0;dt < Date.length;dt++){
                            if(DateRange[dr].endDate === Date[dt].$id){
                                month_nm = consts.month_names[Date[dt].month];
                                endDate = month_nm + " " + Date[dt].year;
                            }
                            if(DateRange[dr].startDate === Date[dt].$id){
                                month_nm = consts.month_names[Date[dt].month];
                                startDate = month_nm + " " + Date[dt].year;
                            }
                        }
                    }
                    if(startDate !== '' && endDate !== ''){
                        break;
                    }
                    else if(endDate === ''){
                        endDate = 'Present';
                    }
                }
                expe_d.startDate = startDate;
                expe_d.endDate = endDate;
                var cmp_url='';
                if (expe_d.companyUrl){
                    cmp_url = expe_d.companyUrl + "/";
                    list_cmp.push({"cmp_url": cmp_url, "endDate": endDate,'comp_name':expe_d.company});
                }

                expe.push(expe_d)
            }
            parsed.expe = expe;
            var cm_data={};
            for (let j=0 ; j< list_cmp.length; j++) {
                if (prospect_visit.visited_cmp_for_prosp.indexOf(list_cmp[j]['cmp_url']) === -1) {
                    if (list_cmp[j]['endDate'] == "Present") {
                        if (list_cmp[j]['cmp_url'] && ((list_cmp[j]['cmp_url'].includes('/search/results/') === false)))  {
                            cm_data['user_id'] = user_d.user_id;
                            cm_data['flag'] = "check_comp";
                            cm_data['linkedin_url']= list_cmp[j]['cmp_url'];
                            cm_data['comp_name'] = list_cmp[j]['comp_name'];
                            // company_functions.check_comp(cm_data,parent,url,flag);
                            $.ajax({
                                dataType: "json",
                                url: consts.linkedin_url + 'extension/check',
                                type: "post",
                                contentType: "application/json",
                                data: JSON.stringify(cm_data)
                            }).success(function (response) {
                                if (response.res == true || response.res == "true") {
                                    // prospect_functions.send_data_to_cbackend(url, parent)
                                }
                                else if (response.res == false || response.res == "false") {
                                    let flag_p ='add_all_prosp_flag';
                                    company_visit.sales_nav_cmp_visit(response.linkedin_url, parent, url, flag_p);
                                }
                            });
                        }
                        prospect_visit.visited_cmp_for_prosp.push(list_cmp[j]['cmp_url']);
                    }
                }
            }
            if (parsed.firstName && parsed.lastName){
                // prospect_visit.visited_prosp_url.push(url);
                if (prospect_visit.visited_prosp_url.indexOf(url) === -1) {
                    prospect_visit.visited_prosp_url.push(url);
                    prospect_functions.person_arr.push(parsed);
                }
            }
            if (flag === 's_person_add_flag'){
                setTimeout(function(){
                    prospect_functions.send_data_to_cbackend(url, parent)
                },3000);
            }
            else if(flag=== 'add_all_prosp_flag'){
                prospect_functions.send_data_to_cbackend(url, parent)
            }
        })
    },

    check_link : function (list_cmp) {
        company_visit.sales_nav_cmp_visit(list_cmp,'','','');
    },


    visit_salesN_prospect:function(url,name,parent,fl,c_url,prospect_data){
        salesN_prospect_functions.person_arr.push(prospect_data);
        let cm_data = {};
        cm_data['user_id'] = user_d.user_id;
        cm_data['flag'] = "check_comp";
        cm_data['comps_flag'] ='prospect_company';
        try {
            if (prospect_data.companyUrl!== undefined) {
                if(prospect_data.companyUrl.includes("?")){
                    prospect_data.companyUrl = prospect_data.companyUrl.split("?")[0];
                }
                cm_data['linkedin_url'] = prospect_data.companyUrl;
                cm_data['comp_name'] = prospect_data.company;
                $.ajax({
                    dataType: "json",
                    url: consts.linkedin_url + 'extension/check',
                    type: "post",
                    contentType: "application/json",
                    data: JSON.stringify(cm_data)
                }).success(function (response) {
                   // console.log("ressssssss111111111111111",response);
                    if (response.res == true || response.res == "true") {
                        salesN_prospect_functions.send_data_to_sales_backend(url, parent);
                    }
                    else if (response.res == false || response.res == "false") {
                        let c_url = prospect_data.companyUrl+"/";
                        if(c_url.includes('/search/')){
                            salesN_prospect_functions.send_data_to_sales_backend(url, parent);
                            // $(parent).removeClass("indi_add2").html(consts.person_added.error_msg).attr('title',"Company is not linked");
                        }
                        else {
                            company_visit.sales_nav_cmp_visit(c_url, parent, url, 'add_all_salesn_prosp');
                        }
                    }
                    else if (response.res ==='website_not_present'){
                        $(parent).removeClass("indi_add2").html(consts.person_added.error_msg).attr('title',"Sorry, Website is not available for the Company. So we can not add Company and Person.");
                    }
                    else if(response.res==='not_found'){
                        $(parent).removeClass("indi_add2").html(consts.person_added.error_msg).attr('title',"Company is not linked. So we can not add Company and person.");
                    }
                    else if(response === null){
                        $(parent).removeClass("indi_add2").html(consts.person_added.error_msg).attr('title',"Company is not linked. So we can not add Company and person.");
                    }
                    else{
                        $(parent).removeClass("indi_add2").html(consts.person_added.error_msg).attr('title',"Company is not linked. So we can not add Company and person.");
                    }
                });
            }
            else if(prospect_data.companyUrl === undefined){
                cm_data['comp_name'] = prospect_data.company;
                $.ajax({
                    dataType: "json",
                    url: consts.linkedin_url + 'extension/check',
                    type: "post",
                    contentType: "application/json",
                    data: JSON.stringify(cm_data)
                }).success(function (response) {
                    if (response.res === true || response.res === "true") {
                        salesN_prospect_functions.send_data_to_sales_backend(url, parent);
                    }
                    else if (response.res === false || response.res === "false") {
                        // company_visit.visit_cmp_page(response.linkedin_url, parent, url, 'add_all_salesn_prosp');
                    }
                    else if(response.res ==='not_found'){
                        $(parent).removeClass("indi_add2").html(consts.person_added.error_msg).attr('title',"Company is not linked. So we can not add Company and person.");
                    }
                    else if(response === null){
                        $(parent).removeClass("indi_add2").html(consts.person_added.error_msg).attr('title',"Company is not linked. So we can not add Company and person.");
                    }
                    else{
                        $(parent).removeClass("indi_add2").html(consts.person_added.error_msg).attr('title',"Company is not linked. So we can not add Company and person.");
                    }
                });
            }
        }
        catch(err){}
        prospect_visit.salesN_visited_cmp_for_prosp.push(prospect_data.companyUrl);
      }
};
