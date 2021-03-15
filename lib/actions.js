const comm = require('./comm')

const findCard = (stalls, card) => stalls.find(stall => stall.status === card)

async function actions (fastify, options) {
  const { cpu, s7def, s7obj } = options

  fastify.post('/map/edit', {}, function (request, reply) {
    const { card, stall } = request.body
    console.log(request.body, s7obj.stalls[255])
    return {
      map: s7obj.map
    }
  })
  fastify.post('/system/operation', {}, async function (request, reply) {
    const { operation, value } = request.body
    if (value < 1 || value > s7def.CARDS) {
      return {
        type: 'warning',
        info: 'card out of range'
      }
    }
    const card = findCard(s7obj.stalls, value) // s7obj.stalls.find(s => s.status === value)
    if (operation === 0 && card === undefined) {
      return {
        type: 'warning',
        info: 'card not present!'
      }
    }
    if (operation !== 0 && card) {
      return {
        type: 'warning',
        info: 'card in use!'
      }
    }
    const buffer = Buffer.allocUnsafe(2)
    buffer.writeUInt16BE(value, 0)
    const response = await comm.writeArea(
      cpu,
      s7def.REQ_0.area,
      s7def.REQ_0.dbNumber,
      s7def.REQ_0.start,
      s7def.REQ_0.amount,
      s7def.REQ_0.wordLen,
      buffer
    )
    return {
      type: response ? 'success' : 'error',
      info: response ? 'Written' : 'Write error!'
    }
  })
  fastify.post('/system/queue/delete', {}, async function (request, reply) {
    const { card, index } = request.body
    const buffer = Buffer.alloc(s7def.QUEUE_DELETE.amount).fill(0)
    buffer.writeUInt16BE(index, 0)
    buffer.writeUInt16BE(card, 2)
    const response = await comm.writeArea(
      cpu,
      s7def.QUEUE_DELETE.area,
      s7def.QUEUE_DELETE.dbNumber,
      s7def.QUEUE_DELETE.start,
      s7def.QUEUE_DELETE.amount,
      s7def.QUEUE_DELETE.wordLen,
      buffer
    )
    return {
      type: response ? 'success' : 'error',
      info: response ? 'Written' : 'Write error!'
    }
  })
}

module.exports = actions
