const Product = require('../models/product');
const Cart = require('../models/cart');

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

exports.getSingleProduct = (req, res, next) => {
	const productId = req.params.id;
	Product.findById(productId, product => {
		res.render('shop/product-detail', {
			product,
			title: 'Product Detail',
			path: '/product-detail'
		});
	})
}


exports.getCart = (req, res, next) => {
	res.render('shop/cart', {
		title: 'Cart',
		path: '/cart'
	});
}

exports.postCart = (req, res, next) => {
	const prodId = req.body.productID;
	Product.findById(prodId, (product) => {
		Cart.addProduct(prodId, product.price);
	})
	res.redirect('/cart');
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