const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({
	extended: false,
	useNewUrlParser: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', './src/views');

app.use('/admin', adminData.routes);
app.use(shopRoutes);

// views
app.set('view engine', 'ejs');
app.set('views', './views');

app.use((req, res) => {
	res.status(404).render('404', {
		title: "404 Page"
	});
})

app.listen(8080, () => {
	console.log('Server running')
});