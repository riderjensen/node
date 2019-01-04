const {
	validationResult
} = require('express-validator/check');

const Product = require('../models/product');


exports.getAddProduct = (req, res) => {
	res.render('admin/edit-product', {
		title: "Add Product",
		path: '/admin/add-product',
		editing: false,
		hasError: false,
		errorMessage: null,
		errors: [],
		validationErrors: []
	});
}

exports.postAddProduct = (req, res) => {
	const {
		title,
		imageURL,
		price,
		description
	} = req.body;
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.status(422).render('admin/edit-product', {
			title: "Add Product",
			path: '/admin/add-product',
			editing: false,
			hasError: true,
			product: {
				title: title,
				imageURL: imageURL,
				price: price,
				description: description
			},
			errorMessage: errors.array()[0].msg,
			validationErrors: errors.array()
		});
	} else {
		const product = new Product({
			title,
			price,
			description,
			imageURL,
			userId: req.user
		});
		product.save()
			.then(() => {
				res.redirect('/admin/products')
			})
			.catch(err => {
				const error = new Error(err);
				error.httpStatusCode = 500;
				return next(error);
			});
	}
}

exports.getEditProduct = (req, res) => {
	const editMode = req.query.edit;
	if (!editMode) {
		return res.redirect('/');
	}
	const prodId = req.params.id;
	Product.findById(prodId)
		.then(product => {
			if (!product) {
				return res.redirect('/');
			}
			res.render('admin/edit-product', {
				title: "Edit Product",
				path: '/admin/add-product',
				editing: editMode,
				hasError: false,
				product,
				errorMessage: null,
				errors: [],
				validationErrors: []

			});
		})
		.catch(err => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
}

exports.postEditProduct = (req, res) => {
	const prodId = req.body.productId;
	const updatedTitle = req.body.title;
	const updatedPrice = req.body.price;
	const updatedImageURL = req.body.imageURL;
	const updatedDescription = req.body.description;
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.status(422).render('admin/edit-product', {
			title: "Edit Product",
			path: '/admin/edit-product',
			editing: true,
			hasError: true,
			product: {
				title: updatedTitle,
				imageURL: updatedImageURL,
				price: updatedPrice,
				description: updatedDescription,
				_id: prodId
			},
			errorMessage: errors.array()[0].msg,
			validationErrors: errors.array()
		});
	} else {
		Product.findById(prodId)
			.then(product => {
				if (product.userId.toString() !== req.user._id.toString()) {
					return res.redirect('/');
				}
				product.title = updatedTitle;
				product.price = updatedPrice;
				product.imageURL = updatedImageURL;
				product.description = updatedDescription
				return product.save()
			})
			.then((response) => {
				console.log('Updated product');
				res.redirect('/admin/products');
			}).catch(err => {
				const error = new Error(err);
				error.httpStatusCode = 500;
				return next(error);
			});
	}


}

exports.getProductsAll = (req, res) => {
	Product.find({
			userId: req.user._id
		})
		// .select('title price -_id')
		// .populate('userId', 'name')
		.then(products => {
			res.render('admin/products', {
				products,
				title: 'Products Page',
				path: '/admin/products',
			});
		})
		.catch(err => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
}

exports.postDeleteProduct = (req, res) => {
	const prodId = req.body.productId;
	Product.deleteOne({
			_id: prodId,
			userId: req.user._id
		})
		.then(result => {
			res.redirect('/admin/products');
		})
		.catch(err => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});

}