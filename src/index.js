const express = require('express')
require('./db/mongoose') // just to make sure mongoose runs and connects to mongodb
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const { ObjectID } = require('mongodb')

// Without express middleware : new req -> route handler
// With express middleware : new req -> do something -> route handler

const app = express()
const port = process.env.PORT // for heroku

// app.use((req, res, next) => {
//     res.status(503).send('Under maintenance')
// })

app.use(express.json()) // automatically parses incoming json to js object
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log('Server is up and running on port ' + port)
})