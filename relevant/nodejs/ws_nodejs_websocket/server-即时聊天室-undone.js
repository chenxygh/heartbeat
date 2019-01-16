var ws = require('nodejs-websocket');

var server = ws.createServer(function (conn) {
	console.log('is listening port: 33333');
	conn.on('text', function (str) {
		console.log(str);
		var data = JSON.parse(str);

		switch (data.type) {
			case 'setname':
			conn.nickname = data.name;
			broadcast(JSON.stringify({
				name: 'server',
				text: conn.nickname + 'in'
			}));
			break;
			case 'chat':
			broadcast(JSON.stringify({
				name: conn.nickname,
				text: data.text
			}));
			break;
		}
	});

	conn.on('close', function () {
		broadcast(JSON.stringify({
			name: 'server',
			text: conn.nickname + 'leaved'
		}));
	});

	conn.on('error', function (err) {
		console.log(err);
	});
}).listen(33333);

function broadcast (str) {
	server.connections.forEach( function(conn) {
		console.log(conn);
		conn.sendText(str);
	});
}