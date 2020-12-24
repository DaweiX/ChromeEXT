$(function() {
    // chrome.runtime.onMessageExternal.addListener(function(msg, sender, sendResponse) {
    //     if ((msg.action == "id") && (msg.value == id))
    //     {
    //         sendResponse({id : id});
    //         console.log("idddddd",id)
    //     }
    // });
     // var div = document.createElement('div');
    // div.setAttribute('id', 'myapp-extension-installed-div');
    // document.getElementsByTagName('body')[0].appendChild(div);

    // if ($('#myapp-extension-installed-div').length) {
    //     console.log("hiiiiiiiiiiiiiiiiiiiiii")
    // }
    // $("#clodura-icon-dragid").draggable(
    //     {
    //         iframeFix: true,
    //         containment: "window",
    //         refreshPositions: true,
    //         stop:function(event, ui) {
    //
    //             if((($(document).width()/2)-59) > parseInt($("#clodura-icon-dragid").css("left"),10))
    //             {
    //                 $("#clodura-icon-dragid").css("left","0px");
    //             }
    //             else if((($(document).width()/2)-59) < parseInt($("#clodura-icon-dragid").css("left"),10))
    //             {
    //
    //                 $("#clodura-icon-dragid").css("left",($(document).width()-59));
    //             }
    //
    //             if(parseInt($("#clodura-icon-dragid").css("top"),10) < 0)
    //             {
    //                 $("#clodura-icon-dragid").css("top",Math.abs(parseInt($("#clodura-icon-dragid").css("top"),10)));
    //             }
    //             if(Math.abs(parseInt($("#clodura-icon-dragid").css("top"),10)) > $(window).height()){
    //                 $("#clodura-icon-dragid").css("top",$(window).height());
    //             }
    //             $( event.originalEvent.target).one("click", function(e){
    //                 e.stopImmediatePropagation();
    //             });
    //         }
    //     });

    // $('#clodura-icon-dragid').click(function () {
    //     if($(this).is(".ui-draggable-dragging") === false){
    //         toggle_window();
    //     }
    // });
    // let currentVersion = chrome.runtime.getManifest().version;
    // console.log("versinsssssss",currentVersion);
    // window.postMessage({
    //     sender: "my-extension",
    //     message_name: "version",
    //     message: currentVersion
    // }, "*");

    // function checkURLchange1(currentURL1){
    //     let oldur = document.getElementById("clodura_iframe").src;
    //     if(oldur.includes("parenturl")){
    //         oldur = oldur.split("parenturl=");
    //         oldur = oldur[1].split("#!");
    //         oldur = oldur[0];
    //     }
    //     if(oldur!= currentURL1){
    //         iframe.src = chrome.extension.getURL("/source/extension_index.html") + "?parenturl="+currentURL1;
    //         chrome.runtime.sendMessage("url_change", function(response) {
    //             // console.log(response);
    //         });
    //     }
    // }
    // setInterval(function() {
    //     let c_ur1 = window.location.href;
    //     if(c_ur1.includes("parenturl")){
    //         c_ur1 = c_ur1.split("parenturl=");
    //         c_ur1 = c_ur1[1].split("#!");
    //         c_ur1 = c_ur1[0];
    //     }
    //     if(c_ur1.includes("/company/") || c_ur1.includes("/in/") || c_ur1.includes("/sales/")) {
    //         checkURLchange1(c_ur1);
    //     }
    // }, 7000);

//     var div = document.createElement('div');
//     div.setAttribute('class', 'myapp-extension-installed-div');
//     document.getElementsByTagName('body')[0].appendChild(div);
//
//     if ($('.myapp-extension-installed-div').length) {
//         console.log("hiiiiiiiiiiiiiiiiii");
//         var iframe = document.createElement('iframe');
//         iframe.setAttribute('class','clodura-leftpanel');
//         iframe.style.visibility = "visible";
//         iframe.frameBorder = "none";
//         iframe.scrolling = "no";
//         iframe.id = "clodura_iframe";
// // iframe.sandbox = 'allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation';
//         iframe.src = chrome.extension.getURL("/source/extension_index.html") + "?parenturl="+window.location.href;
//         document.body.appendChild(iframe);
//     }
});