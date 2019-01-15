const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const mongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');

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

const productsController = require('./controllers/shop');
const isAuth = require('./middleware/is-auth');

const User = require('./models/user');
const mongoose = require('mongoose');

const fileStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, './images/');
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + '-' + file.originalname);
	}
});

const fileFilter = (req, file, cb) => {
	if (
		file.mimetype === 'image/png' ||
		file.mimetype === 'image/jpg' ||
		file.mimetype === 'image/jpeg'
	) {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

app.use(bodyParser.urlencoded({
	extended: false,
	useNewUrlParser: true
}));

app.use(
	multer({
		storage: fileStorage,
		fileFilter: fileFilter
	}).single('image')
);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.set('views', './src/views');

app.use(session({
	secret: 'mygoodsecrettext',
	resave: false,
	saveUninitialized: true,
	store: store
}));

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
			next(new Error(err));
		})
})



app.post('/create-order', isAuth, productsController.postOrder);

app.use(csrfProtection);

app.use((req, res, next) => {
	res.locals.isAuthenticated = req.session.isLoggedIn;
	res.locals.csrfToken = req.csrfToken();
	next();

})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);


app.get('/500', errorController.get500);

app.use(errorController.get404);


// app.use((error, req, res, next) => {
// 	res.redirect('/500');
// });

app.use((error, req, res, next) => {
	console.log(error)
	res.status(500).render('500', {
		title: 'Error!',
		path: '/500',
		isAuthenticated: false,
		csrfToken: ''
	});
});

// views
app.set('view engine', 'ejs');
app.set('views', './views');


mongoose.connect(MONGODB_URI)
	.then(() => {
		app.listen(8080, () => {
			console.log('Server running')
		});
	})
	.catch(err => console.log(err))