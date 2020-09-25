const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    console.log(req.session.isLoggedIn);
    res.render('accounts/account', { 
        title: 'Account',
        isAuthenticated: false
    });
}

exports.postLogin = (req, res, next) => {
    User.findById('5f50b5bc21e01d0cecd2b221')
    .then(user => {
        req.session.isLoggedIn = true;
        req.session.user = user;
        req.session.save(err => {
            console.log(err);
            res.redirect('/');
        });
    })
    .catch(err => console.log(err))
    };

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
}
