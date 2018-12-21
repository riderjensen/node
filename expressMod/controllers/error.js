exports.get404 = (req, res) => {
	res.status(404).render('404', {
		title: "Page not found",
		path: "",
		isAuthenticated: req.session.isLoggedIn
	});
}