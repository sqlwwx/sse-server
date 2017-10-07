export const watchChange = (ctx, dispatcher, latestValue) => {
  let stream = ctx.body
  stream.write(`data: ${JSON.stringify(latestValue)}\n\n`)
  let fn = (message) => stream.write(`data: ${JSON.stringify(message)}\n\n`)
  let finish = () => dispatcher.removeListener('change', fn)
  dispatcher.on('change', fn)
  ctx.req.on('close', finish)
  ctx.req.on('finish', finish)
  ctx.req.on('error', finish)
}
