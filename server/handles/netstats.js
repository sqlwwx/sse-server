import events from 'events'
import fs from 'fs'
import { watchChange } from '../utils'

const dispatcher = new events.EventEmitter()
const statsFile = '/proc/net/dev'

const parseStatsLine = (line) => {
  if (!line) {
    return
  }
  let stats = {}
  let [deviceName, valuesStr] = line.split(':')
  stats.deviceName = deviceName.trim()
  let parts = valuesStr.split(/\s+/)
  stats.rx = {
    bytes: parts[1],
    packets: parts[2],
    errors: parts[3],
    drop: parts[4],
    fifo: parts[5],
    frame: parts[6],
    compressed: parts[7],
    multicast: parts[8]
  }
  stats.tx = {
    bytes: parts[9],
    packets: parts[10],
    errors: parts[11],
    drop: parts[12],
    fifo: parts[13],
    cols: parts[14],
    carrier: parts[15],
    compressed: parts[16]
  }
  return stats
}

const getValue = () => {
  const lines = fs.readFileSync(statsFile).toString().split(/\r?\n/).filter(line => line.indexOf(':') >= 0)
  return lines.map(parseStatsLine)
}

setInterval(() => {
  let value = getValue()
  if (latestValue === value) {
    return
  }
  console.log(latestValue, value)
  dispatcher.emit('change', value)
  latestValue = value
}, 5000)

module.exports = (ctx) => {
  watchChange(ctx, dispatcher, latestValue)
}

let latestValue = getValue()

if (require.main === module) {
  console.log(latestValue)
}
