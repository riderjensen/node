const Product = require('../models/product');
const Order = require('../models/order')

exports.getIndex = (req, res) => {
	Product.find()
		.then(products => {
			res.render('shop/index', {
				products: products,
				title: 'Home',
				path: '/',
				isAuthenticated: req.session.isLoggedIn
			});
		})
		.catch();
}

exports.getProducts = (req, res, next) => {
	Product.find()
		.then(products => {
			res.render('shop/product-list', {
				products: products,
				title: 'Products',
				path: '/product-list',
				isAuthenticated: req.session.isLoggedIn
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
				path: '/product-detail',
				isAuthenticated: req.session.isLoggedIn
			});
		})
		.catch(err => console.log(err));
}


exports.getCart = (req, res, next) => {
	req.user
		.populate('cart.items.productId')
		.execPopulate()
		.then(user => {
			const products = user.cart.items;
			res.render('shop/cart', {
				title: 'Cart',
				path: '/cart',
				products,
				isAuthenticated: req.session.isLoggedIn
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
	req.user.removeFromCart(prodId)
		.then(cart => {
			res.redirect('/cart');
		})
		.catch(err => console.log(err));
}

exports.postOrder = (req, res, next) => {
	req.user
		.populate('cart.items.productId')
		.execPopulate()
		.then(user => {
			const products = user.cart.items.map(i => {

				return { quantity: i.quantity, product: { ...i.productId._doc } }
			});
			console.log(products)
			const order = new Order({
				user: {
					name: req.user.name,
					userId: req.user
				},
				products: products
			})
			order.save()
		})
		.then(result => {
			console.log('Cart updated');
			return req.user.clearCart();

		})
		.then(result => res.redirect('/orders'))
		.catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
	Order.find({ "user.userId": req.user._id })
		.then(orders => {
			res.render('shop/orders', {
				title: 'Your Orders',
				path: '/orders',
				orders,
				isAuthenticated: req.session.isLoggedIn
			});
		})
		.catch(err => console.log(err));
}
