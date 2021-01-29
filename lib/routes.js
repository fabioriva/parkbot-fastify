const { getHistory } = require('./db')

const schema = {
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
}

async function routes (fastify, options) {
  const { s7def, s7obj } = options

  fastify.get('/alarms/:group', {}, function (request, reply) {
    reply.send(s7obj.groups[request.params.group]._active) // getter
  })
  fastify.get('/cards', function (request, reply) {
    reply.send(s7obj.cards)
  })
  fastify.get('/history', { schema }, async function (request, reply) {
    const db = this.mongo.client.db(s7def.APS)
    const docs = await getHistory(db, request.query)
    reply.send(docs)
  })
  fastify.get('/logs', {}, async function (request, reply) {
    // const db = this.mongo.db
    const db = this.mongo.client.db(s7def.APS)
    const docs = await getHistory(db, request.query)
    console.log('query len:', docs.length)
    reply.send(docs)
  })
  fastify.get('/map', function (request, reply) {
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
    function (req, reply) {
      reply.send(s7obj.racks[req.params.rack])
    }
  )
  fastify.get('/stalls', function (request, reply) {
    reply.send(s7obj.stalls)
  })
}

module.exports = routes
