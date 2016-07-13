let jwt = require('jsonwebtoken');
let User = require('../models/user');

module.exports = (req, res, next) => {
    if(isPreflight(req) || isPublicEndpoint(req)) { next(); return; }

    var token = req.headers.authorization;
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if(payload){
            User.findOne({_id: payload.id})
                .then(user => {
                    req.user = user;
                    next();
                })
            .catch(err => {
                res.status(401).json({message: 'Authentication required.'});
            })
        }else{
            res.status(401).json({message: 'Authentication required.'});
        }
    });
};

function isPreflight(req){
    return (req.method.toLowerCase() === 'options');
}

function isPublicEndpoint(req){
    let url = req.originalUrl;

    if (req.method.toLowerCase() !== 'post') return false;
    
    if (url.includes('sessions')) return true;
    if (url.includes('users')) return true;
}
