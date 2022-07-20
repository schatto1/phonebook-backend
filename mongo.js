const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = encodeURIComponent(process.argv[2])

const url = `mongodb+srv://fullstack:${password}@cluster0.pmkf0.mongodb.net/phonebookApp?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

mongoose
  .connect(url)
  .then((result) => {
    console.log('connected')

    const person = new Person({
      name: process.argv[3],
      number: process.argv[4],
      important: true,
    })

    return person.save()
  })
  .then(() => {
    console.log('person added to phonebook!')
    return mongoose.connection.close()
  })
  .catch((err) => console.log(err))