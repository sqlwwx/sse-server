const redis = require('redis')

module.exports = (prefix) => {
  const client = redis.createClient(process.env.REDIS_URL || 'redis://localhost:6379')
  client.psubscribe(prefix + ':*')
  client.on('pmessage', (pattern, channel, message) => {
    client.emit(channel, message)
  })

  return (ctx) => {
    let eventName = prefix + ':' + ctx.streamEventName
    let stream = ctx.body
    let fn = (message) => {
      stream.write(`data: ${message}\n\n`)
    }
    let finish = () => {
      client.removeListener(eventName, fn)
    }
    client.on(eventName, fn)
    ctx.req.on('close', finish)
    ctx.req.on('finish', finish)
    ctx.req.on('error', finish)
  }
}
