const redis = require('redis')
const client = redis.createClient()

// client.publish('changeBicycle:22222', JSON.stringify({a: 1}))
let userId = '58f475632e2dee7b56f1c9aa'
client.publish('notification:' + userId, JSON.stringify({message: 'todo'}))
