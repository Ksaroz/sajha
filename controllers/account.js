exports.getAccount = (req, res, next) => {
    res.render('accounts/account', { title: 'Account' });
}