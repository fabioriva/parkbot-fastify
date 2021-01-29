const util = require('util')

exports.updateAlarmGroup = util.promisify(
  (start, buffer, offset, alarms, callback) => {
    let byte = start
    for (let i = 0; i < alarms.length; i++) {
      alarms[i].update(buffer.slice(byte, byte + offset))
      byte += offset
    }
    callback(null, alarms)
  }
)

exports.updateCards = util.promisify(
  (start, buffer, offset, cards, callback) => {
    let byte = start
    const min = 0
    const max = buffer.length / offset
    for (let i = min; i < max; i++) {
      cards[i].update(buffer.slice(byte, byte + offset))
      byte += offset
    }
    callback(null, cards)
  }
)

const updateBits = util.promisify((start, buffer, bytes, callback) => {
  for (let b = 0; b < bytes.length; b++) {
    let mask = 1
    for (let i = 0; i < bytes[b].length; i++) {
      bytes[b][i].status = buffer[start] & mask ? 1 : 0
      mask *= 2
    }
    start += 1
  }
  callback(null, bytes)
})

const updateDevices = util.promisify(
  (start, buffer, offset, devices, modes, callback) => {
    let byte = start
    for (let i = 0; i < devices.length; i++) {
      devices[i].update(buffer.slice(byte, byte + offset), modes)
      byte += offset
    }
    callback(null, devices)
  }
)

const updateMeasures = util.promisify(
  (start, buffer, offset, measures, callback) => {
    let byte = start
    for (let i = 0; i < measures.length; i++) {
      measures[i].update(buffer.slice(byte, byte + offset))
      byte += offset
    }
    callback(null, measures)
  }
)

const updateQueue = util.promisify((start, buffer, offset, queue, callback) => {
  let byte = start
  for (let i = 0; i < queue.length; i++) {
    queue[i].update(buffer.slice(byte, byte + offset))
    byte += offset
  }
  callback(null, queue)
})

exports.updateData = async function (buffer, s7def, s7obj) {
  // Handling multiple asynchronous results in parallel
  await Promise.all([
    updateBits(s7def.DB_DATA_INIT_MB, buffer, s7obj.MB),
    updateBits(s7def.DB_DATA_INIT_EB, buffer, s7obj.EB),
    updateBits(s7def.DB_DATA_INIT_AB, buffer, s7obj.AB),
    updateDevices(
      s7def.DB_DATA_INIT_DEVICE,
      buffer,
      16,
      s7obj.devices,
      s7obj.modes
    ),
    updateMeasures(s7def.DB_DATA_INIT_POS, buffer, 4, s7obj.positions),
    updateQueue(s7def.DB_DATA_INIT_QUEUE, buffer, 4, s7obj.exitQueue)

    // s7obj.garages &&
    //   updateDevices(s7def.DB_DATA_INIT_GARAGE, buffer, 10, s7obj.garages)
  ])
}

const updateStalls = util.promisify(
  (start, buffer, offset, stalls, callback) => {
    let byte = start
    const min = 0
    const max = buffer.length / offset
    for (let i = min; i < max; i++) {
      stalls[i].update(buffer.slice(byte, byte + offset))
      byte += offset
    }
    callback(null, stalls)
  }
)

const updateStatistics = (stalls, statistics, stallStatus) => {
  statistics.forEach((item, key) => {
    mapCount(stalls, item, key, stallStatus)
  })
  // return statistics
}

function mapCount (stalls, data, size, stallStatus) {
  data[0].value = data[1].value = data[2].value = 0
  for (let i = 0; i < stalls.length; i++) {
    if (size === 0 || stalls[i].size === size) {
      switch (stalls[i].status) {
        case 0:
          ++data[0].value
          break
        case stallStatus.LOCK:
          ++data[2].value
          break
        default:
          ++data[1].value
          break
      }
    }
  }
}

exports.updateMap = async function (buffer, s7def, s7obj) {
  const stalls = await updateStalls(0, buffer, s7def.STALL_LEN, s7obj.stalls)
  updateStatistics(stalls, s7obj.map.statistics, s7def.StallStatus)
  return s7obj.map
}
