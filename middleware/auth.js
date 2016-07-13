let jwt = require('jsonwebtoken');
let User = require('../models/user');

module.exports = (req, res, next) => {
    console.log('entering auth middleware');
    if(isPreflight(req) || isPublicEndpoint(req)) { next(); return; }

    var token = req.headers.authorization;
    if(token){
        jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
            if(payload){
                User.findOne({_id: payload.id})
                    .then(user => {
                        console.log(user);
                        req.user = user;
                        next();
                    })
                    .catch(err => {
                        console.log(3);
                        res.status(401).json({message: 'Authentication required.'});
                    })
            }else{
                console.log(2);
                res.status(401).json({message: 'Authentication required.'});
            }
        });
    }
    else {
        console.log(1);
        res.status(401).json({message: 'Authentication required.'});
    }
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
