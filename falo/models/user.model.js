const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, { timestamps: true });

UserSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model('User', UserSchema);

module.exports = User;