require('dotenv').config()
const fastify = require('fastify')({ logger: { name: 'wallstreet' } })
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
    const db = client.db('wallstreet')
    const wss = websocket('/ws/wallstreet', fastify)
    const plc01 = new PLC(s7def.PLC, wss)
    plc01.main(s7def, s7obj)
    log(db, plc01, s7def, s7obj)
    fastify.register(require('fastify-cors'), {
      origin: 'https://parkbot.vercel.app'
    })
    fastify.register(require('fastify-mongodb'), { client })
    fastify.register(require('../../lib/routes'), {
      prefix: '/aps/wallstreet',
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
