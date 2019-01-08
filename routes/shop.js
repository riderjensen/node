const express = require('express');

const productsController = require('../controllers/shop');
const isAuth = require('../middleware/is-auth');
const router = express.Router();

router.get('/', productsController.getIndex);

router.get('/products', productsController.getProducts);

router.get('/products/:id', productsController.getSingleProduct);

router.get('/cart', isAuth, productsController.getCart);

router.post('/cart', isAuth, productsController.postCart);

router.post('/cart-delete-item', isAuth, productsController.postCartDelete);

router.post('/create-order', isAuth, productsController.postOrder);

router.get('/orders', isAuth, productsController.getOrders);

router.get('/orders/:orderId', isAuth, productsController.getInvoice);

module.exports = router;