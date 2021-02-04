require('dotenv').config()
const fastify = require('fastify')({ logger: { name: 'washingtonblvd' } })
const MongoClient = require('mongodb').MongoClient
const s7def = require('./definitions')
const s7obj = require('./entities')
const plc = require('../../lib/plc')
const websocket = require('../../lib/websocket')

const start = async () => {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    const db = client.db('washingtonblvd')
    const wss = websocket('/ws/washingtonblvd', fastify)
    fastify.register(require('fastify-mongodb'), { client })
    fastify.register(require('../../lib/routes'), {
      prefix: '/api/washingtonblvd',
      s7def,
      s7obj
    })
    await fastify.listen(s7def.HTTP)
    await plc(db, s7def, s7obj, wss)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
