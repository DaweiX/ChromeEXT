/*****************************************************************************
 * This program is protected under international and U.S. copyright laws as  *
 * an unpublished work. This program is confidential and proprietary to the  *
 * copyright owners. Reproduction or disclosure, in whole or in part, or the *
 * production of derivative works without the express permission of          *
 * the copyright owners is prohibited.                                       *
 *                                                                           *
 *                Copyright (C) 2014-2017 by Dolby International AB.         *
 *                            All rights reserved.                           *
 *****************************************************************************/
//var random = require('random')
 
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        var http_noise = []
        if(request['http_list']=='null'){
            localStorage.setItem('list','null')
        }else{
            var _pre_str = request['http_list']
            var end = _pre_str.length-1
            _list = _pre_str.substring(1,end).split(',')
            for(var t = 0;t<_list.length;t++){
              _end = _list[t].length-1
              temp = _list[t].substring(1,_end)
              http_noise.push(temp)
            }
            console.log(http_noise)
            localStorage.setItem("list",http_noise);
        }
            
        if(request['msg_list']!='null'){
            var send_msg = []
            var _pre = request['msg_list']
            localStorage.setItem("mlist", _pre);
        }else{
            localStorage.setItem('mlist','null')
        }

        location.reload(); 
        sendResponse({ farewell: "goodbye" });
    });




 console.log('test......')
          var entries = window.performance.getEntriesByType("resource");
          console.log('test')
          console.log(entries);

try{
  var hstr = localStorage.getItem("list")
  var mstr = localStorage.getItem("mlist")
  console.log('http_noise has been sent:')
  console.log(hstr)
  console.log('-------------------------')
  console.log('msg_noise has been sent:')
  console.log(mstr)
  console.log('-------------------------')
  if(hstr !='null'){
    var db = hstr.split(',')
    var noise = localStorage.getItem('list')
        //console.log(noise)
        for (var x=0 ;x<db.length; x++){
              console.log(db[x])
              addFakeLink(db[x])
        }
  }
  if(mstr!='null'){
    var m_db = JSON.parse(mstr)
    console.log(m_db)
    var m_list = Object.values(m_db)

    for(var xx=0; xx<m_list.length; xx++){
      console.log(m_list[xx])
      window.postMessage((m_list[xx]));

    }
  }

}catch(err){console.log(err)}







/*

chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
          console.log('test......')
          console.log(request);
          var noise = []
          console.log('happy')
          var name = Object.keys(request)[0]
          if(name == 'http_list'){
            _pre_str = request['http_list']
            end = _pre_str.length-1
            _list = _pre_str.substring(1,end).split(',')
            for(var t = 0;t<_list.length;t++){
              _end = _list[t].length-1
              temp = _list[t].substring(1,_end)
              noise.push(temp)
            }
           console.log(noise)
           localStorage.setItem("list",noise);
           

          }

          else if(name == 'msg_list'){
            var send_msg = []
            var _pre_str = request['msg_list']
            console.log('mmmmmm')
            localStorage.setItem("mlist", _pre_str)
          }

        location.reload(); 

            sendResponse({ farewell: "goodbye" });
        });
*/



/*
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
// code...
 sendResponse('我已收到你的消息：' +JSON.stringify(request));//做出回应
});
*/








function addFakeLink(src){
    var tmp = document.createElement('script');
    tmp.src = src;

    try{
      document.body.appendChild(tmp)
    }catch(err){
      console.log(err);
    }
  }


function MessageList(subset_msg, subset_http){
  var msg_sum = []
  var http_sum = []

  for(var j=0; j<subset_msg.length; j++){
    msg_sum.push(subset_msg[j])
    http_sum.push( subset_http[j])
  }
  console.log('test',msg_sum,http_sum)
  var result = []
  result['msg'] = msg_sum
  result['http'] = http_sum
  return result
}

function logToJavascriptPlugin (msg) {
  console.log('msg',msg,typeof(msg))
  window.postMessage(JSON.stringify(msg));
}



function run(n){

//  var result = randomChoose(n);
//console.log('debug2',result)
  var msg = result['msg']
  var http = result['http']
  var result =MessageList(msg,http);
  var subset_msg = result['msg']
  var subset_http = result['http']


  subset_msg.forEach( msg=>{
    logToJavascriptPlugin(msg)
    console.log('send fake msg')
  })

  //发送虚假http请求



  subset_http.forEach( url_set=>{
    var count = 0;
    url_set.forEach(url=>{
       console.log(url,'url')
       var type = Type(url)
       addFakeLink(url,type)
       count = count+1;
    })
    console.log('send fake http'+count);
  })
  //发送虚假msg信息

}

window.onload=function(){
    console.log('starting defense!!')
    run(2)
}


