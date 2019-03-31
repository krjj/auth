const assert = require('assert')

let Schema = null

function init () {
  const userSchema = new Schema({
    username: {type : String , lowercase: true},
    email: {type : String , lowercase: true},
    password : String
  }, {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  })

  return userSchema
}

module.exports = (schema) => {
  assert.ok(schema)
  Schema = schema
  return init()
}
