const redis = require('redis')
const client = redis.createClient()

client.publish('changeBicycle:22222', JSON.stringify({a: 1}))
let userId = '5858d396cb19307e69f55fce'
client.publish('message:' + userId, JSON.stringify({message: 'todo'}))
