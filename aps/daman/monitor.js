const fastify = require('fastify')({ logger: { name: 'daman' } })
const snap7 = require('node-snap7')
const comm = require('./comm')
const s7def = require('./definitions')
const s7obj = require('./entities')
const websocket = require('../../lib/websocket')

/**
 * Enable CORS
 */
fastify.register(require('fastify-cors'), {
  origin: '*'
})
fastify.get('/aps/daman/monitor', async (request, reply) => {
  return { monitor: s7obj.monitor }
})

async function update (buffer, monitor) {
  try {
    monitor.el01 = buffer.readInt16BE(0)
    monitor.tt01 = buffer.readInt16BE(2)
    monitor.el02 = buffer.readInt16BE(4)
    monitor.tt02 = buffer.readInt16BE(6)
    monitor.el03 = buffer.readInt16BE(8)
    monitor.tt03 = buffer.readInt16BE(10)
    monitor.el04 = buffer.readInt16BE(12)
    monitor.tt04 = buffer.readInt16BE(14)
    monitor.el05 = buffer.readInt16BE(16)
    monitor.tt05 = buffer.readInt16BE(18)
    monitor.qq01 = buffer.readInt16BE(20)
    monitor.qq02 = buffer.readInt16BE(22)
    monitor.qq03 = buffer.readInt16BE(24)
    monitor.qq04 = buffer.readInt16BE(26)
    monitor.qq05 = buffer.readInt16BE(28)
    monitor.qq06 = buffer.readInt16BE(30)
    monitor.qq07 = buffer.readInt16BE(32)
    monitor.qq08 = buffer.readInt16BE(34)
    monitor.qq09 = buffer.readInt16BE(36)
    monitor.qq10 = buffer.readInt16BE(38)
  } catch (error) {
    fastify.log.error(error)
  }
}

async function plc (client, plc, monitor) {
  try {
    plc.isOnline = await comm.connectTo(client, plc)
    setTimeout(async function forever () {
      if (plc.isOnline) {
        const buffer = await comm.readArea(
          client,
          0x84,
          s7def.DB_MONITOR,
          s7def.DB_MONITOR_INIT,
          s7def.DB_MONITOR_LEN,
          0x02
        )
        update(buffer, monitor)
      } else {
        plc.isOnline = comm.connect(plc)
      }
      setTimeout(forever, plc.polling_time)
    }, plc.polling_time)
  } catch (err) {
    plc.isOnline = comm.s7Error(client, err)
  }
}

const main = async () => {
  try {
    await fastify.listen(s7def.HTTP)
    /**
     * PLC comm (North Side)
     */
    const north = new snap7.S7Client()
    await plc(north, s7def.PLC_N, s7obj.north)
    /**
     * PLC comm (South Side)
     */
    const south = new snap7.S7Client()
    await plc(south, s7def.PLC_S, s7obj.south)
    /**
     * Forever
     */
    const wss = websocket('/ws/daman', fastify)
    setTimeout(function forever () {
      // s7obj.monitor.north = s7obj.north
      // s7obj.monitor.south = s7obj.south
      wss.broadcast('ch1', { monitor: s7obj.monitor })
      setTimeout(forever, 1000)
    }, 1000)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

main()
