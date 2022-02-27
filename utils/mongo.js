const { MongoClient } = require('mongodb');

const DB_URL = process.env.DB_URL;
const DB_NAME = process.env.DB_NAME;

let db = null;

exports.getDb = () => {
    return db;
}

exports.initialiseDb = () => {
    const client = new MongoClient(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {
        if (err) {
            console.log('Unable to connect to db', err);
            db = null;
        } else {
            console.log('connected to db')
            db = client.db(DB_NAME);
        }
    })
}