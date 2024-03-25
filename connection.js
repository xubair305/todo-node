
const mongoose = require('mongoose')


async function connectDb(url){

    // Connection to mongoDB
    mongoose.connect(url)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Failed to connect to MongoDB', err))

}

module.exports = {connectDb}