var myid = 'fapnbolmcjcfifjfkpjfidbkokfldklg';
var idlist = []
var async = require('async');
var global_dict ={}
var threat_list = []
var rest_list = []
var obj = []
var honey_tag_id = null

var flag =0
function getEntity(){
    return {
        msg:$("#msg").val(),
        http:$("#http").val()
    }
}


$(document).ready(function () {
    var _log =getlog('Finprotector Init');
    console.log(_log, 'color:grean');
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        honey_tag_id = tabs[0].id;
        $("#p_honey_id").html(honey_tag_id);
        var _log = getlog('Tab located: ' + honey_tag_id);
        console.log(_log, 'color:green');

    });



$("#btn1").click(function(){

       async.waterfall([
        function(cb){
            var count_dict = getEntity();
            var http_count = count_dict['http'];
            var msg_count = count_dict['msg'];
            if(parseInt(http_count)>0){
                var xhr1 = new XMLHttpRequest();
                xhr1.open("POST", "http://localhost:3000/function_test");
                xhr1.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                post = 'type'+'='+'http'+'&'+'count'+'='+http_count
                xhr1.send(post)
                xhr1.onreadystatechange = function(){
                    if(xhr1.readyState == 4){
                        var http_ = xhr1.responseText
                        cb(null,{'http':http_, 'msg_count':msg_count})
                    }
                }
            }else if(parseInt(http_count) == 0){
                    var http_ = 'null';
                    cb(null,{'http':http_, 'msg_count':msg_count})
            }
        },
        function(list, cb){
            console.log(list)
            var msg_count = list['msg_count']
            var http_ = list['http']
            if(parseInt(msg_count)>0){
                var xhr = new XMLHttpRequest();
                xhr.open("POST", "http://localhost:3000/function_test");
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                post = 'type'+'='+'msg'+'&'+'count'+'='+msg_count
                xhr.send(post)
                xhr.onreadystatechange = function(){
                    if(xhr.readyState == 4){
                        var msg_ = xhr.responseText
                        cb(null,{'http':http_, 'msg':msg_})
                    }
                }
            }else if(parseInt(msg_count) == 0){
                var  msg_ = 'null'
                cb(null,{'http':http_, 'msg':msg_})
            }},
            function(message,cb){
                console.log('message',message)
                chrome.tabs.sendMessage(honey_tag_id,{http_list:message['http'], msg_list:message['msg']} , function (res) {
                    if (res) {
                        console.log(res);
                        cb(null, res);
                    }
                    if (chrome.runtime.lastError) {
                        console.warn(chrome.runtime.lastError.message);
                        cb(null, res);
                    }
                });

            }
    ],
        function(err,result){
        if(err)console.log(err,'color:red')}
    );
})
   
 









Object.defineProperty(obj,'data',{
    get:function(){
            var ext_form = document.getElementById('p_total');
			return ext_form.innerText;
    },
    set:function(l){
        var str_ = ''
        for(k=0;k<l.length;k++){
            str_ = str_.concat(l[k][0],':',l[k][1],'/')
        }
        var _log =getlog('Warnings:',str_,'may be leaked!!!');
        console.log(_log, 'color:red');
        $("#p_total").html(str_);
        //需要触发的渲染函数可以写在这...
    }
})


function getlog(content, type) {
    color = typeof color !== 'undefined' ? color : 'gray';
    type = typeof type !== 'undefined' ? type : 'INFO';
    return type + '\t' + gtime() + '\t%c' + content;
}

