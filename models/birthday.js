import mongoose from "mongoose";

const birthdaySchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    gifts: [{
        type: String
    }],
    email: {
        type: String,
        required: true,
        ref : 'User',
    },
})

export default mongoose.models?.Birthday || mongoose.model('Birthday', birthdaySchema);