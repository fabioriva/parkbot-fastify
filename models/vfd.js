class Vfd {
  constructor (
    name,
    online,
    enabled,
    status = 0,
    speed = 0,
    current = 0,
    load = 0,
    trip = 0
  ) {
    this.name = name
    this.online = online
    this.enabled = enabled
    this.status = status
    this.speed = speed
    this.current = current
    this.load = load
    this.trip = trip
  }

  update (buffer) {
    this.status = buffer.readInt16BE(0)
    this.speed = buffer.readInt16BE(2)
    this.current = buffer.readInt16BE(4)
    this.load = buffer.readInt16BE(6)
    this.trip = buffer.readInt16BE(8)
  }
}

module.exports = Vfd
