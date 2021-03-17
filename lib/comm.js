const pino = require('pino')
const util = require('util')

const logger = pino({ name: 'comm' })

exports.s7Error = (client, error) => {
  logger.error('S7 comm error %s', client.ErrorText(error))
  return !client.Disconnect()
}

exports.connect = client => client.Connect()

exports.connectTo = util.promisify((client, PLC, callback) => {
  client.ConnectTo(PLC.ip, PLC.rack, PLC.slot, function (err) {
    if (err) return callback(err)
    logger.warn(`PLC ${PLC.ip} is online`)
    callback(err, true)
  })
})

exports.disconnect = client => client.Disconnect()

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
