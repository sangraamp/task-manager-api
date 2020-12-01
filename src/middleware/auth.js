const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET) // object with _id property
        const user = await User.findOne({ _id: decoded._id , 'tokens.token': token })

        if (!user) {
            throw new Error()
        }

        req.token = token
        req.user = user // so that there's no need to find user again
        next()
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate'})
    }
}

module.exports = auth