import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    lowercase: true
    // validate: {
    //   validator: function(v) {
    //     return /\S+@\S+\.\S+/.test(v);
    //   },
    //   message: props => `${props.value} is not a valid email address!`
    // }
  },
  password: {
    type: String,
    // validate: {
    //   validator: function(v) {
    //     return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(v);
    //   },
    //   message: props => 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    // }
  }
});

userSchema.pre('save', async function (next) {
  //this represnts the user
  if (!this.isModified('password')) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

export default mongoose.models.User || mongoose.model('User', userSchema);

