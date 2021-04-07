require('dotenv').config()
const fastify = require('fastify')({ logger: { name: 'washingtonblvd' } })
const MongoClient = require('mongodb').MongoClient
const s7def = require('./definitions')
const s7obj = require('./entities')
const log = require('../../lib/log')
const PLC = require('../../lib/Plc')
const websocket = require('../../lib/websocket')

const start = async () => {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    const db = client.db('washingtonblvd')
    const wss = websocket('/ws/washingtonblvd', fastify)
    const plc01 = new PLC(s7def.PLC)
    plc01.broadcast = wss.broadcast
    plc01.main(s7def, s7obj)
    log(db, plc01, s7def, s7obj)
    fastify.register(require('fastify-cors'), {
      origin: '*',
      allowedHeaders:
        '*, Accept, Content-Type, Content-Length, Accept-Encoding',
      credentials: true,
      methods: 'GET,POST'
    })
    fastify.register(require('fastify-mongodb'), { client })
    fastify.register(require('../../lib/routes'), {
      prefix: '/aps/washingtonblvd',
      plc: plc01,
      s7def,
      s7obj
    })
    await fastify.listen(s7def.HTTP)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
