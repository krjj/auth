'use strict'

module.exports = async function (fastify, opts, next) {
  fastify.get('/', async function (request, reply) {
    reply.send({ root: true , 'app-name' : 'Authentication Service', 'version' : require('../package.json').version })
  })

  next()
}

