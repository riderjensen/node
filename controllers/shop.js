const Product = require('../models/product');
const Order = require('../models/order')
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const localVars = require('../local_vars');
const stripe = require("stripe")(localVars.stripeToken);


const ITEMS_PER_PAGE = 2;

exports.getIndex = (req, res) => {
	const page = +req.query.page || 1;
	let totalItems;
	Product.find().countDocuments().then(numProds => {
			totalItems = numProds;
			return Product.find()
				.skip((page - 1) * ITEMS_PER_PAGE)
				.limit(ITEMS_PER_PAGE)
		})
		.then(products => {
			res.render('shop/index', {
				products: products,
				title: 'Home',
				path: '/',
				currentPage: page,
				hasNextPage: ITEMS_PER_PAGE * page < totalItems,
				hasPreviousPage: page > 1,
				nextPage: page + 1,
				previousPage: page - 1,
				lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
			});
		})
		.catch(err => next(err));
}

exports.getProducts = (req, res, next) => {
	const page = +req.query.page || 1;
	let totalItems;
	Product.find().countDocuments().then(numProds => {
			totalItems = numProds;
			return Product.find()
				.skip((page - 1) * ITEMS_PER_PAGE)
				.limit(ITEMS_PER_PAGE)
		})
		.then(products => {
			res.render('shop/product-list', {
				products: products,
				title: 'Products',
				path: '/products',
				currentPage: page,
				hasNextPage: ITEMS_PER_PAGE * page < totalItems,
				hasPreviousPage: page > 1,
				nextPage: page + 1,
				previousPage: page - 1,
				lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
			});
		})
		.catch(err => next(err));
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

exports.getCheckout = (req, res, next) => {
	req.user
		.populate('cart.items.productId')
		.execPopulate()
		.then(user => {
			const products = user.cart.items;
			let total = 0;
			products.forEach(element => {
				console.log(element);
				total += parseInt(element.quantity) * parseFloat(element.productId.price);
			});
			res.render('shop/checkout', {
				title: 'Checkout',
				path: '/checkout',
				products,
				totalSum: total
			});
		})
		.catch(err => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});

}

exports.postOrder = (req, res, next) => {
	const token = req.body.stripeToken;
	let totalSum = 0;

	req.user
		.populate('cart.items.productId')
		.execPopulate()
		.then(user => {
			user.cart.items.forEach(p => {
				totalSum += p.quantity * p.productId.price
			});
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
			const charge = stripe.charges.create({
				amount: totalSum,
				currency: 'usd',
				description: 'Example charge',
				source: token,
				metadata: {
					order_id: result._id.toString()
				}
			});
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
			console.log(order);
			if (order.user.userId.toString() !== req.user._id.toString()) {
				return next(new Error('Not authorized'));
			}
			const invoiceName = `invoice-${orderId}.pdf`;
			const invoicePath = path.join('data', 'invoices', invoiceName);
			const pdfDoc = new PDFDocument();
			res.setHeader('content-Type', 'application/pdf');
			res.setHeader('Content-Disposition', 'attachment; filename="' + invoiceName + ' "');
			pdfDoc.pipe(fs.createWriteStream(invoicePath));
			pdfDoc.pipe(res);

			pdfDoc.fontSize(26).text('Hello world');
			pdfDoc.end();

			const file = fs.createReadStream(invoicePath);

			file.pipe(res);

		})
		.catch(err => next(err))

}