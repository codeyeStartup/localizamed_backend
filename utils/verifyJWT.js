const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    const token = req.headers['x-access-token']
    if (!token) return res.status(401).json({ msg: 'Authentication failed. No token provided' })

    jwt.verify(token, process.env.JWT_PASS, (err, decoded) => {
        if(err) return res.status(401).json({msg: 'Failed to authenticate token'})

        if(decoded.isRefreshTokenValid)
            req.userId = decoded.isRefreshTokenValid.id
        else 
            req.userId = decoded.id;
        

        next();
    })
}