const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getIndex = (req, res) => {
	Product.findAll()
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
	Product.findAll()
		.then(products => {
			res.render('shop/product-list', {
				products: products,
				title: 'Products',
				path: '/product-list'
			});
		})
		.catch();
}

exports.getSingleProduct = (req, res, next) => {
	const productId = req.params.id;
	Product.findByPk(productId)
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