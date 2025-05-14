const mongoose = require('mongoose');

const calenderSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    schedule: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Schedule'
    }],
    revisions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Revision'
    }]
})

const Calender = mongoose.model('Calender', calenderSchema)

module.exports = Calender