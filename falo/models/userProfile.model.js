const mongoose = require('mongoose')

const userProfileSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    gender: {
      type: String,
      enum: ['None', 'Male', 'Female'],
      default: 'None'
    },
    dob: {
      type: String,
      default: '2003-12-31'
    },
    avatar: {
      type: String,
      default: 'images/main/logo_F_info.png'
    },
    contact: {
      address: {
        type: String,
        default: 'Đà Nẵng'
      },
      tel: {
        type: String,
      },
      email: {
        type: String,
      },
      link: {
        type: String,
      }
    },
    bio: {
      type: String,
    },
    chatRoomList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChatRoom'
    }],
    idUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
  }
)

const UserProfile = mongoose.model('UserProfile', userProfileSchema)

module.exports = UserProfile