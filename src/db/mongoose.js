const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

// const me = new User({
//     name: 'Sangraam',
//     age: '19',
//     email: 'abdcd@dfah.com',
//     password: 'strong!@#$'
// })

// me.save().then(() => { // then receives 'me' itself as the argument, can directly access it
//     console.log(me)
// }).catch((error) => {
//     console.log(error)
// })
 
// const task = new Task({
//     description: 'Wake up',
//     completed: true
// })

// task.save().then(() => {
//     console.log(task)
// }).catch((error) => {
//     console.log(error)
// })