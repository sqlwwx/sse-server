import events from 'events'
import os from 'os'
import { watchChange } from '../utils'

const dispatcher = new events.EventEmitter()

const getVaule = () => {
  const total = os.totalmem()
  const free = os.freemem()
  const used = total - free
  return {
    total,
    free,
    ratio: parseInt(used / total * 1000) / 10
  }
}

setInterval(() => {
  const value = getVaule()
  if (latestValue.ratio === value.ratio) {
    return
  }
  console.log(latestValue.ratio, value.ratio)
  dispatcher.emit('change', value)
  latestValue = value
}, 1000)

module.exports = (ctx) => {
  watchChange(ctx, dispatcher, latestValue)
}

let latestValue = getVaule()
