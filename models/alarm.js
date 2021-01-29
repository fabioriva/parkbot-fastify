const { format, isAfter, parseISO } = require('date-fns')
const { getPlcDateTime } = require('../lib/utils7')

class Alarm {
  constructor (id, device, status, label) {
    this.id = id
    this.device = device
    this.status = status
    this.label = label
  }

  get _info () {
    return this.info
  }

  set _info (info) {
    if (info) {
      this.info = info
    }
  }

  update (buffer) {
    this.status = (buffer[0] & 1) === 1
    this.date = format(
      getPlcDateTime(buffer.readInt16BE(2), buffer.readInt32BE(4)),
      'yyyy-MM-dd HH:mm:ss:SSS'
    )
  }
}

class AlarmGroup {
  constructor (alarms = [], name) {
    this.alarms = alarms
    this.name = name
  }

  get _active () {
    return this.alarms
      .filter(item => item.status !== false)
      .sort((a, b) => (isAfter(parseISO(a.date), parseISO(b.date)) ? -1 : 1))
  }

  set _active (alarms) {
    this.active = alarms
      .filter(item => item.status !== false)
      .sort((a, b) => (isAfter(parseISO(a.date), parseISO(b.date)) ? -1 : 1))
  }
}

module.exports = { Alarm, AlarmGroup }
