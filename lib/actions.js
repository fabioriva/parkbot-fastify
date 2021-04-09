const findCard = (stalls, card) => stalls.find(stall => stall.status === card)

async function actions (fastify, options) {
  const { plc, s7def, s7obj } = options

  fastify.post('/card/edit', {}, async function (request, reply) {
    const { card, code } = request.body
    const regexp = new RegExp('^[a-fA-F0-9]{3}$')
    if (regexp.test(code)) {
      // const buffer = Buffer.alloc(10)
      // buffer.writeUInt16BE(parseInt(code, 16), 0) // string to hex
      // buffer.writeUInt32BE(SetPlcTime(from), 2)
      // buffer.writeUInt32BE(SetPlcTime(to), 6)
      // const response = await writeArea(0x84, s7def.DB_CARDS, ((card - 1) * s7def.CARD_LEN), s7def.CARD_LEN, 0x02, buffer)
      const buffer = Buffer.alloc(4)
      buffer.writeUInt16BE(card, 0)
      buffer.writeUInt16BE(parseInt(code, 16), 2) // string to hex
      const response = await plc.write(s7def.CARD_EDIT, buffer)
      return {
        type: response ? 'success' : 'error',
        info: response ? 'Written' : 'Write error!'
      }
    } else {
      return {
        type: 'warning',
        info: 'code regexp is not valid!'
      }
    }
  })
  fastify.post('/map/edit', {}, async function (request, reply) {
    const { card, stall } = request.body
    if (card >= 1 && card <= s7def.CARDS) {
      if (findCard(s7obj.stalls, card)) {
        return {
          type: 'warning',
          info: 'card in use!'
        }
      }
    }
    const buffer = Buffer.alloc(4)
    buffer.writeUInt16BE(stall, 0)
    buffer.writeUInt16BE(card, 2)
    const response = await plc.write(s7def.MAP_EDIT, buffer)
    // plc.map(s7def, s7obj)
    return {
      // data: s7obj.map, // json
      type: response ? 'success' : 'error',
      info: response ? 'Written' : 'Write error!'
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
    const response = await plc.write(s7def.REQ_0, buffer)
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
    const response = await plc.write(s7def.QUEUE_DELETE, buffer)
    return {
      type: response ? 'success' : 'error',
      info: response ? 'Written' : 'Write error!'
    }
  })
}

module.exports = actions
