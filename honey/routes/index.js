var express = require('express');
var router = express.Router();
var global_list = [];


/*var connection = mysql.createPool({
	host:'127.0.0.1',
	user:'test',
	password:'123456',
	database:'set_small'
});
connection.getConnection(function(err,connection){
	if(err){console.log(err);}
	console.log('mysql connectiong is ok!')
})*/

//lqg new added
var fs = require('fs');

var filepath = "../../output/fingerprint.csv";

function writefile(path,data){
    console.log('starting to write');
    return new Promise((resolve,reject)=>{
        const ws = fs.createWriteStream(path, {encoding:'utf8', flags:'a'});
        ws
            .on('finish',()=>resolve())
            .on('error', err=>reject(err));
        console.log((`\nWriting data to ${path}\n`));
        ws.write(data + '\n');
    })
}




function select_item(f,index,col_name){
	console.log(index,col_name);
	var querySql="SELECT `name`,"+ col_name+ " FROM fin_storage where `id` = "+ index+";";
	try{
		connection.query(querySql,function(err,result){
			if(err){console.log(err);}
			var temp = JSON.stringify(eval(result));
			console.log('index:',index, temp)
			try{
			temp = eval(temp)[0];
			var ext_name = search2(f,temp);
			console.log(ext_name)
			return ext_name;

		}
			catch(err){
			}
			return ext_name;
	})

	} catch(err){console.log(err);}
	
}

function search(f, col_name) {
	var start,end;
	var querySql = "SELECT min(`id`) as start, max(`id`) as end from fin_storage;";
   	connection.query(querySql,function(err,result){
    		if(err){console.log(err);}
    		result = JSON.stringify(result);
    		result=JSON.parse(result.substring(1).split(']')[0]);
    	start = result['start'];
    	end = result['end'];
    })
    setTimeout(function(){
    	var list = [];
    	for (var i=start;i<=end;i++){
    			var ext_name = select_item(f,i,col_name);
    			if (!isInArray(list,ext_name)) {
					list.push(ext_name);} 		
    		}
    	console.log(list);
    },300);





	
}

    function search2(f,dbitem) {
    	var temp;
    	var list = [];
	if(dbitem.http){temp = dbitem.http}
    	if(dbitem.msg){temp = dbitem.msg}
	console.log('73',temp)
		if (fingerprintMatch(f,temp)){
					extname = dbitem.name;
					global_list.push(extname);
					return extname;
		}
		else{return null}
	}


function fingerprintMatch(fin, fdb) {
	if(eval(fdb) == undefined){
		var temp2 = fdb	
	}else{var temp2 = eval(fdb)}
	var fdb = temp2;
	fin = eval(fin);
	console.log('fdb',fdb);
	console.log('fin', fin)

	var len = fdb.length;
	var matched = 0;
	fin.forEach(match);

	function match(s) {
		if (typeof fdb =='string'){
		var temp_list = [];
		temp_list.push(fdb);
		fdb = temp_list;}
		for (i = 0; i < len; i++) {
			if (JSON.stringify(s) == JSON.stringify(fdb[i])){ matched++; console.log(matched)}
		}
	}
	if (matched >= len)
		return true;
	return false;
}


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/*router.post('/add',(function(req,res,next){
    var name = req.body.name;
    var id = req.body.id;
    var table_name = req.body.table_name;
    var fingerprint = req.body.fingerprint;
    var addSqlParams = [name,id,fingerprint];
    if(table_name == 'msg'){
		var addSql = "INSERT INTO fin_storage (name,uuid,msg) VALUES (?,?,?)";
		connection.query(addSql,addSqlParams,function(err,result){
			if(err){
				console.log('[INSERT ERROR] - ' ,err.message);
				return;
			}
			console.log('-----------INSERT-----------');
			console.log('INSERT ID:',result);
			console.log('----------------------------');
		})
}
		console.log(table_name)
	    if(table_name == 'http'){
		var addSql = "INSERT INTO fin_storage (name,uuid,http) VALUES (?,?,?)";
		connection.query(addSql,addSqlParams,function(err,result){
			if(err){
				console.log('[INSERT ERROR] - ' ,err.message);
				return;
			}
			console.log('-----------INSERT-----------');
			console.log('INSERT ID:',result);
			console.log('----------------------------');
		})
}
	
}));
*/

router.post('/add',function(req,res,next){
    var temp = JSON.parse(JSON.stringify(req.body));
    var content =decodeURIComponent(Object.keys(temp)[0]);
    console.log(content);
    try{
        const ws = fs.createWriteStream(filepath, {encoding:'utf8', flags:'a'});
        console.log((`\nWriting data to ${filepath}\n`));
        ws.write(content + '\n');
        res.send('ok')
    }catch(err){
        console.log(err);
        res.send(err);
    }
})



router.post('/query',(function(req,res,next){
	var temp = JSON.parse(Object.keys(req.body)[0]);
	console.log('captured msg fingerprints',temp)
	var msg_list = temp;
	search(msg_list,'msg');
	setTimeout(function(){res.status ='success'; res.send(global_list);},1000)
}))

router.post('/query_http',(function(req,res,next){
	var temp=Object.keys(JSON.parse(JSON.stringify(req.body)))[0];
	console.log('caputured http fingerprints', temp);
	var http_list = temp;
	search(http_list,'http');
	setTimeout(function(){res.status='success'; res.send(global_list);},1000)
}))



function isInArray(arr,value){
    for(var i = 0; i < arr.length; i++){
        if(value === arr[i]){
            return true;
        }
    }
    return false;
}

module.exports = router;
