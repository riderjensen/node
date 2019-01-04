const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const mongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

const MONGODB_URI = 'mongodb+srv://rider:12345678Ah@nodecourse-zfafv.mongodb.net/shop';

const app = express();
const store = new mongoDBStore({
	uri: MONGODB_URI,
	collection: 'sessions'
});

const csrfProtection = csrf();

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

app.use(session({
	secret: 'mygoodsecrettext',
	resave: false,
	saveUninitialized: true,
	store: store
}));

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
	if (!req.session.user) {
		return next();
	}
	User.findById(req.session.user._id)
		.then(user => {
			if (!user) {
				return next();
			}
			req.user = user;
			next();
		})
		.catch(err => {
			throw new Error(err);
		})
})

app.use((req, res, next) => {
	res.locals.isAuthenticated = req.session.isLoggedIn;
	res.locals.csrfToken = req.csrfToken();
	next();

})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);


app.get('/500', errorController.get500);

app.use((error, req, res, next) => {
	res.redirect('/500');
});

// views
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(errorController.get404);

mongoose.connect(MONGODB_URI)
	.then(() => {
		app.listen(8080, () => {
			console.log('Server running')
		});
	})
	.catch(err => console.log(err))