const mongoose = require('mongoose')

const userProfileSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
    },
    gender: {
      type: String,
      enum: ['None', 'Male', 'Female'],
      default: 'None'
    },
    dob: {
      type: Date,
      min: '1930-01-01',
      max: '2015-12-31',
      default: '2003-12-31'
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
    idUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    },
  }
)

const UserProfile = mongoose.model('UserProfile', userProfileSchema)

module.exports = UserProfile