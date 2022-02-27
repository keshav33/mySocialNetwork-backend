const { getDb } = require('../utils/mongo');

exports.insertNewUser = (user) => {
    return new Promise((resolve, reject) => {
        const db = getDb();
        db.collection('users').insertOne(user, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    })
}

exports.getExistingUser = (user) => {
    return new Promise((resolve, reject) => {
        const db = getDb();
        db.collection('users').findOne({email: user.email}, (err, result) => {
            if (err) {
                reject(err);
            } else {
                if (result) {
                    resolve(result);
                } else {
                    resolve(null);
                }
            }
        });
    })
} 