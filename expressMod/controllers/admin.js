const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
	res.render('admin/add-product', {
		title: "Add Product",
		path: '/admin/add-product'
	});
}

exports.postAddProduct = (req, res) => {
	const {
		title,
		imageURL,
		price,
		desc
	} = req.body;
	const products = new Product(title, imageURL, desc, price);
	products.save();
	res.redirect('/');
}

exports.getProductsAll = (req, res) => {
	Product.fetchAll(products => {
		res.render('admin/products', {
			products,
			title: 'Products Page',
			path: '/admin/products'
		});
	});
}