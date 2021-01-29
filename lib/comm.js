const logger = require('pino')({ name: 'comm' })
const snap7 = require('node-snap7')
const util = require('util')

const s7client = new snap7.S7Client()

exports.s7Error = error => {
  logger.error('s7 comm error %s', s7client.ErrorText(error))
  return !s7client.Disconnect()
}

exports.connect = () => s7client.Connect()

exports.disconnect = () => s7client.Disconnect()

exports.connectTo = util.promisify((PLC, callback) => {
  s7client.ConnectTo(PLC.ip, PLC.rack, PLC.slot, function (err) {
    if (err) return callback(err)
    logger.warn(`PLC ${PLC.ip} is online`)
    callback(err, true)
  })
})

exports.readArea = util.promisify(
  (area, dbNumber, start, amount, wordLen, callback) => {
    s7client.ReadArea(area, dbNumber, start, amount, wordLen, function (
      err,
      s7data
    ) {
      if (err) return callback(err)
      callback(err, s7data)
    })
  }
)

exports.writeArea = util.promisify(
  (area, dbNumber, start, amount, wordLen, buffer, callback) => {
    s7client.WriteArea(
      area,
      dbNumber,
      start,
      amount,
      wordLen,
      buffer,
      function (err) {
        if (err) return callback(err)
        callback(err, true)
      }
    )
  }
)
