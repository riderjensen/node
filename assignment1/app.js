const http = require('http');

const ourServer = http.createServer((req, res) => {
	if (req.url == '/users') {
		res.write('User one and two and three.');
		return res.end();
	} else if (req.url == '/create-user') {
		console.log(req.headers);
	} else if (req.url == '/') {
		res.setHeader('Content-Type', 'text/html');
		res.write('Good evening sir');
		res.write('<!DOCTYPE html> <html lang = "en" > ')
		res.write('<head></head><body>');
		res.write('<form action="/create-user" method="POST"><input type="text" value="testing" name="addUser" /><button type="submit">Submit</button></form>')
		res.write('</body></html>')
		return res.end();
	}
});

ourServer.listen(8080, () => console.log('run it'));