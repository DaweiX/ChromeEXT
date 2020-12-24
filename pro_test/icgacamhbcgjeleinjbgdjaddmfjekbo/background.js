chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
  //alert(window.location.hostname);
  if(message==1){
  chrome.pageAction.show(sender.tab.id);
  chrome.pageAction.setIcon({tabId: sender.tab.id, path: 'icon-on-16.png'});
  chrome.pageAction.setTitle({tabId: sender.tab.id, title: 'UComment Available'});
  sendResponse({showcomments:"yes"}); 
  }else{
  chrome.pageAction.show(sender.tab.id);
  chrome.pageAction.setIcon({tabId: sender.tab.id, path: 'icon-off-16.png'});
  chrome.pageAction.setTitle({tabId: sender.tab.id, title: 'UComment: Add Page'});
  }
 // alert(message);
  //checkURL();
});

// Called when the user clicks on the browser action.
chrome.pageAction.onClicked.addListener(function(tab) {
  // No tabs or host permissions needed!
  //alert(120);
  url = 'http://ucomment.at/?&url='+encodeURIComponent(tab.url);
chrome.tabs.create({'url': url}, function(tab) {
    // Tab opened.
	return;
  });

return;
  chrome.pageAction.getTitle({tabId: tab.id},function(result) {
//alert(result);
if(result=="UComment Available"){}																 
if(result=="UComment: Add Page"){}																 
																 
});
  console.log('Turning ' + tab.url + ' red!');
  chrome.tabs.executeScript({
    code: 'document.body.style.backgroundColor="red"'
  });
});
