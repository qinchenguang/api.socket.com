var ws = require('nodejs-websocket');
console.log("开始启动服务器..");
var adminUser = null, //控制用户
adminUserKey = null,
adminUserReady = false, 

receiveUser = null,//接受用户
receiveUserKey = null,
receiveUserReady = false;

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
}).listen(8008);
console.log("启动完毕..")
