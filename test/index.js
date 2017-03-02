const redis = require('redis');
const client = redis.createClient()

client.publish('changeBicycle:22222', JSON.stringify({a:1}))
