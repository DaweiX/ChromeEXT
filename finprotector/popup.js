var myid = 'fapnbolmcjcfifjfkpjfidbkokfldklg';
var async = require('async');

$(document).ready(function () {
    addlog('Finprotector Init', 'green');
    var items = document.createElement('div');
    $(".list").html(items);
    $("#btn4").click(function () {
        console.clear();
        printlog();
        clearlog();
    });
    
});
