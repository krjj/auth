'use strict'

const fp = require('fastify-plugin')
const bcrypt = require('bcrypt')

// the use of fastify-plugin is required to be able
// to export the decorators to the outer scope

module.exports = fp(function (fastify, opts, next) {

   // define and export generatePasswordHash decorator
   fastify.decorate('generatePasswordHash', function (inputString) {
    return new Promise((resolve, reject) => {
      bcrypt.hash(inputString, 8).then((res) => {
        resolve(res)
      }).catch((e) => {
        reject()
      })
    })
  })

  // define and export comparePasswordHash decorator
  fastify.decorate('comparePasswordHash', function (password, inputString) {
    return new Promise((resolve, reject) => {
      if (inputString == null) {
        inputString = ''
      }
      bcrypt.compare(password, inputString).then((res) => {
        resolve(res)
      }).catch((e) => {
        reject()
      })
    })
  })

 
  next()
})


// If you prefer async/await, use the following
//
// module.exports = fp(async function (fastify, opts) {
//   fastify.decorate('someSupport', function () {
//     return 'hugs'
//   })
// })
