'use strict'

const moment = require('moment')
const crypto = require('crypto')
module.exports = async function (fastify, opts, next) {
    fastify.route({
        url: '/login',
        method: 'POST',
        schema: {
            body: {
                type: 'object',
                properties: {
                    'username': {
                        type: 'string',
                        allOf: [
                            { "minLength": 1 },
                            { "maxLength": 50 }
                        ]
                    },
                    'password': {
                        type: 'string',
                        allOf: [
                            { "minLength": 1 },
                            { "maxLength": 20 }
                        ]
                    },
                    'deviceName': {
                        type: 'string'
                    }
                }
            }
        },
        handler: async function (request, reply) {

            try {
                let doc = await fastify.mongo.models.user.findOne({ $or: [{ email: request.body.username }, { username: request.body.username }] })
                let loggedIn = false
                //console.log(doc,request.body)
                if (doc) { // check if the account exists

                    let compareRes = await fastify.comparePasswordHash(request.body.password, doc.password)
                    if (compareRes == true) { loggedIn = true }
                }

                if (loggedIn == true) {


                    let fakeip = (Math.floor(Math.random() * 255) + 1) + "." + (Math.floor(Math.random() * 255) + 0) + "." + (Math.floor(Math.random() * 255) + 0) + "." + (Math.floor(Math.random() * 255) + 0);
                    let ref = crypto.randomBytes(2).toString('hex')
                    let sessionId = await fastify.setSessionId({ userid: doc.email, device: request.body.deviceName || '', ipAddress: request.ip,  ref : ref})

                    reply.status(200).send({
                        statusCode: 200,
                        message: "New session created",
                        errorCode: 'NULL',
                        data: {
                            username: doc.username,
                            email: doc.email,
                            sessionId: sessionId,
                            ref : ref
                        }
                    })

                } else {

                    reply.status(403).send({
                        statusCode: 403,
                        message: "Incorrect account credentials",
                        errorCode: 'INVALID_CREDENTAILS',
                    })

                }

            } catch (e) {
                console.log(e)
                reply.status(500).send('Internal Server Error - Cannot process the request')
            }


        }
    })


    next()
}


