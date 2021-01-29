const format = require('date-fns/format')
const endOfDay = require('date-fns/endOfDay')
const startOfDay = require('date-fns/startOfDay')
const { getPlcDateTime } = require('../lib/utils7')

class Card {
  constructor (
    nr,
    code,
    from = format(startOfDay(new Date()), 'HH:mm:ss'),
    to = format(endOfDay(new Date()), 'HH:mm:ss'),
    status = 0 // 0=not used, stall=in use ...
  ) {
    this.nr = nr
    this.code = code
    this.from = from
    this.to = to
    this.rand = this.getRandomIntInclusive(256, 4095)
      .toString(16)
      .toUpperCase()
    this.status = status
  }

  getRandomIntInclusive (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  update (buffer) {
    this.code = buffer
      .readInt16BE(0)
      .toString(16)
      .toUpperCase()
    this.from = format(getPlcDateTime(0, buffer.readInt32BE(2)), 'HH:mm:ss')
    this.to = format(getPlcDateTime(0, buffer.readInt32BE(6)), 'HH:mm:ss')
    this.status = buffer.length === 12 && buffer.readInt16BE(10)
  }
}

module.exports = Card
