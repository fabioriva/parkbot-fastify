class Queue {
  constructor (id, card = 0, stall = 0) {
    this.id = id
    this.card = card
    this.stall = stall
  }

  update (buffer) {
    this.card = buffer.readInt16BE(0)
    this.stall = buffer.readInt16BE(2)
  }
}

module.exports = Queue
