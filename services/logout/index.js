'use strict'

const find = require('lodash/find')

module.exports = async function (fastify, opts, next) {
    fastify.route({
        url: '/session',
        method: 'DELETE',
        schema: {
            body: {
                type: 'object',
                'properties': {
                    'ref': {
                        type: 'string'
                    },
                    'invalidateAll': {
                        type: 'boolean'
                    },
                    'self': {
                        type: 'boolean'
                    },
                },
                required: []
            }
        },
        preHandler: [fastify.verifySessionId],
        handler: async function (request, reply) {

            request.body['sessionId'] = request['session'].sessionId


            try {

                // logout from specific session
                if (request.body.ref != undefined) {
                    //console.log('Target Invalidation')
                    let sl = await fastify.sessionList(request['session'].userid)
                    let fres = find(sl, function (o) {
                        return o.sessiondata.ref == request.body.ref
                    })
                    if (!fres) {
                        throw ''
                    } else {
                        await fastify.removeSessionId(fres.sessionid)
                    }
                }


                // logout from all devices
                if (request.body.invalidateAll == true) {
                    let sl = await fastify.sessionList(request['session'].userid)
                    for (let i = 0; i < sl.length; i++) {
                        await fastify.removeSessionId(sl[i].sessionid)
                        //console.log('sessionId invalidate', sl[i].sessionid)
                    }
                }

                // logout from current session
                if (request.body.self == true) {
                    await fastify.removeSessionId(request.body.sessionId)
                }

                reply.status(200).send({
                    statusCode: 200,
                    message: "Session invalidated",
                    errorCode: 'NULL'
                })

            } catch (e) {
                reply.status(403).send({
                    statusCode: 403,
                    message: "Unable to logout",
                    errorCode: 'LOGOUT_FAILED'
                })
            }

        }
    })

    next()
}
