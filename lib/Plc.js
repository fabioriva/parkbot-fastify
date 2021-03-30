const snap7 = require('node-snap7')
const comm = require('./comm')
const {
  updateAlarmGroup,
  updateCards,
  updateData,
  updateMap
} = require('./utils')

function alarmsCount (groups) {
  let count = 0
  groups.forEach(group => {
    count += group._active.length
  })
  return {
    count: count,
    isActive: count > 0
  }
}

class PLC {
  constructor (plc) {
    this.client = new snap7.S7Client()
    this.online = false
    this.plc = plc
  }

  diagnostic (s7def, s7obj) {
    s7obj.diagnostic.forEach(item => {
      // Actuators
      if (item.f !== undefined) {
        item.f.forEach(item => {
          item.motion_()
          item.position_()
          item.diagnostic_(s7def.TZ)
        })
      }
      // Motors
      if (item.g !== undefined) {
        item.g.forEach(item => {
          item.motion_()
          item.diagnostic_(s7def.TZ)
        })
      }
      // Silomat
      if (item.i !== undefined) {
        item.i.motion_()
        item.i.diagnostic_(s7def.TZ)
      }
    })
  }

  error (error) {
    this.online = comm.s7Error(this.client, error)
  }

  async connect () {
    this.online = await comm.connectTo(this.client, this.plc)
  }

  async alarms (s7def, s7obj) {
    try {
      await Promise.all(
        s7obj.groups.map(async (group, index) => {
          const buffer = await comm.readArea(
            this.client,
            0x84,
            s7def.DBS_ALARM[index],
            s7def.DB_ALARM_INIT,
            s7def.DB_ALARM_LEN,
            0x02
          )
          const alarms = await updateAlarmGroup(
            0,
            buffer,
            s7def.ALARM_LEN,
            group.alarms
          )
          group._active = alarms
        })
      )
    } catch (error) {
      this.error(error)
    } finally {
      this.broadcast('ch1', { alarms: s7obj.groups })
    }
  }

  async cards (s7def, s7obj) {
    try {
      const buffer = await this.read(s7def.CARD_READ)
      const json = await updateCards(0, buffer, s7def.CARD_LEN, s7obj.cards)
      this.broadcast('ch1', { cards: json })
    } catch (error) {
      this.error(error)
    }
  }

  async data (s7def, s7obj) {
    try {
      const buffer = await this.read(s7def.DATA_READ)
      await updateData(buffer, s7def, s7obj)
    } catch (error) {
      this.error(error)
    } finally {
      this.broadcast('ch1', {
        diagnostic: s7obj.diagnostic,
        overview: s7obj.overview,
        racks: s7obj.racks
      })
    }
  }

  async map (s7def, s7obj) {
    try {
      const buffer = await this.read(s7def.MAP_READ)
      const json = await updateMap(buffer, s7def, s7obj)
      this.broadcast('ch1', { map: json })
    } catch (error) {
      this.error(error)
    }
  }

  async main (s7def, s7obj) {
    try {
      await this.connect()
      const this_ = this
      setTimeout(function forever () {
        if (this_.online) {
          this_.broadcast('ch2', {
            // comm: this_.plc,
            comm: { isOnline: this_.online },
            diag: alarmsCount(s7obj.groups),
            map: s7obj.map.statistics[0]
          })
          this_.data(s7def, s7obj)
          this_.diagnostic(s7def, s7obj)
        } else {
          // this_.broadcast('ch2', { comm: this_.plc })
          this_.broadcast('ch2', { comm: { isOnline: this_.online } })
          this_.online = this_.client.Connect()
        }
        setTimeout(forever, s7def.PLC.polling_time)
      }, s7def.PLC.polling_time)
    } catch (err) {
      this.error(err)
    }
  }

  async read (conn) {
    try {
      const buffer = await comm.readArea(
        this.client,
        conn.area,
        conn.dbNumber,
        conn.start,
        conn.amount,
        conn.wordLen
      )
      return buffer
    } catch (error) {
      this.error(error)
    }
  }

  async write (conn, buffer) {
    try {
      const response = await comm.writeArea(
        this.client,
        conn.area,
        conn.dbNumber,
        conn.start,
        conn.amount,
        conn.wordLen,
        buffer
      )
      return response // return true on success
    } catch (error) {
      this.error(error)
    }
  }
}

module.exports = PLC
