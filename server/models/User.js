const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        trim: true,
        required: true,
        minLength: 2
    },
    lastName: {
        type: String,
        trim: true,
        required: true,
        minLength: 2
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    target: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Subject'
        }
    ],
    calender: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Calender'
        }
    ]
}, {timestamps:true});

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });


const User = mongoose.model('User', userSchema);

module.exports = User;
