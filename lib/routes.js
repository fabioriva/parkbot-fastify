const format = require('date-fns/format')
const actions = require('./actions')
const {
  getHistory,
  getHistoryLog,
  getRecentActivity,
  getOperations
} = require('./db')

async function routes (fastify, options) {
  actions(fastify, options)

  const { plc, s7def, s7obj } = options

  fastify.get('/alarms/:group', {}, function (request, reply) {
    reply.send(s7obj.groups[request.params.group]._active) // getter
  })
  fastify.get('/cards', async function (request, reply) {
    await plc.cards(s7def, s7obj)
    reply.send(s7obj.cards)
  })
  fastify.get('/dashboard', async function (request, reply) {
    const db = this.mongo.client.db(s7def.APS)
    const activity = await getRecentActivity(db, 5)
    const statistics = await getOperations(db, {
      dateString: format(new Date(), 'yyyy-MM-dd')
    })
    reply.send({
      activity: activity,
      cards: s7obj.cards.length,
      occupancy: s7obj.map.statistics[0],
      operations: statistics,
      system: s7obj.overview
    })
  })
  fastify.get(
    '/devices/:device',
    {
      schema: {
        params: {
          type: 'object',
          additionalProperties: false,
          required: ['device'],
          properties: {
            device: {
              type: 'number',
              minimum: 0,
              maximum: s7obj.diagnostic?.length - 1
            }
          }
        }
      }
    },
    function (request, reply) {
      reply.send(s7obj.diagnostic[request.params.device])
    }
  )
  fastify.get(
    '/history',
    {
      query: {
        type: 'object',
        required: ['filter'],
        properties: {
          dateFrom: { type: 'string', format: 'date-time' },
          dateTo: { type: 'string', format: 'date-time' },
          filter: {
            type: 'string',
            pattern: '(a|b|c)',
            minLength: 1,
            maxLength: 1
          },
          number: { type: 'number', minimum: 0, maximum: 3 }
        }
      }
    },
    async function (request, reply) {
      const db = this.mongo.client.db(s7def.APS)
      const docs = await getHistory(db, request.query)
      reply.send(docs)
    }
  )
  fastify.get(
    '/history/:log',
    {
      schema: {
        params: {
          type: 'object',
          additionalProperties: false,
          required: ['log'],
          properties: {
            log: {
              type: 'string'
            }
          }
        }
      }
    },
    async function (request, reply) {
      console.log({ log: request.params.log })
      const db = this.mongo.client.db(s7def.APS)
      const docs = await getHistoryLog(db, request.params.log)
      reply.send(docs)
    }
  )
  fastify.get('/map', async function (request, reply) {
    await plc.map(s7def, s7obj)
    reply.send(s7obj.map)
  })
  fastify.get('/overview', function (request, reply) {
    reply.send(s7obj.overview)
  })
  fastify.get('/racks', function (request, reply) {
    reply.send(s7obj.racks)
  })
  fastify.get(
    '/racks/:rack',
    {
      schema: {
        params: {
          type: 'object',
          additionalProperties: false,
          required: ['rack'],
          properties: {
            rack: {
              type: 'number',
              minimum: 0,
              maximum: s7obj.racks?.length - 1
            }
          }
        }
      }
    },
    function (request, reply) {
      reply.send(s7obj.racks[request.params.rack])
    }
  )
  fastify.get('/stalls', function (request, reply) {
    reply.send(s7obj.stalls)
  })
  fastify.get('/statistics', async function (request, reply) {
    const db = this.mongo.client.db(s7def.APS)
    const docs = await getOperations(db, request.query)
    reply.send(docs)
  })
}

module.exports = routes
