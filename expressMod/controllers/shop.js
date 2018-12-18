const Product = require('../models/product');

exports.getIndex = (req, res) => {
	Product.fetchAll(products => {
		res.render('shop/index', {
			products,
			title: 'Home',
			path: '/'
		});
	});
}

exports.getProducts = (req, res, next) => {
	Product.fetchAll(products => {
		res.render('shop/product-list', {
			products,
			title: 'Products',
			path: '/product-list'
		});
	});
}


exports.getCart = (req, res, next) => {
	res.render('shop/cart', {
		title: 'Cart',
		path: '/cart'
	});
}
exports.getOrders = (req, res, next) => {
	res.render('shop/orders', {
		title: 'Your Orders',
		path: '/orders'
	});
}


exports.getCheckout = (req, res) => {
	res.render('shop/checkout', {
		title: 'Checkout',
		path: '/checkout'
	});
}