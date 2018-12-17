const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
	res.render('add-product', {
		title: "Add Product",
		path: '/admin/add-product'
	});
}

exports.postAddProduct = (req, res) => {
	const products = new Product(req.body.title);
	products.save();
	res.redirect('/');
}

exports.getProducts = (req, res, next) => {
	Product.fetchAll(products => {
		res.render('shop', {
			products,
			title: 'Shop Home',
			path: '/'
		});
	});

}