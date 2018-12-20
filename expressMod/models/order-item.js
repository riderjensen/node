const Sequelize = require('sequelize');

const sequalize = require('../utils/database');

const OrderItem = sequalize.define('orderItem', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true
	},
	quantity: Sequelize.INTEGER
});

module.exports = OrderItem;