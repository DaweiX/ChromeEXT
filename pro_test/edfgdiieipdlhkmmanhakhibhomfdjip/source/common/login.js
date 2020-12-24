// var bp = chrome.extension.getBackgroundPage();
var environment = 'production';
var serviceUrl = "https://product.clodura.ai/api/v1/";
// var serviceUrl = "http://localhost:5000/api/v1/";

(function($) {
    // === Populate the List Selector ===
    chrome.storage.local.get("user", function (result)
    {
        window.setTimeout(function () {
            if (result.user != undefined) {
                var n = result.user.split(":")[0];
                // n = n.charAt(0).toUpperCase() + n.slice(1);
                $("#btnlogout").show();
                $("#img_logo").show();
                // $('html, body').css("height", "30%");
                $('#initials').html(n).show();
                $("#basic-search").hide();
            }
            else if (result.user == undefined) {
                $("#advanced-search").hide();
                $("#btnlogout").hide();
                $('#initials').hide();
                $("#basic-search").show();
                // $('html, body').css("height", "50%");
            }
        });
    });
    
    // === Search tabs ===

    $("#btnlogout").on("click", function (e) {
        e.preventDefault();
        chrome.storage.local.remove("user", function (result) {
            $("#advanced-search").hide();
            $("#btnlogout").hide();

            $("#basic-search").show();
            $('#initials').hide();
		    // removeCustomAlert();
        });
    });

      $("#close").on("click", function (e) {
          e.preventDefault();
          window.close();
    });

    $("#btnlogin").on("click", function (e) {
        e.preventDefault();
        var username =$("#username").val();
        var password = $("#password").val();
	    var data ={
                    email: $.trim(username),
                    password: $.trim(password)
	    };
        if ($("#password").val() != "" && $("#username").val() != "") {
            $.ajax({
 		    dataType : "json",
                url: serviceUrl+'extension/login',
                type: 'post',
                contentType: "application/json",
                data : JSON.stringify(data),
		
                success: function (data, status) {
 		            $("#img_logo").show();
                    $("#btnlogout").show();
                    $("#basic-search").hide();
                    var fname = data.firstname.charAt(0).toUpperCase() + data.firstname.slice(1);
                    var lname= data.lastname.charAt(0).toUpperCase() + data.lastname.slice(1);
                    $('#initials').html(fname +" "+ lname).show();
                    // document.getElementById('initials').value = data.firstname;
                    // $('html, body').css("height", "30%");
                    window.alert("Login Successful !!! \nNow you can go to any Company / Person page on Linkedin and start adding. ");
                    chrome.storage.local.set({ 'user': fname+" "+lname + ":" + data.current_credits + ":" + data.id });
                    localStorage['loggedIn'] =  true;
                    localStorage["user"] = $("#username").val();
                    localStorage["user_id"] = data.id;
                   },
                error: function (xhr, desc, err) {
 		            console.log("err",err,desc)
                    $("#basic-search").hide();
                    $("#img_logo").show();
                    $('#initials').hide();
                    window.alert("&nbsp;&nbsp;&nbsp;&nbsp;Login failed, Please try again!!");
                    $("#basic-search").show();
                    // $('html, body').css("height", "30%");
                }
            });
	    }
    });

    $("#tab-basic").on("click", function(e){
        e.preventDefault();
        $("#img_logo").show();
        $("#advanced-search").hide();
        $("#btnlogout").hide();
        $(this).parent().addClass("active");
        $("#tab-advanced").parent().removeClass("active");
        localStorage["popup-mode"] = "basic"
    });

    $("#tab-advanced").on("click", function(e){
        e.preventDefault();
        $("#btnlogout").show();
        $(this).parent().addClass("active");
        $("#tab-basic").parent().removeClass("active");
        localStorage["popup-mode"] = "advanced"
    });

    // === Search form handlers ===

    $("#basic-search").on("submit", function (event) {
        event.preventDefault();
        var search = $("#basic-query").val();
        search += " site:linkedin.com/in/ OR site:linkedin.com/pub/ -site:linkedin.com/pub/dir/ OR site:linkedin.com/company-beta/*"
        chrome.tabs.create({url: "http://www.google.com/search?gws_rd=cr&as_qdr=all&q=" + encodeURIComponent(search)});
    });

var ALERT_TITLE = "";
var ALERT_BUTTON_TEXT = "Ok";

if(document.getElementById) {
    window.alert = function(txt) {
        createCustomAlert(txt);
    }
}

function createCustomAlert(txt) {
    d = document;
    if(d.getElementById("modalContainer")) return;

    mObj = d.getElementsByTagName("body")[0].appendChild(d.createElement("div"));
    mObj.id = "modalContainer";
    mObj.style.height = d.documentElement.scrollHeight + "px";

    alertObj = mObj.appendChild(d.createElement("div"));
    alertObj.style.border ='1px #DCDCDC solid';
    alertObj.id = "alertBox";
    if(d.all && !window.opera) alertObj.style.top = document.documentElement.scrollTop + "px";
    alertObj.style.left = (d.documentElement.scrollWidth - alertObj.offsetWidth)/2 + "px";
    alertObj.style.visiblity="visible";

    h1 = alertObj.appendChild(d.createElement("h1"));
    //h1.appendChild(d.createTextNode(ALERT_TITLE));

    msg = alertObj.appendChild(d.createElement("p"));
    msg.style.margin ='0px 5px 10px 35px';
    msg.appendChild(d.createTextNode(txt));
    msg.innerHTML = txt;

    btn = alertObj.appendChild(d.createElement("span"));
    //btn.id = "closeBtn";
    btn.style.color= '#337ab7';
    btn.style.margin ='150px';
    btn.style.cursor ='pointer';
    btn.appendChild(d.createTextNode(ALERT_BUTTON_TEXT));
    btn.href = "#";
    btn.focus();
    btn.onclick = function() { removeCustomAlert();return false; }
    alertObj.style.display = "block";

}

function removeCustomAlert() {
    document.getElementsByTagName("body")[0].removeChild(document.getElementById("modalContainer"));
}

})(jQuery);
