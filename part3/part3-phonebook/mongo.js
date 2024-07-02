const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

// Connecting to the MongoDB database
const password = process.argv[2]

const url = `mongodb+srv://shantellemegan:${password}@fullstackopen.klugkkk.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=FullStackOpen`

mongoose.set('strictQuery',false)

mongoose.connect(url)

// Denfing entry
const entrySchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Entry = mongoose.model('Entry', entrySchema)

// If giving the correct arguments, adding a new entry
if (process.argv.length > 3) {
  const name = process.argv[3]
  const number = process.argv[4]

  const entry = new Entry({
    name: name,
    number: number,
  })

  entry.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
} else{
  // Printing all entries
  Entry.find({}).then(result => {
    result.forEach(entry => {
      console.log(entry.name, entry.number)
    })
    mongoose.connection.close()
  })
}
