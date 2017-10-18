import Koa from 'koa'
import fs from 'fs'
import path from 'path'
import cors from 'koa2-cors'
import KoaStatic from 'koa-static'
import safeProcess from './utils/process'

const port = process.env.PORT || 3009
const PassThrough = require('stream').PassThrough
const app = module.exports = new Koa()

app.use(cors())

app.use(KoaStatic(path.resolve(__dirname, '../client')))

// x-response-time
app.use(async (ctx, next) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  ctx.set('X-Response-Time', `${ms}ms`)
})

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.ip} ${ctx.url} - ${ms}ms`)
})

app.use(async (ctx, next) => {
  let pathItems = ctx.path.split('/')
  if (pathItems.length !== 4 || pathItems[1] !== 'stream') {
    ctx.throw(404)
  } else {
    ctx.streamHandleName = pathItems[2]
    ctx.streamEventName = pathItems[3]
    next()
  }
})

let streamHandles = {}
app.use(ctx => {
  // otherwise node will automatically close this connection in 2 minutes
  ctx.req.setTimeout(Number.MAX_VALUE)

  ctx.type = 'text/event-stream; charset=utf-8'
  ctx.set('Cache-Control', 'no-cache')
  ctx.set('Connection', 'keep-alive')
  ctx.set('X-Accel-Buffering', 'no')

  ctx.body = new PassThrough()

  let handlePath = `./handles/${ctx.streamHandleName}.js`
  let streamHandle = streamHandles[handlePath]
  if (!streamHandle) {
    if (fs.existsSync(path.join(__dirname, handlePath))) {
      const handle = require(handlePath)
      streamHandle = streamHandles[handlePath] = handle
    } else {
      ctx.throw(404)
      return
    }
  }
  streamHandle(ctx)
})

app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
})

const server = app.listen(port, process.env.IP || '0.0.0.0', () => {
  app.emit('listened')
  console.log('Server listening at port %d', port)
})

app.on('listened', () => {
  if (process.send) {
    process.send('ready')
  }
})

safeProcess(server)
