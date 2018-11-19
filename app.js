var ws = require('nodejs-websocket');
console.log("开始启动服务器..");
var userList = [];
var PORT = getArgArray(process.argv)['PORT'] || '1112';
var  server = ws.createServer(function(conn){
    //console.log(conn.key) socket 唯一标识key
    conn.on("text", function (str) {
        var currentKey = conn.key;
        var isHas = false;
        for(var i = 0; i < userList.length; i++){
            if(userList[i].key == currentKey){
                isHas = true;
            }else{
                if(typeof userList[i] == 'object'){
                    userList[i].sendText(str);
                }else{
                    userList.splice(i,1);
                    i--;
                }
            }
        }
        if(!isHas){
            userList.push(conn);
        }
    })
    conn.on("close", function (code, reason) {
        var currentKey = conn.key;
        //console.log(userList);
        for(var i = 0; i < userList.length; i++){
            if(typeof userList[i] == 'object'){
                if(userList[i].key == currentKey){
                    userList.splice(i,1);
                    i--;
                }
            }else{
                userList.splice(i,1);
                i--;
            }
        }
    });
    conn.on("error", function (code, reason) {
        //console.log("异常关闭") 
        var currentKey = conn.key;
        for(var i = 0; i < userList.length; i++){
            if(typeof userList[i] == 'object'){
                if(userList[i].key == currentKey){
                    userList.splice(i,1);
                    i--;
                }
            }else{
                userList.splice(i,1);
                i--;
            }
        }
    });
}).listen(PORT);

console.log("端口：" + PORT + "启动完毕..");



function getArgArray(array){
    var oldArray = array.slice(2);
    var newObj = {};
    oldArray.forEach(function(str){
        if(str.indexOf('=') != -1){
            var splitArray = str.split('=');
            if(splitArray.length == 2){
                var key = splitArray[0];
                var value = splitArray[1];
                if(key !== undefined && value !== undefined){
                    newObj[key] = value;
                }
            }
        }
    })
    return newObj;
}