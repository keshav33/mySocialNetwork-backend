const { findAllPosts, insertNewPost, insertNewComment, toggleLikeOnPostOrComment, getAllUsersWhoLikedPostOrComment, getAllUsersWhoCommented } = require("../models/postModel");
const { getCurrentDate } = require("../utils/formater");

exports.getAllPost = (req, res) => {
    findAllPosts()
        .then((result) => {
            res.status(202).send({posts: result});
        }).catch(error => {
            console.log(error);
            res.status(500).send({ message: 'Unable to get all post', code: 500});
        })
}

exports.createPost = (req, res) => {
    const { title, content, userId } = req.body;
    const postBody = {
        userId,
        title,
        content,
        likes: [],
        creationDate: getCurrentDate()
    }
    insertNewPost(postBody)
        .then(() => {
            res.status(202).send('Ok');
        }).catch(error => {
            console.log(error);
            res.status(500).send({ message: 'Unable to create post', code: 500});
        })
}

exports.likePost = (req, res) => {
    const { postId, userId } = req.query;
    toggleLikeOnPostOrComment(postId, userId, true)
        .then(() => {
            res.status(202).send('Ok');
        }).catch(error => {
            console.log(error);
            res.status(500).send({ message: 'Unable to like post', code: 500});
        })
}

exports.commentPost = (req, res) => {
    const { comment, postId, userId } = req.body;
    const commentBody = {
        postId,
        userId,
        comment,
        likes: []
    }
    insertNewComment(commentBody)
        .then(() => {
            res.status(202).send('Ok');
        }).catch(error => {
            console.log(error);
            res.status(500).send({ message: 'Unable to add comment', code: 500});
        })
}

exports.likeComment = (req, res) => {
    const { commentId, userId } = req.query;
    toggleLikeOnPostOrComment(commentId, userId, false)
        .then(() => {
            res.status(202).send('Ok');
        }).catch(error => {
            console.log(error);
            res.status(500).send({ message: 'Unable to like post', code: 500});
        })
}

exports.postLikedUsers = (req, res) => {
    const { postId } = req.query;
    getAllUsersWhoLikedPostOrComment(postId, true)
        .then((users) => {
            res.status(200).send({users});
        }).catch(error => {
            console.log(error);
            res.status(500).send({ message: 'Unable to find users', code: 500});
        })
}

exports.commentLikedUsers = (req, res) => {
    const { commentId } = req.query;
    getAllUsersWhoLikedPostOrComment(commentId, false)
        .then((users) => {
            res.status(200).send({users});
        }).catch(error => {
            console.log(error);
            res.status(500).send({ message: 'Unable to find users', code: 500});
        })
}

exports.usersWithComment = (req, res) => {
    const { postId } = req.query;
    getAllUsersWhoCommented(postId)
        .then((users) => {
            res.status(200).send({users});
        }).catch(error => {
            console.log(error);
            res.status(500).send({ message: 'Unable to find users', code: 500});
        })
}