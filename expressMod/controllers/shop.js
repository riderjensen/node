const Product = require('../models/product');

exports.getIndex = (req, res) => {
	Product.fetchAll()
		.then(products => {
			res.render('shop/index', {
				products: products,
				title: 'Home',
				path: '/'
			});
		})
		.catch();
}

exports.getProducts = (req, res, next) => {
	Product.fetchAll()
		.then(products => {
			res.render('shop/product-list', {
				products: products,
				title: 'Products',
				path: '/product-list'
			});
		})
		.catch(err => console.log(err));
}

exports.getSingleProduct = (req, res, next) => {
	const productId = req.params.id;
	Product.findById(productId)
		.then(product => {
			res.render('shop/product-detail', {
				product: product,
				title: 'Product Detail',
				path: '/product-detail'
			});
		})
		.catch(err => console.log(err));
}


exports.getCart = (req, res, next) => {
	req.user.getCart()
		.then(products => {
			res.render('shop/cart', {
				title: 'Cart',
				path: '/cart',
				products
			});
		})
		.catch(err => console.log(err));
}

exports.postCart = (req, res, next) => {
	const prodId = req.body.productID;
	Product.findById(prodId)
		.then(product => {
			return req.user.addToCart(product);
		})
		.then(result => {
			console.log('Cart updated');
			res.redirect('/cart');
		})
}

exports.postCartDelete = (req, res, next) => {
	const prodId = req.body.productID;
	req.user.deleteItemFromCart(prodId)
		.then(cart => {
			res.redirect('/cart');
		})
		.catch(err => console.log(err));
}

exports.postOrder = (req, res, next) => {
	req.user
		.addOrder()
		.then(result => {
			res.redirect('/orders');
		})
		.catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
	req.user.getOrders()
		.then(orders => {
			res.render('shop/orders', {
				title: 'Your Orders',
				path: '/orders',
				orders
			});
		})
		.catch(err => console.log(err));



}
