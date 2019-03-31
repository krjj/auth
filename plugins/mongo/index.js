/* Data Access Layer - creates mongoose instance and exposes database object globally using decorator */

'use strict'

const fp = require('fastify-plugin')
const mongoose = require('mongoose')

// the use of fastify-plugin is required to be able
// to export the decorators to the outer scope

module.exports = fp(function (fastify, opts, next) {
  const options = {
    useNewUrlParser: true,
    autoIndex: false, // Don't build indexes
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0,
    connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
  }

  // connect
  //mongoose.connect('mongodb://127.0.0.1/cretanium', options)
  mongoose.connect(process.env['mongo-connect-uri'], options)

  // get database
  const db = mongoose.connection

  // define schema
  const userSchema = require('./models/userModel')(mongoose.Schema)

  // compile models
  const userModel = mongoose.model('user', userSchema)


  // stub
  function saveuser() {
    var user = new userModel({
      username: 'kshitijjamdade',
      email: 'krjamdade@gmail.com',
      password: 'Password@123'
    })
    user.save()
  }
  // stub end

  db.once('open', function () {
    fastify.log.info('Mongodb connection OK')
    fastify.decorate('mongo', {
      'db': db,
      'models': {
        user: userModel
      }
    })
    //saveuser()
    
  })
  next()
}, {
    name: 'mongodb-plugin'
  })