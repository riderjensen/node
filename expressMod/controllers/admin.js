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
		description
	} = req.body;
	const product = new Product(title, price, description, imageURL, null, req.user._id);
	product.save().then(() => {
		res.redirect('/admin/products')
	}).catch(err => console.log(err));

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
				product
			});
		})
		.catch(err => console.log(err));
}

exports.postEditProduct = (req, res) => {
	const prodId = req.body.productId;
	const updatedTitle = req.body.title;
	const updatedPrice = req.body.price;
	const updatedImageURL = req.body.imageURL;
	const updatedDescription = req.body.description;

	const product = new Product(updatedTitle, updatedPrice, updatedDescription, updatedImageURL, prodId)
	product.save()
		.then((response) => {
			console.log('Updated product');
			res.redirect('/admin/products');
		})
		.catch(err => console.log(err));
}

exports.getProductsAll = (req, res) => {
	Product.fetchAll()
		.then(products => {
			res.render('admin/products', {
				products,
				title: 'Products Page',
				path: '/admin/products'
			});
		})
		.catch(err => console.log(err));
}

exports.postDeleteProduct = (req, res) => {
	const prodId = req.body.productId;
	Product.deleteItem(prodId)
		.then(result => {
			console.log('obj destroyed');
			res.redirect('/admin/products');
		})
		.catch(err => console.log(err));

}