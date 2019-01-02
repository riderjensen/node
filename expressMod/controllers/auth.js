const User = require('../models/user');

exports.getLogin = (req, res) => {
	res.render('auth/login', {
		path: '/login',
		title: 'Login',
		isAuthenticated: false
	})
};

exports.postLogin = (req, res) => {
	User.findById("5c1d160bb235804634bd8b2f")
		.then(user => {
			req.session.isLoggedIn = true;
			req.session.user = user;
			req.session.save(err => {
				if (err) console.log(err);
				res.redirect('/');
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

}

exports.postLogout = (req, res) => {
	req.session.destroy((err) => {
		if (err) console.log(err)
		res.redirect('/');
	})
}