const Product = require('../models/product');
const Order = require('../models/order')
const fs = require('fs');
const path = require('path');

exports.getIndex = (req, res) => {
	Product.find()
		.then(products => {
			res.render('shop/index', {
				products: products,
				title: 'Home',
				path: '/',
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
			});
		})
		.catch(err => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
}

exports.getSingleProduct = (req, res, next) => {
	const productId = req.params.id;
	Product.findById(productId)
		.then(product => {
			res.render('shop/product-detail', {
				product: product,
				title: 'Product Detail',
				path: '/product-detail',
			});
		})
		.catch(err => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
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
			});
		})
		.catch(err => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
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
		.catch(err => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
}

exports.postOrder = (req, res, next) => {
	req.user
		.populate('cart.items.productId')
		.execPopulate()
		.then(user => {
			const products = user.cart.items.map(i => {

				return {
					quantity: i.quantity,
					product: { ...i.productId._doc
					}
				}
			});
			console.log(products)
			const order = new Order({
				user: {
					email: req.user.email,
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
		.catch(err => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};

exports.getOrders = (req, res, next) => {
	Order.find({
			"user.userId": req.user._id
		})
		.then(orders => {
			res.render('shop/orders', {
				title: 'Your Orders',
				path: '/orders',
				orders,
			});
		})
		.catch(err => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
}

exports.getInvoice = (req, res, next) => {
	const orderId = req.params.orderId;

	Order.findById(orderId)
		.then(order => {
			if (!order) {
				return next(new Error('No order'));
			}
			if (order.userId.toString() !== req.user._id.toString()) {
				return next(new Error('Not authorized'));
			}
			const invoiceName = `invoice-${orderId}.pdf`;
			const invoicePath = path.join('data', 'invoices', invoiceName);
			// fs.readFile(invoicePath, (err, data) => {
			// 	if (err) {
			// 		return next(err);
			// 	}
			// 	res.setHeader('content-Type', 'application/pdf');
			// 	res.setHeader('Content-Disposition', 'attachment; filename="' + invoiceName + ' "');
			// 	res.send(data);
			// })
			const file = fs.createReadStream(invoicePath);
			res.setHeader('content-Type', 'application/pdf');
			res.setHeader('Content-Disposition', 'attachment; filename="' + invoiceName + ' "');
			file.pipe(res);
		})
		.catch(err => next(err))

}