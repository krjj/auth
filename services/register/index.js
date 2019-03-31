'use strict'


module.exports = async function (fastify, opts, next) {
    fastify.route({
        url: '/register',
        method: 'POST',
        schema: {
            body: {
                type: 'object',
                properties: {
                    'username': {
                        type: 'string',
                        allOf: [
                            { "minLength": 1 },
                            { "maxLength": 15 }
                        ]
                    },
                    'email': {
                        type: 'string',
                        format: 'email'
                    },
                    'password': {
                        type: 'string',
                        allOf: [
                            { "minLength": 1 },
                            { "maxLength": 20 }
                        ]
                    }
                },
                required: ['username', 'password', 'email']
            }
        },
        handler: async function (request, reply) {

            try {
                let doc = await fastify.mongo.models.user.findOne({ $or: [{ email: request.body.email }, { username: request.body.username }] })
                if (doc) { // check uf the account exists
                    reply.status(400).send({
                        statusCode: 400,
                        message: "Account already exist",
                        errorCode: 'DUPLICATE_ACCOUNT'
                    })
                } else { //create new account
                    // hash the password
                    let passwordHash = await fastify.generatePasswordHash(request.body.password)
                    // persist user account to db
                    await fastify.mongo.models.user.create({
                        username: request.body.username,
                        email: request.body.email,
                        password: passwordHash
                    })
                    // send success response
                    reply.status(200).send({
                        statusCode: 200,
                        message: "New user account created",
                        errorCode: 'NULL',
                        data: {
                            username: request.body.username,
                            email: request.body.email
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


