const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.connect(url, {family: 4})
    .then(result => {
        console.log('connected!')
    })
    .catch(error => {
        console.log('connection failed', error)
    })

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
    },
    number: String,
})


contactSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject.__v
        delete returnedObject._id
    }
})

module.exports = mongoose.model('Contact', contactSchema)