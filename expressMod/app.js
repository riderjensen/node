const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');

const mongoConnect = require('./utils/database').mongoConnect;
const User = require('./models/user');

app.use(bodyParser.urlencoded({
	extended: false,
	useNewUrlParser: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', './src/views');

app.use((req, res, next) => {
	User.findUserById("5c1bfa0b1c9d44000075bf89")
		.then(user => {
			req.user = new User(user.name, user.email, user.cart, user._id);
			next();
		})
		.catch(err => console.log(err))
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

// views
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(errorController.get404);

mongoConnect(client => {
	app.listen(8080, () => {
		console.log('Server running')
	});
});