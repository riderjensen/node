const Sequelize = require('sequelize');

const sequalize = require('../utils/database');

const CartItem = sequalize.define('cartItem', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true
	},
	quantity: Sequelize.INTEGER
});

module.exports = CartItem;