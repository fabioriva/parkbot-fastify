const logger = require('pino')({ name: 'comm' })
// const snap7 = require('node-snap7')
const util = require('util')

// const s7client = new snap7.S7Client()

exports.s7Error = (client, error) => {
  logger.error('s7 comm error %s', client.ErrorText(error))
  return !client.Disconnect()
}

exports.connect = client => client.Connect()

exports.disconnect = client => client.Disconnect()

exports.connectTo = util.promisify((client, PLC, callback) => {
  client.ConnectTo(PLC.ip, PLC.rack, PLC.slot, function (err) {
    if (err) return callback(err)
    logger.warn(`PLC ${PLC.ip} is online`)
    callback(err, true)
  })
})

exports.readArea = util.promisify(
  (client, area, dbNumber, start, amount, wordLen, callback) => {
    client.ReadArea(area, dbNumber, start, amount, wordLen, function (
      err,
      s7data
    ) {
      if (err) return callback(err)
      callback(err, s7data)
    })
  }
)

exports.writeArea = util.promisify(
  (client, area, dbNumber, start, amount, wordLen, buffer, callback) => {
    client.WriteArea(area, dbNumber, start, amount, wordLen, buffer, function (
      err
    ) {
      if (err) return callback(err)
      callback(err, true)
    })
  }
)
