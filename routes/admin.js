const express = require('express');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');
const { body } = require('express-validator/check');

const router = express.Router();

router.get('/add-product', [
	body('title').isAlphanumeric().trim().isLength({ min: 3 }),
	body('imageURL').isURL(),
	body('title').isFloat(),
	body('title').trim().isLength({ min: 8 })
], isAuth, adminController.getAddProduct);

router.post('/add-product', isAuth, adminController.postAddProduct);

router.get('/products', isAuth, adminController.getProductsAll);

router.get('/edit-product/:id', isAuth, adminController.getEditProduct);

router.post('/edit-product', isAuth, adminController.postEditProduct);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;