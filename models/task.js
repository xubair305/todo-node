const mongoose = require('mongoose')

// Create schema for mongoDb 
const taskScheme = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    isCompleted: {
        type: Boolean,
        required: true
    }
}, { timestamps: true })
let Task = mongoose.model('task', taskScheme);

module.exports = Task