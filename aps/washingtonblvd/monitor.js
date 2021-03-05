const fastify = require('fastify')({ logger: { name: 'washingtonblvd' } })
const snap7 = require('node-snap7')
const comm = require('./comm')
const s7def = require('./definitions')
const websocket = require('../../lib/websocket')

const EVT1 = {
  name: 'Portal 1',
  operation: 0,
  step: 0,
  cards: []
}

const EVT2 = {
  name: 'Portal 2',
  operation: 0,
  step: 0,
  cards: []
}

const EVT3 = {
  name: 'Portal 3',
  operation: 0,
  step: 0,
  cards: []
}

const monitor = { EVT1, EVT2, EVT3 }

/**
 * Enable CORS
 */
fastify.register(require('fastify-cors'), {
  origin: '*'
})
fastify.get('/api/washingtonblvd/monitor', (request, reply) => {
  reply.send({ monitor })
})

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
        // evt1
        monitor.EVT1.operation = buffer.readInt16BE(0)
        monitor.EVT1.step = buffer.readInt16BE(2)
        monitor.EVT1.cards = [
          buffer.readInt16BE(4),
          buffer.readInt16BE(6),
          buffer.readInt16BE(8)
        ]
        // evt2
        monitor.EVT2.operation = buffer.readInt16BE(10)
        monitor.EVT2.step = buffer.readInt16BE(12)
        monitor.EVT2.cards = [
          buffer.readInt16BE(14),
          buffer.readInt16BE(16),
          buffer.readInt16BE(18)
        ]
        // evt3
        monitor.EVT3.operation = buffer.readInt16BE(20)
        monitor.EVT3.step = buffer.readInt16BE(22)
        monitor.EVT3.cards = [
          buffer.readInt16BE(24),
          buffer.readInt16BE(26),
          buffer.readInt16BE(28)
        ]
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
     * PLC comm
     */
    const cpu = new snap7.S7Client()
    await plc(cpu, s7def.PLC, monitor)
    /**
     * Forever
     */
    const wss = websocket('/ws/washingtonblvd', fastify)
    setTimeout(function forever () {
      wss.broadcast('ch1', { monitor })
      setTimeout(forever, 1000)
    }, 1000)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

main()
