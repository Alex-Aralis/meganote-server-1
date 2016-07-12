module.exports = (req, res, next) => {
    console.log('entering auth middleware');
    if(isPreflight(req) || isPublicEndpoint(req)) { next(); return; }

    var token = req.headers.authorization;
    console.log(token);
    
    if(token){
        next();
    }
    else {
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
