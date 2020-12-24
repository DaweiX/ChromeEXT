/**
 * Constants
 */

var consts = {
    oldURL :'',
    flag:'',
    pages:5,
    c_pages:5,
    vurls:[],
    // Global
     linkedin_base_url : "https://product.clodura.ai/",
     linkedin_url :'https://product.clodura.ai/api/v1/',
   //  linkedin_base_url : "http://localhost:5000/",
    //  linkedin_url :'http://localhost:5000/api/v1/',
    //  linkedin_base_url : "https://beta.clodura.com/",
     // linkedin_url :'https://beta.clodura.com/api/v1/',

    month_names : {
        1:"January",2: "February",3: "March",4: "April",5: "May",6: "June",
        7:"July",8: "August",9: "September",10: "October",11: "November",12: "December"
    },
    success_button_ui:{
        success:"<span class='success_message' style='width: 18px;height: 18px;position: relative; top: 17px;background:url(" + chrome.extension.getURL('/img/tick.png') + ") no-repeat !important;padding: 12px;left: 4px;'></span>",
        loader:"<span class='loader1' id='loader1' style='padding: 1px 4px 25px 5px;' title='Processing'><img src='" + chrome.extension.getURL("/img/loader1.gif") + "' height='25px' width='17px'/></span>",
        blacklisted:"<img id='cmp_blacklisted' src='" + chrome.extension.getURL('/img/blacklist.jpeg') + "' width='20px' height='20px' style='margin-top: 4px;' title='Company blacklisted'/>",
        error_msg:"<img src='" + chrome.extension.getURL('/img/error_icon.png') + "' width='24px' height='24px' title='Error'/>",
        add_all_loader:"<div class='loader_add_all' id='processing' style='width: 105px;'><span class='loader1' id='loader1' style='padding: 0px 2px 24px 4px;'><img src='" + chrome.extension.getURL("/img/loader1.gif") + "' height='25px' width='17px'/><span style='vertical-align: top;padding-left: 6px;'>Processing...</span></span></div>"
    },
    company_button_ui:{
        success:"<span class='success_message' style='width: 18px;height: 18px;position: relative;left: 4px;color:#0073b1;font-size: 15px;font-weight: 600;'><img src='"+ chrome.extension.getURL('/img/tick.png') +"' style='width: 17px;height: 18px;vertical-align:text-bottom'/><span style='padding-left:4px'>Added</span></span>",
        loader:"<span class='loader1' id='loader1' style='padding: 1px 4px 25px 5px;' title='Processing'><img src='" + chrome.extension.getURL("/img/loader1.gif") + "' height='25px' width='17px'/></span>",
        blacklisted:"<img src='" + chrome.extension.getURL('/img/blacklist.jpeg') + "' width='20px' height='20px' style='margin-top: 4px;' title='Company blacklisted'/>",
        error_msg:"<img src='" + chrome.extension.getURL('/img/error_icon.png') + "' width='24px' height='24px' title='Error'/>",
        website_error:"<img src='" + chrome.extension.getURL('/img/error_icon.png') + "' width='24px' height='24px' title='Sorry, We can not identify website for this Company.'/>"
    },
    person_added:{
        success:"<span class='success_message' style='width: 18px;height: 18px;position: relative;left: 4px;color:#0073b1;font-size: 15px;font-weight: 600;'><img src='"+ chrome.extension.getURL('/img/tick.png') +"' style='width: 17px;height: 18px;vertical-align:text-bottom'/><span style='padding-left:4px'>Added</span></span>",
        blacklisted:"<img src='" + chrome.extension.getURL('/img/blacklist.jpeg') + "' width='20px' height='20px' style='margin-top: 4px;' />",
        singlep_success:"<span class='success_message' style='width: 18px;height: 18px;position: relative; top: 17px;background:url(" + chrome.extension.getURL('/img/tick.png') + ") no-repeat !important;padding: 12px;left: 4px;'></span>",
        error_msg:"<img src='" + chrome.extension.getURL('/img/error_icon.png') + "' width='24px' height='24px'/>",
        add_company_for_prospects_flag_msg: "<img src='" + chrome.extension.getURL('/img/error_icon.png') + "' width='24px' height='24px' title='Sorry, You don&apos;t have associated company in you radar.'/>"
    },
    credits:''
};
