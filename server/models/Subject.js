const mongoose = require('mongoose')

const subjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    hours: {
        type: Number,
        min: 0,
        required: true
    }
}, {timestamps: true})

const Subject = mongoose.model('Subject', subjectSchema)

module.exports = Subject