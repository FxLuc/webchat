const mongoose = require('mongoose')

const ChatRoomSchema = mongoose.Schema({
    accessList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserProfile'
    }],
    name: {
        type: String
    },
}, { timestamps: true });

const ChatRoom = mongoose.model('ChatRoom', ChatRoomSchema);

module.exports = ChatRoom;