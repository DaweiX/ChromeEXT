function checkURL()
{ 
if(window.location.hostname=='ucomment.at'){ucExtensionInstalled();}
//homeUrl = 'http://ucomment.at/wp-admin/admin-ajax.php?action=uc_check_url&url='+document.URL;
homeUrl = 'http://ucomment.at/wp-admin/admin-ajax.php?action=uc_check_url&url='+encodeURIComponent(document.URL);

var xmlhttp;
if (window.XMLHttpRequest)
  {// code for IE7+, Firefox, Chrome, Opera, Safari
  xmlhttp=new XMLHttpRequest();
  }
xmlhttp.onreadystatechange=function()
  { //alert(xmlhttp.readyState);
  //alert(xmlhttp.status);
  if (xmlhttp.readyState==4 && xmlhttp.status==200)
    {
    //document.getElementById("myDiv").innerHTML=xmlhttp.responseText;
    //alert(xmlhttp.responseText);
	chrome.runtime.sendMessage(xmlhttp.responseText, function(response) {
  //console.log(response.showcomments);
  
  if(response.showcomments=="yes"){ucAddCommentsSectionLoad();}
});
	
    }
  }
xmlhttp.open("GET",homeUrl,true);
xmlhttp.send();
}
checkURL();

function ucAddCommentsSectionLoad(){
	
if(window.location.hostname!='ucomment.at'){
	var script= document.createElement('script');
	script.type= 'text/javascript';
	script.src= chrome.extension.getURL("ucomment.at.js");
	document.head.appendChild(script);
	
	var element = "<center><div id='ucomment-placeholder_load_42qrfhvniuo23h4qbfrwinfpeu2hq4or3ifwed' onclick='ucAddCommentsSection();' >Load comments</div></center>"
	var fragment = create(element);
	document.body.appendChild(fragment);
}
}

function ucExtensionInstalled(){
		var manifest = chrome.runtime.getManifest();
		var element = "<div id='ucomment-extension-is-installed' style='display:none;' data-ver='"+manifest.version+"'></div>";		
		var fragment = create(element);
		document.body.appendChild(fragment);
}

function create(htmlStr) {
    var frag = document.createDocumentFragment(),
        temp = document.createElement('div');
    temp.innerHTML = htmlStr;
    while (temp.firstChild) {
        frag.appendChild(temp.firstChild);
    }
    return frag;
}








