'use strict'

const fp = require('fastify-plugin')
const uuid4 = require('uuid/v4')
const moment = require('moment')

module.exports = fp(function (fastify, opts, next) {

    fastify.decorate('verifySessionId', function (request, reply, done) {
        let sessionId = request.headers['x-session-id']

        if (sessionId == undefined || sessionId == null) {
            reply.status(400).send({
                "statusCode": 400,
                "errorCode": "NO_SESSIONID",
                "message": "Request does not contain x-session-id header"
            })
        } else {
            fastify.getSessionId(sessionId).then((r) => {
                request['session'] = r
                r['sessionId'] = sessionId
                return done()
            }).catch((e) => {
                reply.status(400).send({
                    "statusCode": 400,
                    "errorCode": "INVALID_SESSIONID",
                    "message": "Invalid x-session-id"
                })
            })
        }
    })

    // get session key from redis
    fastify.decorate('getSessionId', session_id => {
        return new Promise((resolve, reject) => {
            fastify.redis.get(session_id, function (err, result) {
                if (result == null || err != null) {
                    reject('Session ID not found')
                } else {
                    resolve(JSON.parse(result))
                }
            })
        })
    })

    // add session key/val in redis
    fastify.decorate('setSessionId', (value) => {
        return new Promise((resolve, reject) => {
            let session_id = uuid4()
            console.log(value.ref)
            value['loginTime'] = moment.utc().format()
            fastify.redis.set(session_id, JSON.stringify(value), function (err, result) {
                if (result == null) {
                    reject('Session ID not stored')
                }
                fastify.redis.expire(session_id, process.env['session-ttl-secs'])
                fastify.redis.smembers(value.userid, function (err, useridkey) {
                    fastify.redis.sadd(value.userid, session_id, function (err, saddres) {
                        if (err) {
                            reject()
                        }
                        resolve(session_id)
                    })
                })
            })
        })
    })

    // remove session key from redis
    fastify.decorate('removeSessionId', (session_id) => {
        return new Promise((resolve, reject) => {
            fastify.redis.get(session_id, function (err, result) {
                if (result == null) {
                    reject('Session ID not found')
                } else {
                    let getResult = JSON.parse(result)
                    fastify.redis.del(session_id, function (err, result) {
                        if (result == null && getResult != null) {
                            reject('Session ID not removed')
                        }
                        fastify.redis.smembers(getResult.userid, function (err, useridkey) {
                            fastify.redis.srem(getResult.userid, session_id, function (err, srem) {
                                resolve(result)
                            })
                        })
                    })
                }
            })
        })
    })


    // get user activity data
    fastify.decorate('sessionList', function (user_id) {
        return new Promise((resolve, reject) => {
            var sessionActivity = []
            fastify.redis.smembers(user_id, function (err, result) {
                if (result instanceof Array === true && result.length > 0) {
                    for (let i = 0; i < result.length; i++) {
                        fastify.redis.get(result[i], function (err, data) {
                            //console.log(result[i], data)
                            if (data == null) {
                                fastify.redis.srem(user_id, result[i])
                            } else {
                                sessionActivity.push({
                                    sessionid: result[i],
                                    sessiondata: JSON.parse(data)
                                })
                            }
                            if (i == (result.length - 1)) {
                                resolve(sessionActivity)
                            }

                        })
                    }
                } else {
                    resolve([])
                }
            })
        })
    })


    next()
})