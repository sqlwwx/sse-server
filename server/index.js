const Koa = require('koa');
const fs = require('fs');
const path = require('path');
const cors = require('koa2-cors');

const PassThrough = require('stream').PassThrough;

let app = new Koa();

app.use(cors());

// x-response-time
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`[${start.getTime()}] ${ctx.method} ${ctx.url} - ${ms}ms`);
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
  ctx.req.setTimeout(Number.MAX_VALUE);

  ctx.type = 'text/event-stream; charset=utf-8';
  ctx.set('Cache-Control', 'no-cache');
  ctx.set('Connection', 'keep-alive');
  ctx.set('X-Accel-Buffering', 'no');

  ctx.body = new PassThrough();

  let handlePath = `./handles/${ctx.streamHandleName}.js`
  let streamHandle = streamHandles[handlePath]
  if (!streamHandle){
    if (fs.existsSync(path.join(__dirname, handlePath))) {
      handle = require(handlePath)
      streamHandle = streamHandles[handlePath] = handle
    } else {
      ctx.throw(404)
      return
    }
  }
  streamHandle(ctx)
});

app.on('error', (err, ctx) =>
  console.error('server error', err, ctx)
);

app.listen(process.env.PORT || 3009, process.env.IP || '0.0.0.0');
