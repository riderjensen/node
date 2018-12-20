const ObjectId = require('mongodb').ObjectId;
const getDb = require('../utils/database').getDb;

class Product {
	constructor(title, price, description, imageURL, id, userId) {
		this.title = title;
		this.price = price;
		this.description = description;
		this.imageURL = imageURL;
		this._id = id ? ObjectId(id) : null;
		this.userId = userId;
	}

	save() {
		const db = getDb();
		let dbOp;
		if (this._id) {
			dbOp = db.collection('products').updateOne({ _id: this._id }, { $set: this });
		} else {
			dbOp = db.collection('products').insertOne(this);
		}
		return dbOp
			.then(result => {
				console.log('Inserted');
			})
			.catch(err => console.log(err));
	}
	static fetchAll() {
		const db = getDb();
		return db.collection('products')
			.find()
			.toArray()
			.then(products => {
				return products
			})
			.catch(err => console.log(err));
	}
	static findById(id) {
		const db = getDb();
		return db.collection('products')
			.findOne({ _id: ObjectId(id) })
			.then(product => {
				return product
			})
			.catch(err => console.log(err));
	}
	static deleteItem(id) {
		const db = getDb();
		return db.collection('products')
			.deleteOne({ _id: ObjectId(id) })
			.then(response => console.log('deleted'))
			.catch(err => console.log(err));
	}
}

module.exports = Product;