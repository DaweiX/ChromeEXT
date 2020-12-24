

var iframe = document.createElement('iframe');
iframe.setAttribute('class','clodura-leftpanel');
// iframe.style.width = "0%";

// chrome.storage.local.get('visited_value',function(v_value){
//     if(v_value.visited_value ===1 ){
//
//     }
//     else{
//         var extensionOrigin = 'chrome-extension://' + chrome.runtime.id;
//         if (!location.ancestorOrigins.contains(extensionOrigin)) {
//             // iframe = document.createElement('iframe');
//             // iframe.setAttribute('class','clodura-leftpanel');
//             // Must be declared at web_accessible_resources in manifest.json
//             iframe.frameBorder = "none";
//             iframe.scrolling = "no";
//             iframe.id = "clodura_iframe";
//             // console.log("window.location.href",window.location.href)
//             chrome.storage.local.set({"visited_value":1});
//             // let curr_url = window.location.href;
//             // consts.url_list.push(curr_url);
//             // iframe.src = chrome.extension.getURL("/source/extension_index.html") + "?parenturl="+curr_url;
//             document.body.appendChild(iframe);
//         }
//
//     }
// });

chrome.storage.local.get("toggleflag", function (obj) {
    setTimeout(function(){
        if (obj.toggleflag === 'open') {
            iframe.style.visibility = "visible";
            // iframe.style.transition = "visibility 0.8s ease-in-out";
        } else {
            iframe.style.visibility = "hidden";
        }
    },2000);
});

// iframe.style.visibility ='hidden';
iframe.frameBorder = "none";
iframe.scrolling = "no";
iframe.id = "clodura_iframe";
// // iframe.sandbox = 'allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation';
iframe.src = chrome.extension.getURL("/source/extension_index.html") + "?parenturl=" + window.location.href;
// var listframes = document.getElementsByTagName('iframe');
// for (var i in listframes) {
//     console.log(!listframes[i].src,listframes[i].src);
//     if(!listframes[i].srctoggle){
//         console.log('')
//     }
//     else {
//         document.body.appendChild(iframe);
//         show_icon();
//         console.log("outer frame");
//     }
// }

// var links = document.getElementsByTagName('a');
// for(var i = 0; i< links.length; i++){
//     if(links[i].hostname === location.hostname) {
//         // if(links[i].href.indexOf('/about') > -1 || links[i].href.indexOf('contact') > -1 || links[i].href.indexOf('support') > -1) {
//         slashcount = links[i].href.split("/");
//         console.log("slashh",slashcount);
//         if(slashcount.length < 6 && !(consts.vurls.includes(links[i].href))){
//             consts.vurls.push(links[i].href);
//         }
//     }
// }
// console.log("arryaaaaaa",consts.vurls);

var isInIFrame = (window.location !== window.parent.location);
if(isInIFrame===true){
    // console.log("isInIFrame",window.location.ancestorOrigins[0].indexOf('google.com/search'));
}
else {
    document.body.appendChild(iframe);
    // show_icon();
}

// function show_icon(){
//     var isInIFrame = (window.location !== window.parent.location);
//     if(isInIFrame===true){
//
//     }
//     else {
//         var dragicon_present = document.getElementById('clodura-icon-dragid');
//         if (dragicon_present === null) {
//             var daraggable_icon = '<div id="clodura-icon-dragid" draggable="true" style="z-index: 9999999;cursor: pointer;height: 59px;width: 59px;position: fixed;top: 20%;bottom: auto;left: auto;right: 0px;display: block;"><img id="clodura-icon" src="https://product.clodura.ai/client/app/assets/images/logo-c.png" style="width: 100%;"/></div>';
//             $('body').append(daraggable_icon);
//             // notification_icon('crossicon');
//         }
//     }
// }

// function notification_icon(flag) {
//     // if(flag === 'number'){
//     //     var notify_div = '<div class="clodura-icon-notification" style="background-color: yellowgreen;">1</div>';
//     //     $("#clodura-icon").before(notify_div);
//     // }
//     if(flag === 'successicon'){
//         var notify_div = '<svg class="clodura-icon-notification clodura-checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><title>Company data Found</title>';
//         notify_div += '<circle class="clodura-checkmark__circle" cx="26" cy="26" r="25" fill="none"/>';
//         notify_div += '<path class="clodura-checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>';
//         notify_div += '</svg>';
//         $("#clodura-icon").before(notify_div);
//         iframe.style.width="35%";
//     }
//     else if(flag === 'crossicon'){
//         var notify_div = '<svg class="clodura-icon-notification clodura-crossmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><title>Company data Not Found</title>';
//         notify_div += '<circle class="clodura-crossmark__circle" cx="26" cy="26" r="25" fill="none" />';
//         notify_div += '<path class="clodura-crossmark__check" fill="none" d="M16 16 36 36 M36 16 16 36" />';
//         notify_div += '</svg>';
//         $("#clodura-icon").before(notify_div);
//     }
// }

// function remove_show_icon(){
//     // chrome.storage.local.get("user", function (obj) {
//     //     console.log("Passed successfully: show_icon ",obj.user);
//     //     if (obj.user !== undefined){
//     $('#clodura-icon-dragid').remove();
//     // }
//     // });
// }

chrome.runtime.onMessage.addListener(function(msg, sender){
    if(msg === "toggle"){
        toggle_window();
    }
    if(msg === 'toggle1'){
        toggle1();
    }
    // if(msg === "insert_icon"){
    //     show_icon();
    // }
    // if(msg === "remove_icon"){
    //     remove_show_icon();
    // }
    // if(msg === "notify_icon_check"){
    //     notification_icon('successicon');
    // }
    // if(msg === "notify_icon_cross"){
    //     notification_icon('crossicon');
    // }
});

function toggle_window(){
    if(iframe.style.visibility === "hidden"){
        iframe.style.visibility= "visible";
        chrome.storage.local.set({'toggleflag': 'open'});
        chrome.runtime.sendMessage("window_open", function(response) {
            // console.log(response);
        });
    }
    else{
        iframe.style.visibility="hidden";
        chrome.storage.local.set({'toggleflag': 'closed'});
    }
}

function toggle1(){
    chrome.storage.local.get("toggleflag", function (obj) {
        if (obj.toggleflag === 'open') {
            iframe.style.visibility = "visible";
        } else {
            iframe.style.visibility = "hidden";
        }
    })
}