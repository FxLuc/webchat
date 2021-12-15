const passport = require('passport');
const bcrypt = require('bcrypt')
const { User, UserProfile } = require('../models')

const signUp = (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password && password.length < 8) res.render('account/signup', { errors: "Đăng ký tài khoản thất bại"})
    else {
        User
        .findOne({ email: email })
        .then(user => {
            if (user) {
                res.render('account/signin', { errors: 'Email này đã được đăng ký trước đó, vui lòng đăng nhập', email})
            }
            else {
                const newUser = User({ email, password })
                bcrypt.genSalt(10, (error, salt) => {
                    if (error) throw error
                    bcrypt.hash(newUser.password, salt, (_error, hash) => {
                        if (_error) throw _error
                        newUser.password = hash
                        newUser.save( err => {
                            if (err) throw err
                            var userProfile = new UserProfile()
                            userProfile.idUser = newUser.id
                            userProfile.save(_err => {
                                if (_err) throw _err
                                res.render('account/signin', {
                                    errors: "Đăng ký tài khoản thành công, bây giờ bạn có thể đăng nhập",
                                    email: email
                                })
                            })
                        })
                    })
                })
            }
        })
    }
}

const signIn = (req, res, next) => {
    passport.authenticate('local', (error, user) => {
        if (error) return next(error)
        if (!user) return res.render('account/signin', { errors: "Tài khoản hoặc mật khẩu không đúng"})
        req.login(user, err => { err ? next(err) : res.redirect('/home') })
    })(req, res, next)
}

const signInRequired = (req, res, next) =>  req.user ? next() : res.status(401).json({ errors: 'Unauthorized user!' })

const profile = (req, res, next) => {
    User
    .findById(req.user.id)
    .then( user => {
        UserProfile
        .findOne({ idUser: req.user.id })
        .then( user_profile => {
            res.render('account/profile', { user: req.user, user_profile: user_profile })
        })
    })
}

const updateProfile = (req, res, next) => {
    console.log(req.body.user_profile_gender);
    User
    .findById(req.user.id)
    .then( user => {
        UserProfile
        .findOne({ idUser: user.id })
        .then( user_profile => {
            user_profile.name = req.body.user_profile_name
            user_profile.bio = req.body.user_profile_bio
            user_profile.dob = req.body.user_profile_dob
            user_profile.gender = req.body.user_profile_gender
            user_profile.contact = {
                address: req.body.user_profile_address,
                email: req.body.user_profile_email,
                link: req.body.user_profile_link,
                tel: req.body.user_profile_tel,
            }
            user_profile.save()
            res.render('account/profile', { user: req.user, user_profile: user_profile })
        })
    })
}

const home = (req, res, next) => {
    UserProfile
        .findOne({ idUser: req.user.id })
        .then(user_profile => {
            res.render('chat/home', { user: req.user, user_profile: user_profile})
        })
}

module.exports = {
    signIn,
    signUp,
    signInRequired,
    profile,
    updateProfile,
    home
}