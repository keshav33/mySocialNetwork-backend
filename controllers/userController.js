const { insertNewUser, getExistingUser } = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { capitalizeString, getCurrentDate } = require('../utils/formater');

exports.userSignup = (req, res) => {
    const user = req.body;
    getExistingUser(user)
        .then(async result => {
            if (result) {
                throw { err: 'user already exist', message: 'User Already Exist', code: 403 };
            } else {
                try {
                    const hashedPassword = await bcrypt.hash(user.password, 10);
                    const { firstName, lastName, email } = user;
                    const newUser = {
                        firstName: capitalizeString(firstName),
                        lastName: capitalizeString(lastName),
                        email,
                        password: hashedPassword,
                        creationDate: getCurrentDate()
                    };
                    insertNewUser(newUser)
                        .then(() => {
                            res.status(202).send('Ok');
                        }).catch(err => {
                            console.log(err);
                            throw { err: err, message: 'Error While Signing Up', code: 500 };
                        })
                } catch {
                    throw { err: err, message: 'Error While Signing Up', code: 500 };
                }
            }
        }).catch(error => {
            res.status(error.code).send({ message: error.message, code: error.code });
        })
}

exports.userLogin = (req, res) => {
    const user = req.body;
    getExistingUser(user)
        .then(async result => {
            if (result) {
                if (await bcrypt.compare(user.password, result.password)) {
                    const { firstName, lastName, email, _id } = result;
                    const tokenBody = { firstName, lastName, email, userId: _id };
                    const jwtToken = jwt.sign(tokenBody, process.env.ACCESS_TOKEN_SECRET);
                    res.status(200).send({ accessToken: jwtToken, tokenBody });
                } else {
                    res.status(401).send({ message: 'Incorrect Password', code: 401 });
                }
            } else {
                res.status(401).send({ message: 'No User Exist', code: 401 });
            }
        }).catch(err => {
            console.log(err);
            res.status(500).send({ message: 'Unable To Login', code: 500 });
        })
}