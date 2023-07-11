import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
 const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, 
  },
  email: {
    type: String,
    lowercase: true,
    required: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: props => `${props.value} is not a valid email address!`
    }
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return v.length >= 8;
      },
      message: 'Password must be at least 8 characters long'
    }
  },
  birthdays: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Birthday",
  }],
  notificationDays: {
    type: Number,
    default: 1,
  },
  receiveEmailNotification: {
    type: Boolean,
    default: true,
  }
}, {timestamps: true});
 userSchema.pre('save', async function (next) {
  //this represents the user
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
 export default mongoose.models?.User || mongoose.model('User', userSchema);