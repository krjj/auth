'use strict'

const fp = require('fastify-plugin')

// the use of fastify-plugin is required to be able
// to export the decorators to the outer scope

module.exports = fp(async function (fastify, opts, next) {

    /* 
        import and register redis client library and attempt to establish the connection with redis db.
        redis instance will be available globally as fastify.redis exposed using decorator.
    */
    fastify.register(require('fastify-redis'),
        {
            host: process.env['redis-host'],
            port: process.env['redis-port'],
            password: process.env['redis-password']
        }
    ).after((err) => {
        if (err) {
            fastify.log.error('Unable to register redis pluglin')
        } else {
            let { redis } = fastify

            // register error event handler
            redis.on('error', (err) => {
                fastify.log.error('Unable to establish connection with redis server', err.message)
            })

            // register reconnecting event handler
            redis.on('reconnecting', () => {
                fastify.log.info('Attempting to reconnect with redis')
            })

            // register connect event handler
            redis.on('connect', () => {
                fastify.log.info('Connection with redis established.', 'Host :', redis.options.host, 'Port :', redis.options.port)
            })
            
        }
    })

    next()
})
