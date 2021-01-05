const bcrypt = require('bcryptjs');
const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }

    res.render('accounts/account', { 
        title: 'Account',
        errorMsg: message
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email })
    .then(user => {
        if (!user) {
            res.status(401).json({
                message: "Authentication Failed";
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
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
                console.log(err);
                res.redirect('/');
            });
            req.flash('error', 'Invalid Email or Password.');
            res.redirect('/login');
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

exports.getRegister = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('accounts/account', { 
        title: 'Account',
        errorMsg: message
    });
}

exports.postRegister = (req, res, next) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    User.findOne({ email: email })
    .then(userDoc => {
    if(userDoc) {
        req.flash('error', 'Email Already Exists. Try New One.');
        return res.redirect('/register');
    }
    return bcrypt
    .hash(password, 12)
    .then(hashedPassword => {
        const user = new User({
        name: username,
        email: email,
        password: hashedPassword,
        cart: { items: [] }    
    })
    return user.save();
    })
    .then(result => {
        res.redirect('/login');
    });
})
    
.catch(err => {
    console.log(err);
});
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
};
