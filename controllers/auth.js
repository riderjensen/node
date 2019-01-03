const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const User = require('../models/user');

const transporter = nodemailer.createTransport(sendgridTransport({
	auth: {
		api_key: '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'
	}
}));

exports.getLogin = (req, res) => {
	let message = req.flash('error');
	if (message.length > 0) {
		message = message[0]
	} else {
		message = null;
	}
	res.render('auth/login', {
		path: '/login',
		title: 'Login',
		isAuthenticated: false,
		errorMessage: message
	})
};

exports.postLogin = (req, res) => {
	const { email, password } = req.body;
	User.findOne({ email: email })
		.then(user => {
			if (!user) {
				req.flash('error', 'Invalid email or password.');
				return res.redirect('/login');
			}
			bcrypt.compare(password, user.password)
				.then(doMatch => {
					if (doMatch) {
						req.session.isLoggedIn = true;
						req.session.user = user;
						return req.session.save(err => {
							if (err) console.log(err);
							return res.redirect('/');
						})

					}
					req.flash('error', 'Invalid email or password.');
					res.redirect('/login');
				})
				.catch(err => {
					console.log(err);
					res.redirect('/')
				})
		})
		.catch(err => console.log(err))
}

exports.getSignup = (req, res) => {
	let message = req.flash('error');
	if (message.length > 0) {
		message = message[0]
	} else {
		message = null;
	}
	res.render('auth/signup', {
		path: '/signup',
		title: 'Sign Up',
		errorMessage: message

	})
};

exports.postSignup = (req, res) => {
	const { email, password, passwordConf } = req.body;
	User.findOne({ email: email })
		.then(userDoc => {
			if (userDoc) {
				req.flash('error', 'Email already exists.');
				return res.redirect('/signup');
			}
			return bcrypt.hash(password, 12).then(hashedPassword => {
				const user = new User({
					email,
					password: hashedPassword,
					cart: { items: [] }
				});
				return user.save()
					.then(result => {
						res.redirect('/login');
						transporter.sendMail({
							to: email,
							from: 'shop@ridershop.com',
							subject: 'Welcome to the shop',
							html: '<h2>Welcome to the shop, peep it any day.'
						})
					}).catch(err => console.log(err));
				;
			})

		}).catch(err => console.log(err));
}

exports.postLogout = (req, res) => {
	req.session.destroy((err) => {
		if (err) console.log(err)
		res.redirect('/');
	})
}