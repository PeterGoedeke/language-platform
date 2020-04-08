require('dotenv').config()

const createError = require('http-errors')
const express = require('express')
const path = require('path')

require('./models/db.js')

const authRouter = require('./routes/auth')
const userRouter = require('./routes/user')
const listRouter = require('./routes/list')
const importerRouter = require('./routes/importer')


const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/', authRouter)
app.use('/user', userRouter)
app.use('/list', listRouter)
app.use('/importer', importerRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500);
  res.json(err)
  console.log(err)
});

module.exports = app