require('dotenv').config()
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)

  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

// Custom validator function
const phoneNumberValidator = (phoneNum) => {
  
  // Phone number should have length of 8 or more
  if (phoneNum.length < 8) {
    return false
  }

  // Regular expression to match the required phone number format
  const regex = /^\d{2,3}-\d+$/;
  return regex.test(phoneNum);
}

const entrySchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    required: true,
    validate: [phoneNumberValidator, 'Invalid phone number format']
  }
})

entrySchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Entry', entrySchema)