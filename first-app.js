const http = require('http');

const server = http.createServer((req, res) => {
	const url = req.url;
	if (url === '/') {

	}
	res.write('My main text page');
	res.end();
});

server.listen(8080);