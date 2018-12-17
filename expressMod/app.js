const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');

app.use(bodyParser.urlencoded({
	extended: false,
	useNewUrlParser: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', './src/views');

app.use('/admin', adminRoutes);
app.use(shopRoutes);

// views
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(errorController.get404);

app.listen(8080, () => {
	console.log('Server running')
});