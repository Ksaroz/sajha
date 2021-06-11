const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/user');
// const passportHttp = require('passport-http');
// const logout = require('express-passport-logout');

exports.getLogout =  (req, res, next) => {    
    req.logout();
    console.log("User Logout Successfully");
    res.status(201).json({message: "User login out successfully"})
    //return res.redirect('/');
}

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
    //const password = req.body.password;        
    User.findOne({ email: email })
    .then(user => {
        //console.log(user);
        if (!user) {
            res.status(401).json({
                message: "User doesn't exist"
            });
       }
    
    const token = jwt.sign({email: user.email, user: user._id},
        'secret_this_should_be_longer',
        {expiresIn: "1h"});
    const userRole = user.role;
    //console.log(token);

    passport.authenticate('local', function(err, user, info) {
        console.log(user);
        if (err) { return res.status(501).json(err); }
        if (!user) { return res.status(501).json(info); }
        req.logIn(user, function(err) {
            if (err) { return res.status(501).json(err); }
            return res.status(200).json({
                message: 'User login successfully!',
                token: token,
                expiresIn: 3600,
                userRole: userRole,
                user: user._id
            });
        });        
        })(req, res, next);
    })
    .catch(err => {
        res.status(401).json({
            message: "Authentication Failed"
        });
    });    
    //res.redirect('/');
    // (req, res, next) => {
    //     res.redirect('/');
    // }; 
};

// exports.getLogout = (req, res, next) => {
//     req.logout();
//     res.redirect('/');
// };