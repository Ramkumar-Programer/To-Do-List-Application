const jwt = require('jsonwebtoken');

const checkToken = (req, res, next) => {
    const token = req.headers["token"]
    if(token)
    {
        jwt.verify(token, process.env.TOKEN_KEY, (err, decoded) => {
            if(err)
            {
                //console.log(err);
                if (err.name === 'TokenExpiredError') {
                    res.status(201).send({ message: "Token has expired" });
                } else {
                    // Other verification errors
                    res.status(201).send({ message: "Access Denied" });
                }
                return;
            }
            else
            {
               // console.log(decoded)
                //res.status(200).send(decoded)
                req.body.tokenData = decoded;
                next();
            }
        })
    }
}

module.exports =checkToken;