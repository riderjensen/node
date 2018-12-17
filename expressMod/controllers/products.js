const products = [];

exports.getAddProduct = (req, res) => {
	res.render('add-product', {
		title: "Add Product",
		path: '/admin/add-product'
	});
}

exports.postAddProduct = (req, res) => {
	products.push({
		title: req.body.title,
	})
	res.redirect('/');
}

exports.getProducts = (req, res, next) => {
	const prods = products;
	res.render('shop', {
		prods,
		title: 'Shop Home',
		path: '/'
	})
}