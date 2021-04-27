const format = require('date-fns/format')
const { getPlcDateTime } = require('../lib/utils7')

class Alarm {
  constructor (id, device, status) {
    this.id = id
    this.device = device
    this.status = status
    // this.label = label
    // this.info = info
  }

  get _i18n () {
    return this.i18n
  }

  set _i18n (obj) {
    if (obj) {
      this.i18n = obj
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

function generateAlarms (device, min, max, texts) {
  const alarms = []
  for (let i = min; i <= max; i++) {
    alarms.push(new Alarm(i, device, false))
  }
  alarms.forEach((alarm, index) => {
    alarm.label = texts[index].label
    alarm._i18n = texts[index].i18n
    // alarm._query = texts[index].query
    // if (texts[index].args !== undefined) {
    //   alarm.args = texts[index].args?.map(arg =>
    //     inputs.find(b => b.addr === arg)
    //   )
    // }
  })
  return alarms
}

class AlarmGroup {
  constructor (alarms = [], name) {
    this.alarms = alarms
    this.name = name
  }

  get _active () {
    // return {
    //   name: this.name,
    //   active: this.alarms
    //     .filter(item => item.status !== false)
    //     .sort((a, b) => new Date(b.date) - new Date(a.date))
    // }
    return this.alarms
      .filter(item => item.status !== false)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
    // .sort((a, b) => (isAfter(parseISO(a.date), parseISO(b.date)) ? -1 : 1))
  }

  set _active (alarms) {
    this.active = alarms.filter(item => item.status !== false)
    // .sort((a, b) => (isAfter(parseISO(a.date), parseISO(b.date)) ? -1 : 1))
  }
}

module.exports = { Alarm, AlarmGroup, generateAlarms }
