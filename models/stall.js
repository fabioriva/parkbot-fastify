const format = require('date-fns/format')
const { getPlcDateTime } = require('../lib/utils7')

class Stall {
  constructor (nr, status, date, size) {
    this.nr = nr
    this.status = status
    this.date = date
    this.size = size
  }

  update (buffer) {
    this.status = buffer.readInt16BE(0)
    this.date = format(
      getPlcDateTime(buffer.readInt16BE(2), buffer.readInt32BE(4)),
      'yyyy-MM-dd HH:mm:ss'
    )
    this.size = buffer.readInt16BE(8)
  }
}

module.exports = Stall
