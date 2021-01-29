const Mode = require('./mode')

class Device {
  constructor (
    id,
    name,
    card = 0,
    mode = new Mode(0, 'mode-no-func'),
    motor = 0,
    operation = 0,
    position = 0,
    size = 0,
    stall = 0,
    step = 0
  ) {
    this.id = id
    this.name = name
    this.card = card
    this.mode = mode
    this.motor = motor
    this.operation = operation
    this.position = position
    this.size = size
    this.stall = stall
    this.step = step
  }

  update (buffer, modes) {
    this.card = buffer.readInt16BE(0)
    this.mode = modes.find(i => i.id === buffer.readInt16BE(2))
    this.motor = buffer.readInt16BE(4)
    this.operation = buffer.readInt16BE(6)
    this.position = buffer.readInt16BE(8)
    this.size = buffer.readInt16BE(10)
    this.stall = buffer.readInt16BE(12)
    this.step = buffer.readInt16BE(14)
  }
}

module.exports = Device
