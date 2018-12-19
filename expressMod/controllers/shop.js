const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getIndex = (req, res) => {
	Product.fetchAll()
		.then(([rows]) => {
			res.render('shop/index', {
				products: rows,
				title: 'Home',
				path: '/'
			});
		})
		.catch(err => console.log(err));
}

exports.getProducts = (req, res, next) => {
	Product.fetchAll()
		.then(([rows]) => {
			res.render('shop/product-list', {
				products: rows,
				title: 'Products',
				path: '/product-list'
			});
		})
		.catch(err => console.log(err));
}

exports.getSingleProduct = (req, res, next) => {
	const productId = req.params.id;
	Product.findById(productId).then(([product]) => {
		res.render('shop/product-detail', {
			product: product[0],
			title: 'Product Detail',
			path: '/product-detail'
		});
	}).catch(err => console.log(err));
}


exports.getCart = (req, res, next) => {
	Cart.getProducts(cart => {
		Product.fetchAll(products => {
			const cartProducts = [];
			for (product of products) {
				const cartProductData = (cart.products.find(prod => prod.id === product.id));
				if (cartProductData) {
					cartProducts.push({ productData: product, qty: cartProductData.qty });
				}
			}
			res.render('shop/cart', {
				title: 'Cart',
				path: '/cart',
				products: cartProducts
			});
		})
	})
}

exports.postCart = (req, res, next) => {
	const prodId = req.body.productID;
	Product.findById(prodId, (product) => {
		Cart.addProduct(prodId, product.price);
	})
	res.redirect('/cart');
}

exports.postCartDelete = (req, res, next) => {
	const prodId = req.body.productID;
	Product.findById(prodId, product => {
		Cart.deleteProduct(prodId, product.price);
		res.redirect('/cart');
	})

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