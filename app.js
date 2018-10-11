var ws = require('nodejs-websocket');
console.log("开始启动服务器..");
var adminUser = null, //控制用户
adminUserKey = null,
adminUserReady = false, 

receiveUser = null,//接受用户
receiveUserKey = null,
receiveUserReady = false;
var PORT = getArgArray(process.argv)['PORT'] || '1112';
var  server = ws.createServer(function(conn){
    //console.log(conn.key) socket 唯一标识key
    conn.on("text", function (str) {
        var currentKey = conn.key;
        if(str==="adminUser"){
            adminUser = conn;
            adminUserReady = true;
            adminUserKey = conn.key;
        }
        if(str === "receiveUser"){
            receiveUser = conn;
            receiveUserReady = true;
            receiveUserKey = conn.key;
        }
        if(currentKey == receiveUserKey && adminUserReady){
            adminUser.sendText(str);
        }else if(currentKey == adminUserKey && receiveUserReady){
            receiveUser.sendText(str);
        }
    })
    conn.on("close", function (code, reason) {
        //console.log("关闭连接")
        var currentKey = conn.key;
        if(currentKey == receiveUserKey){
            receiveUser = null;
            receiveUserKey = null;
            receiveUserReady = false; 
        }else if(currentKey == adminUserKey){
            adminUser = null;
            adminUserKey = null;
            adminUserReady = false;
        }
    });
    conn.on("error", function (code, reason) {
        //console.log("异常关闭")
        var currentKey = conn.key;
        if(currentKey == receiveUserKey){
            receiveUser = null;
            receiveUserKey = null;
            receiveUserReady = false; 
        }else if(currentKey == adminUserKey){
            adminUser = null;
            adminUserKey = null;
            adminUserReady = false;
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