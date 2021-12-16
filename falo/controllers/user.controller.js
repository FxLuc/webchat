const passport = require('passport');
const bcrypt = require('bcrypt')
const { User, UserProfile, ChatRoom } = require('../models');

const signUp = (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password && password.length < 8) res.render('account/signup', { errors: "Đăng ký tài khoản thất bại" })
    else {
        User
            .findOne({ email: email })
            .then(user => {
                if (user) {
                    res.render('account/signin', { errors: 'Email này đã được đăng ký trước đó, vui lòng đăng nhập', email })
                }
                else {
                    const newUser = User({ email, password })
                    bcrypt.genSalt(10, (error, salt) => {
                        if (error) throw error
                        bcrypt.hash(newUser.password, salt, (_error, hash) => {
                            if (_error) throw _error
                            newUser.password = hash
                            newUser.save(err => {
                                if (err) throw err
                                let userProfile = new UserProfile()
                                userProfile.idUser = newUser.id
                                userProfile.name = newUser.email
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
        if (!user) return res.render('account/signin', { errors: "Tài khoản hoặc mật khẩu không đúng" })
        req.login(user, err => { err ? next(err) : res.redirect('/home') })
    })(req, res, next)
}

const signInRequired = (req, res, next) => req.user ? next() : res.status(401).json({ errors: 'Unauthorized user!' })

const profile = (req, res, next) => {
    User
        .findById(req.user.id)
        .then(user => {
            UserProfile
                .findOne({ idUser: req.user.id })
                .then(user_profile => {
                    res.render('account/profile', { user: req.user, user_profile: user_profile })
                })
        })
}

const updateProfile = (req, res, next) => {
    console.log(req.body.user_profile_gender);
    User
        .findById(req.user.id)
        .then(user => {
            UserProfile
                .findOne({ idUser: user.id })
                .then(user_profile => {
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
    UserProfile.findOne({ idUser: req.user.id })
        .then(user_profile => {
            res.render('chat/home', { user: req.user, user_profile: user_profile })
        })
}

const createChatRoom = async (req, res, next) => {
    let user_to, user_sender
    await UserProfile
        .find({ email: { $in: [ req.body.email, req.user.email ]}})
        .populate('idUser')
        .then( data => {
            if ( data.length == 2) {
                user_to = data[0]
                user_sender = data[1]
                return
            }
        })
    let chat_room_not_found = true
    if (user_to.chatRoomList.length > 0 && user_sender.chatRoomList.length > 0) {
        user_sender.chatRoomList.forEach(chat_room_sender => {
            user_to.chatRoomList.forEach(chat_room_to => {
                if (chat_room_sender.toString() == chat_room_to.toString()) {
                    chat_room_not_found = false
                    ChatRoom.findById(chat_room_to).then( chat_room => {
                        console.log(`They are chat in here, respon to home page: ${chat_room.id}`)
                        res.status(200).json({ id: chat_room.id, name: chat_room.name})
                    })

                }
            })
        })
    }

    if (chat_room_not_found) {
        let chatRoom = new ChatRoom()
        chatRoom.accessList = [user_to.id, user_sender.id]
        chatRoom.name = user_to.idUser.email + ' AND ' + user_sender.idUser.email
        chatRoom.save(err => {
            if (err) throw err
            UserProfile
                .updateMany(
                    { id: { $in: [user_sender.id, user_to.id] }},
                    { $addToSet: { chatRoomList: chatRoom.id }},
                    { multi: true},
                )
                .exec( err => {
                    if (err) throw err
                    console.log(`They are not here, respon to home page new chat room id: ${chatRoom.id}`)
                    res.status(200).json({ id: chatRoom.id, name: chatRoom.name})
                })
        })
    }
}

module.exports = {
    signIn,
    signUp,
    signInRequired,
    profile,
    updateProfile,
    home,
    createChatRoom
}