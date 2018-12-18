const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
	res.render('admin/edit-product', {
		title: "Add Product",
		path: '/admin/add-product',
		editing: false
	});
}

exports.postAddProduct = (req, res) => {
	const {
		title,
		imageURL,
		price,
		desc
	} = req.body;
	const products = new Product(null, title, imageURL, desc, price);
	products.save();
	res.redirect('/');
}

exports.getEditProduct = (req, res) => {
	const editMode = req.query.edit;
	if (!editMode) {
		return res.redirect('/');
	}
	const prodId = req.params.id;
	Product.findById(prodId, product => {
		if (!product) {
			return res.redirect('/');
		}
		res.render('admin/edit-product', {
			title: "Edit Product",
			path: '/admin/add-product',
			editing: editMode,
			product
		});
	})
}

exports.postEditProduct = (req, res) => {
	const prodId = req.body.productId;
	const updatedTitle = req.body.title;
	const updatedPrice = req.body.price;
	const updatedImageURL = req.body.imageURL;
	const updatedDescription = req.body.desc;
	const updatedProduct = new Product(prodId, updatedTitle, updatedImageURL, updatedDescription, updatedPrice);
	updatedProduct.save();
	res.redirect('/admin/products');
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

exports.postDeleteProduct = (req, res) => {
	const prodId = req.body.productId;
	Product.deleteById(prodId);
	res.redirect('/admin/products');
}