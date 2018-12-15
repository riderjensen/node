const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({
	extended: false,
	useNewUrlParser: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', './src/views');

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use((req, res) => {
	res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
})

app.listen(8080, () => {
	console.log('Server running')
});