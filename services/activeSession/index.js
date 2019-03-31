'use strict'

const geoip = require('geoip-lite')

module.exports = async function (fastify, opts, next) {
    fastify.route({
        url: '/activeSession',
        method: 'GET',
        schema: {
            query: {
                type: 'object',
                properties: {


                },
                required: []
            }
        },
        preHandler : [fastify.verifySessionId],
        handler: async function (request, reply) {
            try {
                let sl = await fastify.sessionList(request['session'].userid)
                let userActivity = []
                if (sl instanceof Array) {
                    for (let i = 0; i < sl.length; i++) {
                        userActivity.push({
                            loginTime: sl[i].sessiondata.loginTime,
                            location: geoip.lookup(sl[i].sessiondata.ipAddress),
                            ip: sl[i].sessiondata.ipAddress,
                            device: sl[i].sessiondata.device,
                            ref : sl[i].sessiondata.ref
                        })
                    }
                    reply.send({
                        statusCode: 200,
                        error: false,
                        message: 'Active sessions',
                        data: {
                            useractivity: userActivity
                        }
                    })
                }
            } catch (e) {
                reply.status(500).send('Internal Server Error - Cannot process the request')
            }

        }
    })


    next()
}


