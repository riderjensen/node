const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = callback => {
	MongoClient.connect('mongodb+srv://rider:12345678Ah@nodecourse-zfafv.mongodb.net/shop?retryWrites=true', { useNewUrlParser: true })
		.then(client => {
			_db = client.db();
			callback(client);
		})
		.catch(err => {
			console.log(err);
			throw err;
		});
}

const getDb = () => {
	if (_db) {
		return _db;
	}
	throw 'No db found!'
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
