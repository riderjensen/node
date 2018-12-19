const express = require('express');

const productsController = require('../controllers/shop');

const router = express.Router();

router.get('/', productsController.getIndex);

router.get('/products', productsController.getProducts);

router.get('/products/:id', productsController.getSingleProduct);

router.get('/cart', productsController.getCart);

router.post('/cart', productsController.postCart);

router.post('/cart-delete-item', productsController.postCartDelete);

router.get('/checkout', productsController.getCheckout);

router.get('/orders', productsController.getOrders);

module.exports = router;