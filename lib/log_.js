const EventEmitter = require('events')
const net = require('net')
const pino = require('pino')
const { bytesToInt, bytesToLong, getPlcDateTime } = require('./utils7')

const LOG_LEN = 32

const logger = pino({ name: 'log' })

class LogEmitter extends EventEmitter {}

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

const logEmitter = new LogEmitter()

exports.logEmitter = logEmitter

function logServer (PORT, HOST) {
  const server = net.createServer(function (socket) {
    socket.on('data', function (data) {
      const buffer = Buffer.alloc(LOG_LEN, data)
      if (buffer.length === LOG_LEN) {
        const log = new S7Log(buffer)
        logger.info(log)
        logEmitter.emit('log', log)
      }
    })
  })
  server.listen(PORT, HOST, () =>
    logger.info(`Server listening at tcp://${HOST}:${PORT}`)
  )
}

exports.logServer = logServer
