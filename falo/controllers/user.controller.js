const passport = require('passport');
const bcrypt = require('bcrypt')
const { User } = require('../models')

const signUp = (req, res, next) => {
    const { email, password, comfirmPassword } = req.body
    const errors = []

    if (!email || !password && password.length < 8) res.render('account/signup', { errors, email, password, comfirmPassword })
    else {
        User.findOne({ email: email })
            .then(user => {
                if (user) {
                    errors.push('Email này đã được đăng ký trước đó, vui lòng đăng nhập')
                    res.render('account/signin', { errors, email, password, comfirmPassword })
                }
                else {
                    const newUser = User({ email, password })
                    bcrypt.genSalt(10, (error, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err
                            newUser.password = hash
                            newUser
                                .save()
                                .then(_ => res.redirect('signin', { errors: "Đăng ký tài khoản thành công, vui lòng đăng nhập"}))
                        })
                    })
                }
            })
    }
}

const signIn = (req, res, next) => {
    passport.authenticate('local', (error, user) => {
        if (error) return next(error)
        if (!user) return res.redirect('/signin')
        req.login(user, err => { err ? next(err) : res.redirect('/home') })
    })(req, res, next)
}

const signInRequired = (req, res, next) =>
    req.user ? next() : res.status(401).json({ message: 'Unauthorized user!' })

module.exports = {
    signIn,
    signUp,
    signInRequired
}