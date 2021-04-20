① ./routes/index.js添加代码

/----------------开头添加功能函数------------------/ 
var async = require('async');
const readXlsxFile = require('read-excel-file/node');

function randomInteger(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    rand = Math.round(rand);
    return rand;
}

function generateArray(type, n){
    var randomArray = []
    for(var i=0;i<n;i++){
        while(1){
            var temp = 0
            if(type =='msg'){temp = randomInteger(0,426)}
            else{temp = randomInteger(0,765)}
            if(randomArray.indexOf(temp)<0){
                randomArray.push(temp)
                break;
             }
        }
     }
    return randomArray.sort(function(a,b){return a-b})
}


##注意修改路径
/----------------添加API-----------------/
router.post('/function_test', (function(req,res,next){
    var noise = []
    var dict = req.body;
    console.log(dict)
    var type = dict['type']
    var count =parseInt(dict['count'])
    var _array = generateArray(type, count)
    if(type == 'http'){
    readXlsxFile('/Users/liuqiange/ChromeEXT/honey/routes/http.xlsx').then((rows) =>{
    for(var x=0; x<_array.length; x++){
    try{
        var _index = _array[x]
        var end = rows[_index][1].length -1
	var noise_array = rows[_index][1].substring(1,end).split(',')
        for(var t = 0;t<noise_array.length;t++){
            _end = noise_array[t].length-1
            temp = noise_array[t].substring(1,_end)
            noise.push(temp)
    }}catch(err){continue}
    }
    console.log(noise)
    res.send(noise)
    })

    }else{
        readXlsxFile('/Users/liuqiange/ChromeEXT/honey/routes/msg.xlsx').then((rows) =>{
        var count = 0
        var noise_dict ={}
        for(var x=0; x<_array.length; x++){
            try{
            var _index = _array[x]
            var end = rows[_index][1].length -1
            console.log(rows[_index][1])
            try{
                var noise_array = eval('('+ rows[_index][1] + ')')
                console.log(noise_array)

                for(var item=0; item <Object.keys(noise_array).length; item++){
                    noise_dict[count+''] = Object.values(noise_array)[item]
                    count++
                }
            }
            catch(err){
                console.log('fail')
                var noise_array = rows[_index][1]
                noise_dict[count+''] =rows[_index][1]
                count++;
            }

            }catch(err){continue}



        }
        console.log('msgmsg')
        console.log(noise_dict)
        res.send(noise_dict)
       })

}}))
/----------------添加API------------------/ 




