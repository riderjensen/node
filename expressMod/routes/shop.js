const express = require('express');

const productsController = require('../controllers/shop');

const router = express.Router();

router.get('/', productsController.getIndex);

router.get('/products', productsController.getProducts);

router.get('/cart', productsController.getCart);

router.get('/checkout', productsController.getCheckout);

router.get('/orders', productsController.getOrders);

module.exports = router;