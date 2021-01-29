const fastify = require('fastify')({ logger: { name: 'daman' } })
const commN = require('../../lib/comm')
const commS = require('../../lib/comm')
const s7def = require('./definitions')
const s7obj = require('./entities')
const websocket = require('../../lib/websocket')

fastify.register(require('fastify-cors'), {
  origin: '*'
})

fastify.get('/api/daman/monitor', async (request, reply) => {
  return { monitor: s7obj.monitor }
})

async function update (n, s, wss) {
  try {
    /**
     * North
     */
    s7obj.monitor.el01 = n.readInt16BE(0)
    s7obj.monitor.tt01 = n.readInt16BE(2)
    s7obj.monitor.el02 = n.readInt16BE(4)
    s7obj.monitor.tt02 = n.readInt16BE(6)
    s7obj.monitor.el03 = n.readInt16BE(8)
    s7obj.monitor.tt03 = n.readInt16BE(10)
    s7obj.monitor.el04 = n.readInt16BE(12)
    s7obj.monitor.tt04 = n.readInt16BE(14)
    s7obj.monitor.el05 = n.readInt16BE(16)
    s7obj.monitor.tt05 = n.readInt16BE(18)
    s7obj.monitor.qq01 = n.readInt16BE(20)
    s7obj.monitor.qq02 = n.readInt16BE(22)
    s7obj.monitor.qq03 = n.readInt16BE(24)
    s7obj.monitor.qq04 = n.readInt16BE(26)
    s7obj.monitor.qq05 = n.readInt16BE(28)
    s7obj.monitor.qq06 = n.readInt16BE(30)
    s7obj.monitor.qq07 = n.readInt16BE(32)
    s7obj.monitor.qq08 = n.readInt16BE(34)
    s7obj.monitor.qq09 = n.readInt16BE(36)
    s7obj.monitor.qq10 = n.readInt16BE(38)
    /**
     * South
     */
    s7obj.monitor.el06 = s.readInt16BE(0)
    s7obj.monitor.tt06 = s.readInt16BE(2)
    s7obj.monitor.el07 = s.readInt16BE(4)
    s7obj.monitor.tt07 = s.readInt16BE(6)
    s7obj.monitor.el08 = s.readInt16BE(8)
    s7obj.monitor.tt08 = s.readInt16BE(10)
    s7obj.monitor.el09 = s.readInt16BE(12)
    s7obj.monitor.tt09 = s.readInt16BE(14)
    s7obj.monitor.el10 = s.readInt16BE(16)
    s7obj.monitor.tt10 = s.readInt16BE(18)
    s7obj.monitor.qq11 = s.readInt16BE(20)
    s7obj.monitor.qq12 = s.readInt16BE(22)
    s7obj.monitor.qq13 = s.readInt16BE(24)
    s7obj.monitor.qq14 = s.readInt16BE(26)
    s7obj.monitor.qq15 = s.readInt16BE(28)
    s7obj.monitor.qq16 = s.readInt16BE(30)
    s7obj.monitor.qq17 = s.readInt16BE(32)
    s7obj.monitor.qq18 = s.readInt16BE(34)
    s7obj.monitor.qq19 = s.readInt16BE(36)
    s7obj.monitor.qq20 = s.readInt16BE(38)
  } catch (error) {
    console.log(error)
  } finally {
    wss.broadcast('ch1', { monitor: s7obj.monitor })
  }
}

// async function plc (comm, plc, wss) {
//   try {
//     plc.isOnline = await comm.connectTo(plc)
//     setTimeout(async function forever () {
//       if (plc.isOnline) {
//         const buffer = await comm.readArea(
//           0x84,
//           s7def.DB_MONITOR,
//           s7def.DB_MONITOR_INIT,
//           s7def.DB_MONITOR_LEN,
//           0x02
//         )
//         // update(n, s, wss)
//       } else {
//         plc.isOnline = comm.connect(plc)
//       }
//       setTimeout(forever, plc.polling_time)
//     }, plc.polling_time)
//   } catch (err) {
//     plc.isOnline = commN.s7Error(err)
//   }
// }

async function plcN (wss) {
  const { PLC_N, PLC_S } = s7def
  try {
    PLC_N.isOnline = await commN.connectTo(PLC_N)
    PLC_S.isOnline = await commS.connectTo(PLC_S)
    setTimeout(async function forever () {
      if (PLC_N.isOnline) {
        const n = await commN.readArea(
          0x84,
          s7def.DB_MONITOR,
          s7def.DB_MONITOR_INIT,
          s7def.DB_MONITOR_LEN,
          0x02
        )
        const s = await commS.readArea(
          0x84,
          s7def.DB_MONITOR,
          s7def.DB_MONITOR_INIT,
          s7def.DB_MONITOR_LEN,
          0x02
        )
        update(n, s, wss)
      } else {
        PLC_N.isOnline = commN.connect(PLC_N)
      }
      setTimeout(forever, PLC_N.polling_time)
    }, PLC_N.polling_time)
  } catch (err) {
    PLC_N.isOnline = commN.s7Error(err)
  }
}

const main = async () => {
  try {
    const wss = websocket('/ws/daman', fastify)
    await fastify.listen(s7def.HTTP)
    /**
     * PLC comm
     */
    await plcN(wss)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

main()
