const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const mongoDBStore = require('connect-mongodb-session')(session);

const MONGODB_URI = 'mongodb+srv://rider:12345678Ah@nodecourse-zfafv.mongodb.net/shop';

const app = express();
const store = new mongoDBStore({
	uri: MONGODB_URI,
	collection: 'sessions'
})

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const errorController = require('./controllers/error');

const User = require('./models/user');
const mongoose = require('mongoose');

app.use(bodyParser.urlencoded({
	extended: false,
	useNewUrlParser: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', './src/views');

app.use(session({ secret: 'mygoodsecrettext', resave: false, saveUninitialized: true, store: store }));

app.use((req, res, next) => {
	if (!req.session.user) {
		return next();
	}
	User.findById(req.session.user._id)
		.then(user => {
			req.user = user;
			next();
		})
		.catch(err => console.log(err))
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

// views
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(errorController.get404);

mongoose.connect(MONGODB_URI)
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
