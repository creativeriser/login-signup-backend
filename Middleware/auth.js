const jwt = require('jsonwebtoken')
// We removed the hardcoded secretKey = 'acharya' so we can use your .env file securely

const auth = (req, res, next) => {

    const data = req.headers["authorization"]
    console.log(data, "token")

    // We wrap the split in an if(data) check so the server doesn't crash if there is no token!
    if (data) {
        const token = data.split(' ')[1]
        console.log(token)

        if (token) {
            // Notice we use process.env.JWT_SECRET here instead of secretKey
            jwt.verify(token, process.env.JWT_SECRET, (err, validate) => {
                if (err) {
                    return res.status(403).send("Error while accessing: " + err.message)
                }
                if (validate) {
                    return next()
                }
                return res.status(401).send("user is not authorized")
            })
        }
        else {
            return res.status(401).send({ msg: "Email id is not registered" })
        }
    }
    else {
        return res.status(401).send({ msg: "Token is missing" })
    }
}

module.exports = auth
