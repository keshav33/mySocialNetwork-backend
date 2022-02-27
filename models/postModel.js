const { getDb } = require('../utils/mongo');
const mongodb = require('mongodb');

exports.findAllPosts = (userId) => {
    return new Promise((resolve, reject) => {
        const db = getDb();
        db.collection('posts').find({}).toArray((err, result) => {
            if (err) {
                reject(err);
            } else {
                const formatedResult = (result || []).map(post => {
                    return {
                        ...post,
                        isLiked: post.likes.includes(userId)
                    }
                })
                resolve(formatedResult);
            }
        })
    })
}

exports.insertNewPost = (post) => {
    return new Promise((resolve, reject) => {
        const db = getDb();
        db.collection('posts').insertOne(post, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    })
}

exports.toggleLikeOnPostOrComment = (filterId, userId, isPost) => {
    const collectionName = isPost ? 'posts' : 'comments';
    return new Promise((resolve, reject) => {
        const db = getDb();
        db.collection(collectionName).findOne({ _id: new mongodb.ObjectID(filterId), likes: {$in: [userId] }}, (err, result) => {
            if (err) {
                reject(err);
            } else {
                const query = { _id: new mongodb.ObjectID(filterId) };
                if (result) {
                    const update = { $pull: { likes: userId } };
                    db.collection(collectionName).updateOne(query, update, (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                } else {
                    const update = { $push: { likes: userId } };
                    db.collection(collectionName).updateOne(query, update, (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                }
            }
        })
    })
}

exports.insertNewComment = (commentBody) => {
    return new Promise((resolve, reject) => {
        const db = getDb();
        db.collection('comments').insertOne(commentBody, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    })
}

exports.getAllUsersWhoLikedPostOrComment = (id, isPost) => {
    const collectionName = isPost ? 'posts' : 'comments'
    return new Promise((resolve, reject) => {
        const db = getDb();
        db.collection(collectionName).findOne({_id: new mongodb.ObjectID(id)}, (err, result) => {
            if (err) {
                reject(err);
            } else {
                if (result) {
                    const { likes } = result;
                    const ObjectIds = likes.map(like => new mongodb.ObjectID(like));
                    db.collection('users').find({ _id: {$in: ObjectIds} }, { projection: { password: 0 } } ).toArray((err, result) => {
                        if (err) {
                            reject(err);
                        } else {
                            if (result) {
                                resolve(result);
                            } else {
                                resolve([]);
                            }
                        }
                    })
                } else {
                    resolve([]);
                }
            }
        });
    })
}

exports.getAllUsersWhoCommented = (postId) => {
    return new Promise((resolve, reject) => {
        const db = getDb();
        db.collection('comments').find({postId: postId}).toArray((err, result) => {
            if (err) {
                reject(err);
            } else {
                const users = (result || []).map(comment => comment.userId);
                const uniqueUsers = [...new Set(users)];
                const ObjectIds = uniqueUsers.map(userId => new mongodb.ObjectID(userId));
                db.collection('users').find({ _id: {$in: ObjectIds} }, { projection: { password: 0 } } ).toArray((err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        if (result) {
                            resolve(result);
                        } else {
                            resolve([]);
                        }
                    }
                })
            }
        })
    })
}