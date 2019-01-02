const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.getLogin = (req, res) => {
	res.render('auth/login', {
		path: '/login',
		title: 'Login',
		isAuthenticated: false
	})
};

exports.postLogin = (req, res) => {
	const { email, password } = req.body;
	User.findOne({ email: email })
		.then(user => {
			if (!user) {
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
	res.render('auth/signup', {
		path: '/signup',
		title: 'Sign Up',
		isAuthenticated: false
	})
};

exports.postSignup = (req, res) => {
	const { email, password, passwordConf } = req.body;
	User.findOne({ email: email })
		.then(userDoc => {
			if (userDoc) {
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
					});
			})

		}).catch(err => console.log(err));
}

exports.postLogout = (req, res) => {
	req.session.destroy((err) => {
		if (err) console.log(err)
		res.redirect('/');
	})
}