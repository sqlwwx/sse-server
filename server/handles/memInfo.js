const events = require('events');
const os = require('os');

let dispatcher = new events.EventEmitter();

const calcMem = () => {
  let mem_total = os.totalmem(),
    mem_free = os.freemem(),
    mem_used = mem_total - mem_free,
    mem_ratio = 0;
  mem_total = (mem_total / (1024 * 1024 * 1024)).toFixed(2);
  mem_used = (mem_used / (1024 * 1024 * 1024)).toFixed(2);
  mem_ratio = parseInt(mem_used / mem_total * 10000) / 100;
  return {
    total: mem_total,
    used: mem_used,
    ratio: mem_ratio
  }
}

const getVaule = () => {
  return {
    memInfo: calcMem(),
    time: Date.now()
  }
}

let latestValue = getVaule()

setInterval(() => {
  let value = getVaule()
  if (latestValue.memInfo.ratio === value.memInfo.ratio) {
    return
  }
  console.log(latestValue.memInfo.ratio, value.memInfo.ratio)
  dispatcher.emit('message', value)
  latestValue = value
}, 5000)

module.exports = (ctx) => {
  let stream = ctx.body;
  stream.write(`data: ${JSON.stringify(latestValue)}\n\n`);
  let fn = (message) => stream.write(`data: ${JSON.stringify(message)}\n\n`);
  let finish = () => dispatcher.removeListener('message', fn);
  dispatcher.on('message', fn)
  ctx.req.on('close', finish)
  ctx.req.on('finish', finish)
  ctx.req.on('error', finish)
}
