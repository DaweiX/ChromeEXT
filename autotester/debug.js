var logsb = [];
var logpara = [];

function gtime() {
    var date = new Date();
    return date.getHours() + ":" +  date.getMinutes() + ":" + date.getSeconds();
}

var sleep = function(time) {
    var startTime = new Date().getTime() + parseInt(time, 10);
    while(new Date().getTime() < startTime) {}
};

function addlog(content, color, type) {
    color = typeof color !== 'undefined' ?  color : 'gray';
    type = typeof type !== 'undefined' ?  type : 'INFO';
    var _log = type + '\t' + gtime() + '\t%c' + content;
    logsb.push(_log);
    logpara.push('color:' + color);
}

function printlog() {
    for (i = 0; i < logsb.length; i++) {
        console.log(logsb[i], logpara[i])
    }
}

function clearlog() {
    logsb.length = 0;
    logpara.length = 0;
}
