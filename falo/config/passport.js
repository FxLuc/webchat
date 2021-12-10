const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const { User } = require('../models')

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {

            // Match user
            User.findOne({ email: email })
                .then( user => {
                    if (!user) return done(null, false, { message: 'Email không tồn tại' })
                    // Match password
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) throw err
                        isMatch? done(null, user) : done(null, false, { message: 'Mật khẩu không đúng' })
                    })
                })
        })
    )

    passport.serializeUser((user, done) => done(null, user.id))

    passport.deserializeUser((id, done) => User.findById(id, (err, user) => done(err, user)))
}