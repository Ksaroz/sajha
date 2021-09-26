exports.getProductIndex = (req, res, next) => {
    res.send('hello from express');
    console.log(req.session);
    console.log(req.user);    
}