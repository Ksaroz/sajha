const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.postSignUp = (req, res, next) => {
    bcrypt.hash(req.body.password, 12)
    .then(hashed => {
        const user = new User({
            email: req.body.email,
            password: hashed
        });
    user.save()
    .then(result => {
        res.status(201).json({
            message: "User Created Successfully",
            result: result
        });
    }).catch(err => console.log(err));
    })
    .catch(err => console.log(err));
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email })
    .then(user => {
        if (!user) {
            res.status(401).json({
                message: "Authentication Failed"
            });
        }
        bcrypt
        .compare(password, user.password)
        .then(matchedPassword => {

            if (!matchedPassword) {
                res.status(401).json({
                    message: "Authentication Failed"
                });
            }
            const token = jwt.sign({email: user.email, userId: user._id},
                'secret_this_should_be_longer',
                {expiresIn: "1h"});
            res.status(200).json({
                token: token,
                expiresIn: 3600
            });
        })
        .catch(err => {
            res.status(401).json({
                message: "Authentication Failed"
            });
        });
    })
    .catch(err => { 
        console.log(err);
    });
};
