class Position {
  constructor (name, destination = 0, position = 0) {
    this.name = name
    this.destination = destination
    this.position = position
  }

  update (buffer) {
    this.destination = buffer.readInt16BE(0)
    this.position = buffer.readInt16BE(2)
  }
}

module.exports = Position
