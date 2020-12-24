// var url = 'https://www.linkedin.com/company/tata-interactive-systems/';
// var url = "https://www.linkedin.com/company/166261/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base%3Bpy24u0G4QdWKolECvDkxKg%3D%3D&licu=urn%3Ali%3Acontrol%3Ad_flagship3_profile_view_base-background_details_company";
// var url = 'https://www.linkedin.com/company/166261/';

var company_visit = {

    cmp_d :{},
    company_data1:[],
    hqlist:[],

    scrap_cmp:function scrap_cmp(url) {

        var company = {};

        http.get(url, null, function(body){

            var h,t,j,o,d,l,s,r;

            r = /[0-9]+-?[0-9]+,?[0,9]+\+?/gi;

            h = $("<div />", {
                html: body
            });

            try {
                // Beta vars
                var inc, hq, logo, size, founded, id,web1;

                t = h.find("code").filter(function () {
                    return $(this).html().indexOf('"companyPageUrl":') > -1;
                });
                try {
                    j = t.html().replace('<!--', '').replace('-->', '').trim();
                } catch (e) {
                    j = ''
                }
                o = JSON.parse(j);
                inc = o.included;

                var cmp_data_l = '';

                for (var i = 0; i < inc.length; i++) {
                    var inc_url = inc[i].url+"/";
                    if (inc[i].$type === 'com.linkedin.voyager.organization.Company') {
                        var inc_url = inc[i].url+"/";
                        var cinc_url = 'https://www.linkedin.com/company/'+inc[i].universalName+"/";
                        if (url === inc_url || url === cinc_url) {
                            cmp_data_l = inc[i];
                            web1 = cmp_data_l.companyPageUrl;
                        }
                    }

                    if (!hq && inc[i].$type === 'com.linkedin.common.Address') {
                        hq = inc[i];
                        for (var key in hq) {
                            if (key.indexOf('$') > -1) delete hq[key];
                        }
                    }

                    if (!size && inc[i].$type === 'com.linkedin.voyager.organization.shared.StaffCountRange')
                        size = inc[i].start + (inc[i].end ? (' - ' + inc[i].end) : '+');

                    if (!logo && inc[i].$type === 'com.linkedin.voyager.common.MediaProcessorImage' && inc[i].$id && inc[i].$id.indexOf(':' + id + ',logo,') > -1)
                        logo = inc[i].id;

                    if (!founded && inc[i].$type === 'com.linkedin.common.Date')
                        founded = inc[i].year;
                }
                company_visit.cmp_d = {
                    name: cmp_data_l.name || '',
                    website: web1 || '',
                    description: cmp_data_l.description || '',
                    hq: hq || '',
                    industry: cmp_data_l.industries.join(',') || '',
                    size: size || '',
                    logourl: logo || '',
                    founded: founded || '',
                    specialities: cmp_data_l.specialities.join(',') || '',
                    urlbyguid: cmp_data_l.url,
                    urlbycname: "https://www.linkedin.com/company/"+cmp_data_l.universalName,
                    companytype: cmp_data_l.type ||'',
                    no_of_emp: cmp_data_l.staffCount || '',
                };
                company_visit.company_data1.push(company_visit.cmp_d);
                // return cmp_d;
            }
            catch(e) {
                console.error("");
            }
        }, function(){
            // callback();
        })
    },

    company_data:[],
    sales_n_comp_arry:[],
    visit_cmp_page : function (url,parent,id1,flag_comp,cb) {
        $.get(url,function (data,status) {
            var h,t,p;
            var inc, hq, logo, size, founded, id,web1;
            h = $("<div />", {
                html: data
            });
            t = h.find("code").filter(function () {
                return $(this).html().indexOf('"companyPageUrl":') > -1;
            });
            try{
                p = t[0].textContent;
                o = JSON.parse(p);
                inc = o.included;
                var cmp_data_l = '';
                for (var i = 0; i < inc.length; i++) {
                    if (inc[i].$type === 'com.linkedin.voyager.organization.Company') {
                        var inc_url = inc[i].url+"/";
                        var cinc_url = 'https://www.linkedin.com/company/'+inc[i].universalName+"/";
                        if (url === inc_url || url === cinc_url) {
                            cmp_data_l = inc[i];
                            web1 = cmp_data_l.companyPageUrl;
                        }
                    }
                    if (!hq && inc[i].$type === 'com.linkedin.common.Address') {
                        hq = inc[i];
                        for (var key in hq) {
                            if (key.indexOf('$') > -1) delete hq[key];
                        }
                    }

                    if (!size && inc[i].$type === 'com.linkedin.voyager.organization.shared.StaffCountRange')
                        size = inc[i].start + (inc[i].end ? (' - ' + inc[i].end) : '+');

                    if (!logo && inc[i].$type === 'com.linkedin.voyager.common.MediaProcessorImage' && inc[i].$id && inc[i].$id.indexOf(':' + id + ',logo,') > -1)
                        logo = inc[i].id;

                    if (!founded && inc[i].$type === 'com.linkedin.common.Date')
                        founded = inc[i].year;
                }
                company_visit.cmp_d = {
                    name: cmp_data_l.name || '',
                    website: web1 || '',
                    description: cmp_data_l.description || '',
                    hq: hq || '',
                    headquarters:hq || '',
                    industry: cmp_data_l.industries || '',
                    size: size || '',
                    logourl: logo || '',
                    founded: founded || '',
                    specialities: cmp_data_l.specialities || '',
                    urlbyguid: cmp_data_l.url,
                    urlbycname: "https://www.linkedin.com/company/"+cmp_data_l.universalName,
                    companytype: cmp_data_l.type ||'',
                    no_of_emp: cmp_data_l.staffCount || '',
                    flag : 'proscomp,'
                };
                company_visit.company_data.push(company_visit.cmp_d);
                salesN_company_functions.c_data = {
                    name: cmp_data_l.name || '',
                    website: web1 || '',
                    description: cmp_data_l.description || '',
                    headquarters: hq || '',
                    industry: cmp_data_l.industries.join(',') || '',
                    size: size || '',
                    logourl: logo || '',
                    founded: founded || '',
                    specialities: cmp_data_l.specialities.join(',') || '',
                    urlbyguid: cmp_data_l.url,
                    urlbycname: "https://www.linkedin.com/company/"+cmp_data_l.universalName,
                    companytype: cmp_data_l.type ||'',
                    no_of_emp: cmp_data_l.staffCount || ''
                };
                company_visit.sales_n_comp_arry.push(salesN_company_functions.c_data);
            }
            catch(err){

            }
            if(flag_comp==='addcomp_single_list') {
                company_functions.addcomp_call_backend(parent, id1,'addcomp_single_list');
            }else if(flag_comp ==='add_all_salesn_prosp'){
                salesN_prospect_functions.send_data_to_sales_backend(id1, parent);
            }else if(flag_comp === 'add_all_comp_li'){
                company_functions.addcomp_call_backend(id1,parent,'');
            }else if(flag_comp === 'add_all_compsdb') {
                if (company_visit.sales_n_comp_arry.length > 0) {
                    salesN_company_functions.single_add_from_list(id1, "new");
                } else {
                    $(id1).html(consts.company_button_ui.website_error);
                }
            }else if(cb){
                cb();
            }
        });
    },

    sales_nav_cmp_visit : function (url,parent,id1,flag_comp,cb) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange=function() {
            var h,t,p;
            var inc, hq, logo, size, founded, id,type,industries,indus,industrynamee,web1;
            var industryname={},industry=[],web;

            if (xmlhttp.readyState==4 && xmlhttp.status==200) {
                var response = xmlhttp.responseText;
                h = $("<div />", {
                    html: response
                });
                t = h.find("code").filter(function () {
                    return $(this).html().indexOf('"companyPageUrl":') > -1;
                });
                try{
                    p = t[0].textContent;
                    o = JSON.parse(p);
                   // console.log("ppp",o);
                    inc = o.included;
                    var cmp_data_l = '';
                    for (var i = 0; i < inc.length; i++) {
                        if (inc[i].$type === 'com.linkedin.voyager.common.Industry') {
                            indus = inc[i].entityUrn;
                            if (indus) {
                                var ba='';
                                ba = indus.split(":")[3];
                                industryname[ba] = inc[i].localizedName;
                            }
                        }
                    }
                    for (var i = 0; i < inc.length; i++) {
                        if (inc[i].$type === 'com.linkedin.voyager.organization.Company') {
                            var inc_url = inc[i].url+"/";
                            var cinc_url = 'https://www.linkedin.com/company/'+inc[i].universalName+"/";
                            if (url === inc_url || url === cinc_url) {
                               // console.log("incccccccccc",inc[i]);
                                cmp_data_l = inc[i];
                                web1 = cmp_data_l.companyPageUrl;
                                try {
                                    industries = inc[i]["*companyIndustries"][0];
                                } catch (err) {
                                    industries = null
                                }

                                hq = inc[i].confirmedLocations;
                                for (var key in hq) {
                                    if (key.indexOf('$') > -1) delete hq[key];
                                }
                                if (!size)
                                    try {
                                        size = inc[i].staffCountRange["start"] + (inc[i].staffCountRange["end"] ? (' - ' + inc[i].staffCountRange["end"]) : '+');
                                    } catch (err) {
                                        size = inc[i].staffCount;
                                    }

                                if (!logo && inc[i].$type === 'com.linkedin.voyager.common.MediaProcessorImage' && inc[i].$id && inc[i].$id.indexOf(':' + id + ',logo,') > -1)
                                    logo = inc[i].id;
                                try {
                                    if (!founded)
                                        founded = inc[i]["foundedOn"].year;
                                } catch (e) {

                                }
                                try {
                                    type = inc[i]['companyType'].localizedName;
                                } catch (err) {
                                    type = null
                                }

                                }
                                if (industries) {
                                    var ai = (industries.split(":")[3]);
                                    Object.entries(industryname).forEach(([key, value]) => {
                                        if (key == ai) {
                                            industrynamee = value;
                                        }
                                    });
                                }

                        }
                    }
                    company_visit.cmp_d = {
                        name: cmp_data_l.name || '',
                        website: web1 || '',
                        description: cmp_data_l.description || '',
                        hq: hq || '',
                        headquarters: hq || '',
                        industry: industrynamee || '',
                        size: size || '',
                        logourl: logo || '',
                        founded: founded || '',
                        specialities: cmp_data_l.specialities || '',
                        urlbyguid: cmp_data_l.url,
                        urlbycname: "https://www.linkedin.com/company/"+cmp_data_l.universalName,
                        companytype: type ||'',
                        no_of_emp: cmp_data_l.staffCount || '',
                        flag : 'proscomp,',
                        linkedin_company_size: size,
                        linkedin_location: hq
                    };

                    salesN_company_functions.c_data = {
                        name: cmp_data_l.name || '',
                        website: web1 || '',
                        description: cmp_data_l.description || '',
                        headquarters: hq || '',
                        industry: industrynamee || '',
                        size: size || '',
                        logourl: logo || '',
                        founded: founded || '',
                        specialities: cmp_data_l.specialities || '',
                        urlbyguid: cmp_data_l.url,
                        urlbycname: "https://www.linkedin.com/company/"+cmp_data_l.universalName,
                        companytype: type ||'',
                        no_of_emp: cmp_data_l.staffCount || '',
                        linkedin_company_size: size,
                        linkedin_location: hq
                    };
                    company_visit.company_data.push(company_visit.cmp_d);
                    company_visit.sales_n_comp_arry.push(salesN_company_functions.c_data);
                }
                catch(err){
                    console.log("");
                }
                if(flag_comp==='addcomp_single_list') {
                    company_functions.addcomp_call_backend(parent, id1,'addcomp_single_list');
                }else if(flag_comp ==='add_all_salesn_prosp') {
                    if (salesN_company_functions.c_data['website'] !== '') {
                        salesN_prospect_functions.send_data_to_sales_backend(id1, parent);
                    } else {
                        $(parent).html(consts.person_added.error_msg).attr('title', "Sorry, Website is not available for the Company");
                    }
                }else if(flag_comp === 'add_all_comp_li') {
                    company_functions.addcomp_call_backend(id1, parent, '');
                }else if(flag_comp === 'add_all_compsdb') {
                    if (company_visit.sales_n_comp_arry.length > 0) {
                        salesN_company_functions.multiple_add_from_list(id1, "new");
                    } else {
                        $(id1).html(consts.company_button_ui.website_error);
                    }
                }else if(flag_comp === 'add_single_compsdb'){
                    if (company_visit.sales_n_comp_arry.length > 0) {
                        salesN_company_functions.single_add_from_list(id1, "new");
                    } else {
                        $(id1).html(consts.company_button_ui.website_error);
                    }
                }
                else if(cb){
                    cb();
                }
            }
        };

        xmlhttp.open("GET",url);
        xmlhttp.send();

    }
};
