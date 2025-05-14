const mongoose = require('mongoose')

const revisionSchema = new mongoose.Schema({
    hours: {
        type: Number,
        min: 0,
        required: true
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
    isDone: {
        type: Boolean,
        default: false
    },
})

const Revision = mongoose.model('Revision', revisionSchema)

module.exports = Revision