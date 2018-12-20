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
	req.user.createProduct({
		title,
		price,
		imageURL,
		description
	})
		.then(result => {
			console.log('created product');
			res.redirect('/admin/products')
		})
		.catch(err => console.log(err))

}

exports.getEditProduct = (req, res) => {
	const editMode = req.query.edit;
	if (!editMode) {
		return res.redirect('/');
	}
	const prodId = req.params.id;
	req.user.getProducts({ where: { id: prodId } })
		.then(products => {
			const product = products[0];
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
	Product.findByPk(prodId)
		.then(product => {
			product.title = updatedTitle;
			product.price = updatedPrice;
			product.imageURL = updatedImageURL;
			product.description = updatedDescription;
			return product.save();
		})
		.then((response) => {
			console.log('Updated product');
			res.redirect('/admin/products');
		})
		.catch(err => console.log(err));
}

exports.getProductsAll = (req, res) => {
	req.user.getProducts()
		.then(products => {
			res.render('admin/products', {
				products,
				title: 'Products Page',
				path: '/admin/products'
			});
		})
		.catch();
}

exports.postDeleteProduct = (req, res) => {
	const prodId = req.body.productId;
	Product.findByPk(prodId)
		.then(product => {
			return product.destroy();
		})
		.then(result => {
			console.log('obj destroyed');
			res.redirect('/admin/products');
		})
		.catch(err => console.log(err));

}