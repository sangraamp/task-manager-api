const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true // remove redundant spaces
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number!')
            }
        }
    },
    email: {
        type: String,
        required: true,
        unique: true, // need to recreate db if this was added after creation
        trim: true,
        validate(email) {
            if (!validator.isEmail(email)) {
                throw new Error('Email is invalid!')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(password) {
            if (password.toLowerCase().includes('password')) {
                throw new Error('Weak password') 
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

userSchema.virtual('tasks', {  // NOT stored in the db, only for mongoose to figure out how two things are related
    ref: 'Task',
    localField: '_id', // the _id field in User 
    foreignField: 'owner' // is the owner field in Task
}) // await user.populate('tasks').execPopulate()
   // now user.tasks will be an array of all the tasks created by a user

userSchema.methods.toJSON = function () { // res.send calls JSON.stringify behind the scenes, and it in turn uses the toJSON function to stringify the JSON. So we are modifying that toJSON function.
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

userSchema.methods.generateAuthToken = async function () { // instance methods
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

userSchema.statics.findByCredentials = async (email, password) => { // model methods
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('Unable to login!')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login!')
    }
    return user
}

// Hash the plain text password before saving
userSchema.pre('save', async function (next) { // normal function because we need this binding
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next() // this notifies node that we are done running our code, so continue
}) 

// Delete user tasks when user is removed
userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({ owner: user._id })
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User