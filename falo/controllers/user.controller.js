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

const joinChatRoom = async (req, res, next) => {
    let user_to, user_sender
    await UserProfile.find().populate('idUser').then(data => {
        data.forEach(user_profile => {
            if (user_profile.idUser.email == req.body.email) {
                user_to = user_profile
            }
            if (user_profile.idUser.email == req.user.email) {
                user_sender = user_profile
            }
        })
    })
    if (typeof (user_to) != 'undefined') return checkValidRoom(res, user_to, user_sender)
    res.status(200).json({ id: '', name: 'Not found' })
}

async function checkValidRoom(res, user_to, user_sender) {
    let chat_room_found
    const chat_room_valid = (typeof (user_to.chatRoomList) != 'undefined' && typeof (user_sender.chatRoomList) != 'undefined')
    if (chat_room_valid && user_to.chatRoomList.length > 0 && user_sender.chatRoomList.length > 0) {
        await user_sender.chatRoomList.forEach(chat_room_sender => {
            user_to.chatRoomList.forEach(chat_room_to => {
                if (chat_room_sender.toString() == chat_room_to.toString()) {
                    return chat_room_found = chat_room_sender.toString()
                }
            })
        })
    }
    if (chat_room_found) {
        ChatRoom.findById(chat_room_found).then(chat_room => {
            const chat_room_access = chat_room.accessList.find(user_id => user_id.toString() == user_sender.id)
            if (chat_room_access) {
                res.status(200).json({ id: chat_room.id, name: chat_room.name })
            } else {
                console.log(`Chat room found but you not have access: ${chat_room.id}`)
                res.status(200).json({ id: '', name: 'Forbidden' })
            }
        })
    } else {
        createChatRoom(res, user_to, user_sender)
    }
}

function createChatRoom(res, user_to, user_sender) {
    let chatRoom = new ChatRoom()
    chatRoom.accessList = [user_to.id, user_sender.id]
    chatRoom.name = user_to.idUser.email + ' AND ' + user_sender.idUser.email
    chatRoom.save(err => {
        UserProfile
            .updateMany(
                { id: { $in: [user_sender.id, user_to.id] } },
                { $addToSet: { chatRoomList: chatRoom.id } },
                { multi: true },
            )
            .exec(_err => {
                console.log(`Create new chat room id: ${chatRoom.id}`)
                res.status(200).json({ id: chatRoom.id, name: chatRoom.name })
            })
    })
}

module.exports = {
    signIn,
    signUp,
    signInRequired,
    profile,
    updateProfile,
    home,
    joinChatRoom
}