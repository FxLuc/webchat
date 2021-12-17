const { User, UserProfile, ChatRoom } = require('../models');

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
    if (typeof (user_to) != 'undefined' && user_to != user_sender) return checkValidRoom(res, user_to, user_sender)
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
    joinChatRoom
}