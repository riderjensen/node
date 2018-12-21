const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');

const User = require('./models/user');
const mongoose = require('mongoose');

app.use(bodyParser.urlencoded({
	extended: false,
	useNewUrlParser: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', './src/views');

app.use((req, res, next) => {
	User.findById("5c1d160bb235804634bd8b2f")
		.then(user => {
			req.user = user;
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

mongoose.connect('mongodb+srv://rider:12345678Ah@nodecourse-zfafv.mongodb.net/shop?retryWrites=true')
	.then(() => {
		User.findOne().then(user => {
			if (!user) {
				const user = new User({
					name: 'Rider',
					email: 'riderjensen@gmail.com',
					cart: {
						items: []
					}
				})
				user.save();
			}
		})



		app.listen(8080, () => {
			console.log('Server running')
		});
	})
	.catch(err => console.log(err))
