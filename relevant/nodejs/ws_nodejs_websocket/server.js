var ws = require('nodejs-websocket');

var server = ws.createServer(function (conn) {
	console.log('is listening port: 33333');
	conn.on('text', function (str) {
		console.log(str);
		console.log(str.substring(0, 5));
		if (str.substring(0, 5) === 'data-') {
			var data = str.substring(5, str.length);
			console.log(data);
			var arr = [];
			hexStrToByte(data, arr);
			
			var sIndex = arr.indexOf('S');
			var bIndex = arr.indexOf('B') == -1? 0: arr.indexOf('B');
			var qIndex = arr.indexOf('Q') == -1? 0: arr.indexOf('Q');

			var sData = bIndex? arr.slice(sIndex, bIndex): arr.slice(sIndex, arr.length);
			sData = sData.toString().replace(/\,/g, '');
			sData = sData.toString().replace(/(\r\n)|(\n)/g, '');
			var bData = bIndex && arr.slice(bIndex, qIndex);
			bData = bData.toString().replace(/\,/g, '');
			bData = bData.toString().replace(/(\r\n)|(\n)/g, '');
			var qData = qIndex && arr.slice(qIndex, arr.length);
			qData = qData.toString().replace(/\,/g, '');
			qData = qData.toString().replace(/(\r\n)|(\n)/g, '');

			var res = JSON.stringify({
				sData: sData,
				bData: bData,
				qData: qData
			});
			broadcast(res);
			console.log(res);
		} else {
			var res = JSON.stringify({
				sData: null,
				bData: null,
				qData: null,
				str: str
			});
			broadcast(res);
		}
	});

	conn.on('close', function () {
		broadcast('closed');
	});

	conn.on('error', function (err) {
		console.log(err);
	});
}).listen(33333);

function broadcast (str) {
	server.connections.forEach( function(conn) {
		// console.log(conn);
		conn.sendText(str);
	});
}


function hexStrToByte (str, arr) {	
	for (var i = 0; i < str.length - 1; i += 2) {
		var temp = parseInt(str.substring(i, i + 2), 16);
		arr.push(String.fromCharCode(temp));
	}
}