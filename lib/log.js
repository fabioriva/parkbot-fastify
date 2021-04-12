const net = require('net')
const pino = require('pino')
const { insertLog } = require('./db')
const { bytesToInt, bytesToLong, getPlcDateTime } = require('./utils7')
const notification = require('./notification')
const LOG_LEN = 32

const logger = pino({ name: 'log' })

class S7Log {
  constructor (data) {
    this.stx = bytesToInt(data[0], data[1])
    this.system = bytesToInt(data[2], data[3])
    this.device = bytesToInt(data[4], data[5])
    this.mode = bytesToInt(data[6], data[7])
    this.operation = bytesToInt(data[8], data[9])
    this.stall = bytesToInt(data[10], data[11])
    this.card = bytesToInt(data[12], data[13])
    this.size = bytesToInt(data[14], data[15])
    this.alarm = bytesToInt(data[16], data[17])
    this.event = bytesToInt(data[18], data[19])
    this.date = getPlcDateTime(
      bytesToInt(data[20], data[21]),
      bytesToLong(data[22], data[23], data[24], data[25])
    )
    this.elapsed = bytesToLong(data[26], data[27], data[28], data[29])
    this.etx = bytesToInt(data[30], data[31])
  }
}

function logServer (db, plc, s7def, s7obj) {
  const { PORT, HOST } = s7def
  const server = net.createServer(function (socket) {
    const client = `${socket.remoteAddress}:${socket.remotePort}`
    socket.on('error', function (e) {
      logger.error('%s socket error %s', client, e)
    })
    socket.on('close', function () {
      logger.warn('%s socket close', client)
    })
    socket.on('end', function () {
      logger.warn('%s socket end', client)
    })
    socket.on('data', async function (data) {
      const buffer = Buffer.alloc(LOG_LEN, data)
      if (buffer.length === LOG_LEN) {
        const s7log = new S7Log(buffer)
        logger.info(s7log)
        switch (s7log.operation) {
          case 1: // alarm in
          case 2: // alarm out
            plc.alarms(s7def, s7obj, { device: s7log.device })
            break
          case 4:
            plc.cards(s7def, s7obj)
            break
          case 5: // in
          case 6: // out
          case 7: // shuffle in
          case 8: // shuffle out
          case 9: // reserve stall
            plc.map(s7def, s7obj)
            break
        }
        const result = await insertLog(db, s7log, s7obj)
        logger.info(result.ops[0])
        plc.wss.broadcast('ch2', {
          notification: notification(result.ops.shift())
        })
      }
    })
  })
  server.listen(PORT, HOST, () =>
    logger.info(`Server listening at tcp://${HOST}:${PORT}`)
  )
}

module.exports = logServer
