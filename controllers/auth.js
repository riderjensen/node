const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');
const { validationResult } = require('express-validator/check');

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
		errorMessage: message,
		oldInput: {
			email: '',
			password: '',
		},
		validationErrors: []
	})
};

exports.postLogin = (req, res) => {
	const { email, password } = req.body;

	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).render('auth/login', {
			path: '/login',
			title: 'Login',
			isAuthenticated: false,
			errorMessage: errors.array()[0].msg,
			oldInput: {
				email: email,
				password: password,
			},
			validationErrors: []
		})
	}
	User.findOne({ email: email })
		.then(user => {
			if (!user) {

				return res.render('auth/login', {
					path: '/login',
					title: 'Login',
					isAuthenticated: false,
					errorMessage: 'Invalid email or password',
					oldInput: {
						email: email,
						password: password,
					},
					validationErrors: errors.array()
				});
			}
			bcrypt.compare(password, user.password)
				.then(doMatch => {
					if (doMatch) {
						req.session.isLoggedIn = true;
						req.session.user = user;
						return req.session.save(err => {
							if (err) console.log(err);
							return res.render('auth/login', {
								path: '/login',
								title: 'Login',
								isAuthenticated: false,
								errorMessage: 'Invalid email or password',
								oldInput: {
									email: email,
									password: password,
								},
								validationErrors: errors.array()
							});
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
		errorMessage: message,
		oldInput: {
			email: '',
			password: '',
			passwordConf: ''
		},
		validationErrors: []

	})
};

exports.postSignup = (req, res) => {
	const { email, password, passwordConf } = req.body;
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).render('auth/signup', {
			path: '/signup',
			title: 'Sign Up',
			errorMessage: errors.array()[0].msg,
			oldInput: {
				email: email,
				password: password,
				passwordConf: passwordConf
			},
			validationErrors: errors.array()

		});
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
					html: '<h2>Welcome to the shop, peep it any day.</h2>'
				})
			}).catch(err => console.log(err));

	});

}

exports.postLogout = (req, res) => {
	req.session.destroy((err) => {
		if (err) console.log(err)
		res.redirect('/');
	})
}

exports.getReset = (req, res) => {
	let message = req.flash('error');
	if (message.length > 0) {
		message = message[0]
	} else {
		message = null;
	}
	res.render('auth/reset', {
		path: '/reset',
		title: 'Reset Password',
		errorMessage: message

	})
}

exports.postReset = (req, res) => {
	crypto.randomBytes(32, (err, buffer) => {
		if (err) {
			console.log(err);
			return res.redirect('/reset');
		}
		const token = buffer.toString('hex');
		User.findOne({ email: req.body.email })
			.then(user => {
				if (!user) {
					req.flash('error', 'No account found.');
					return res.redirect('/reset');
				}
				user.resetToken = token;
				user.resetTokenExpiration = Date.now() + 3600000;
				return user.save()
					.then(result => {
						transporter.sendMail({
							to: req.body.email,
							from: 'shop@ridershop.com',
							subject: 'Reset password',
							html: `
							<p>You requested a password reset. Use the below link to reset your password.</p>
							<a href="http://localhost:8080/reset/${token}">Click here</a>
						`
						})
						res.redirect('/');
					}

					)
					.catch(err => console.log(err))
			}
			)
			.catch(err => console.log(err))
	})
}

exports.getNewPassword = (req, res) => {
	const token = req.params.token;

	User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
		.then(user => {
			let message = req.flash('error');
			if (message.length > 0) {
				message = message[0]
			} else {
				message = null;
			}
			res.render('auth/new-password', {
				path: '/new-password',
				title: 'New Password',
				errorMessage: message,
				userId: user._id.toString(),
				passwordToken: token

			})
		})
		.catch(err => console.log(err));
}

exports.postNewPassword = (req, res) => {
	const { userId, password, token } = req.body;
	let resetUser;

	User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() }, _id: userId })
		.then(user => {
			resetUser = user;
			return bcrypt.hash(password, 12)
				.then(hashedPassword => {
					resetUser.password = hashedPassword;
					resetUser.resetToken = undefined;
					resetUser.resetTokenExpiration = undefined;
					resetUser.save();
				})
				.then(result => {
					res.redirect('/login');
				})
		})
		.catch(err => console.log(err));

}