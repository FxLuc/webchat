const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { User } = require('../models')

const register = (req, res) => {
    var newUser = new User(req.body)
    newUser.password = bcrypt.hashSync(req.body.password, 10)
    newUser.save((err, user) => {
        if (err) {
            return res.status(400).send({
                message: err
            })
        } else {
            user.password = undefined
            return res.json(user)
        }
    })
}

const signIn = (req, res, next) => {
    User.findOne({
        email: req.body.email
    }, (err, user) => {
        if (err) throw err
        if (!user) {
            res.render('account/signin', { error: 'Username or password are incorrect' });
        } else if (user) {
            if (!user.comparePassword(req.body.password)) {
                res.render('account/signin', { error: 'Username or password are incorrect' });
            } else {
                res.render('chat/home', {
                    token: jwt.sign({
                        email: user.email,
                        _id: user._id
                    })  
                })
            }
        }
    })
}

const signInRequired = (req, res, next) => {
    if (req.user) {
        next()
    } else {
        return res.status(401).json({ message: 'Unauthorized user!' })
    }
}

module.exports = {
    signIn,
    register,
    signInRequired
}

