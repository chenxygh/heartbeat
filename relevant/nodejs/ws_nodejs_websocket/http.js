/*
* @Author: cxy
* @Date:   2019-04-08 00:26:50
* @Last Modified by:   cxy
* @Last Modified time: 2019-04-08 00:29:56
*/

var http = require('http');
 
http.createServer(function (request, response) {
	// 终端打印如下信息
	console.log('Server running at http://127.0.0.1:8888/');
	
    // 发送 HTTP 头部 
    // HTTP 状态值: 200 : OK
    // 内容类型: text/plain
    response.writeHead(200, {'Content-Type': 'text/plain'});
 
    // 发送响应数据 "Hello World"
    response.end('Hello World\n');
}).listen(8888);
