require('dotenv').config()
const fastify = require('fastify')({ logger: { name: 'wallstreet' } })
const MongoClient = require('mongodb').MongoClient
const snap7 = require('node-snap7')
const s7def = require('./definitions')
const s7obj = require('./entities')
const plc = require('../../lib/plc')
const websocket = require('../../lib/websocket')

const start = async () => {
  try {
    const cpu = new snap7.S7Client()
    const client = await MongoClient.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    const db = client.db('wallstreet')
    const wss = websocket('/ws/wallstreet', fastify)
    fastify.register(require('fastify-cors'), { origin: '*' })
    fastify.register(require('fastify-mongodb'), { client })
    fastify.register(require('../../lib/routes'), {
      prefix: '/aps/wallstreet',
      cpu,
      s7def,
      s7obj
    })
    await fastify.listen(s7def.HTTP)
    await plc(cpu, db, s7def, s7obj, wss)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
