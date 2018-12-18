const fs = require('fs');
const path = require('path');


const p = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json');
const getProductsFromFile = (cb) => {

	fs.readFile(p, (err, data) => {
		if (err) {
			return cb([]);
		}
		cb(JSON.parse(data));
	})

}

module.exports = class Product {
	constructor(title, imageURL, description, price) {
		this.title = title;
		this.imageURL = imageURL;
		this.description = description;
		this.price = price;
	}
	save() {
		getProductsFromFile((products) => {
			products.push(this);
			fs.writeFile(p, JSON.stringify(products), (err) => {
				if (err) console.log(err)
			});
		})
	}

	static fetchAll(cb) {
		getProductsFromFile(cb);
	}
}