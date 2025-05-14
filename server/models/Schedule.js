const mongoose = require('mongoose')

const scheduleSchema = new mongoose.Schema({
    startTime: {
        type: String,
        required: true,
        minLength: 5,
        maxLength:5
    },
    endTime: {
        type: String,
        required: true,
        minLength: 5,
        maxLength:5
    },
    hours: {
        type: Number,
        min: 0
    },
    subject: {
        type: String,
        trim: true,
        required: true
    },
    topic: {
        type: String,
        trim: true,
        required: true
    },
}, {timestamps: true})

const Schedule = mongoose.model('Schedule', scheduleSchema)

module.exports = Schedule