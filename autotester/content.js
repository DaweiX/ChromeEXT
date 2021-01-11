// var sleep = function (time) {
//     var startTime = new Date().getTime() + parseInt(time, 10);
//     while (new Date().getTime() < startTime) { }
// };

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log(JSON.stringify(request));
        window.postMessage(JSON.stringify(request), '*');
        sendResponse({ farewell: "goodbye" });
    });


// var port = chrome.runtime.connect({ name: "myport" });

// chrome.runtime.onConnect.addListener(function (port) {
//     console.assert(port.name == "myport");
//     port.postMessage({ success: true });
// });

// port.onMessage.addListener(function (msg) {
//     console.log(msg);
//     if (msg.current_ext_id) {
//         console.log(msg.current_ext_id + " (content)")
//         port.postMessage({ from_popup: "Response from Popup" });
//     }
// });