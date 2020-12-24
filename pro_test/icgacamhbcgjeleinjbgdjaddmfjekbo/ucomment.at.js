function ucAddCommentsSection(){
	if(window.location.hostname!='ucomment.at'){
		var script= document.createElement('script');
		script.type= 'text/javascript';
		//script.src= chrome.extension.getURL("ucomment.at.js");
		script.src= "http://ucomment.at/wp-content/themes/ucomment/js/ucomment.at.js";
		document.head.appendChild(script);
		setTimeout(function(){window.scroll(0,findPos(document.getElementById("ucomment-placeholder_load_42qrfhvniuo23h4qbfrwinfpeu2hq4or3ifwed")));}, 2000);
	}	
}

//Finds y value of given object
function findPos(obj) {
    var curtop = 0;
    if (obj.offsetParent) {
        do {
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
    return [curtop];
    }
}





