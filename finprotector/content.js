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

var msg_db = [
	{
		'name':'Dolby Voice 1.3',
		'id': 'dpdceimakekmhakeipnflcgolggpncgd',
		'f':[
				{
					"DolbyVoiceMsgP1x3": "log_msg",
					"raw_value": {
						"component": "ChromeExt-FG", 
						"message": "Sending 'ping' message to transport layer"
					}
				},
				{
					"DolbyVoiceMsgP1x3":"ping"
				}
		]
	},	{
		'name':'Meet Me Dolby Voice 1.1',
		'id':'bpdjhejefncgnahbpolfhcjkodmjlfaj',
		'f':[
				{
					"MeetMeDolbyVoiceMsgP1x1": "log_msg",
				 	"raw_value" : {
					 	"component": "ChromeExt-FG", 
					 	"message": "Sending 'ping' message to transport layer"
				 	}
				 },
				 {
				 	"MeetMeDolbyVoiceMsgP1x1":"ping"
				 }
			]
	}
	
]
var http_db = [
  {
		'name': '彩云小译',
		'id': 'jmpepeebcbihafjjadogphmbgiffiajh',
		'f': ["http://caiyunapp.com/xiaoyi/web_translate_data_stat.html",
				"https://www.caiyunapp.com/imgs/webtrs/default.png",
				"https://caiyunapp.com/imgs/webtrs/fanyi-btn-hover.png",
				"https://caiyunapp.com/imgs/webtrs/favorite-btn.png",
				"https://caiyunapp.com/imgs/webtrs/left-slide.png",
				"https://caiyunapp.com/imgs/xiaoyilogo.jpg",
				"https://caiyunapp.com/images/favour.png",
				"https://caiyunapp.com/imgs/webtrs/right-slide.png"]
	},
	  {
		'name': '彩云da译',
		'id': 'jmpepeebcbihafjjadogphmbgiffiajh',
		'f': [
				"http://www.baidu.com"]
	}
]
var mapping={
  'pictures':['jpg','jpge','png','gif','bmp'],
  'webpage':['html']
}
function getArrayItems(arr, num) {
  //新建一个数组,将传入的数组复制过来,用于运算,而不要直接操作传入的数组;
  var temp_array = new Array();
  for (var index in arr) {
      temp_array.push(arr[index]);
      //console.log(temp_array)
  }
  //取出的数值项,保存在此数组
  var return_array = new Array();
  for (var i = 0; i<num; i++) {
      //判断如果数组还有可以取出的元素,以防下标越界
      if (temp_array.length>0) {
          //在数组中产生一个随机索引
          var arrIndex = Math.floor(Math.random()*temp_array.length);
          //将此随机索引的对应的数组元素值复制出来
          return_array[i] = temp_array[arrIndex];
          //然后删掉此索引的数组元素,这时候temp_array变为新的数组
          temp_array.splice(arrIndex, 1);
      } else {
          //数组中数据项取完后,退出循环,比如数组本来只有10项,但要求取出20项.
          break;
      }
  }
  console.log(return_array,'lookathere!')
  return return_array;
}


//在指纹库中任意选取n个用于混淆的扩展指纹
function randomChoose(n){
  var subset_msg = getArrayItems(msg_db,n);
  var subset_http = getArrayItems(http_db,n)
  var temp_msg = new Array()
  var temp_http = new Array();
  console.log('msg:',subset_msg,' ','http:',subset_http)
  for(var i = 0; i<n; i++){
    temp_msg[i] = subset_msg[i].f;
    temp_http[i] = subset_http[i].f;
  }
  console.log(temp_msg,temp_http)

  var result={}
  result["msg"]=[];
  result["http"]=[];

  temp_msg.map(item => {
    result["msg"].splice(result["msg"].length, 0, item)
})

  temp_http.map(item2 => {
    result["http"].splice(result["http"].length, 0, item2)
})
  console.log(result,'result')
  return result
}

//对于某一个请求url的资源类型进行判断
function Type(link){
  var url = link
  var extension = url.split(".")[-1]
  for(var key in mapping){
      var item = mapping[key]
      if(extension in item){return key}
  }
  return null
}

function addFakeLink(src,type){
    var iframe = document.createElement("img");
  /*switch (type) {
      case 'pictures':
          var iframe = document.createElement("img");

          break;
      case 'webpage':

          var iframe = document.createelement("")
          iframe.src = src
          iframe.setAttribute("style","display: none;")
          document.body.appendChild(iframe)
          break;
      default:{
          console.log('you need to update your mapping code!')
          console.log(src)
      }
  }*/
  try{
    iframe.src = src
    iframe.setAttribute("style","display: none;")
     document.body.appendChild(iframe);
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

  var result = randomChoose(n);
  console.log('debug2',result)
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




