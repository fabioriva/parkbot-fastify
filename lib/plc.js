const comm = require('./comm')
const { insertLog } = require('./db')
const { logEmitter, logServer } = require('./log')
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

async function getAlarms (s7def, s7obj, wss, options) {
  try {
    if (options?.device) {
      const group = options.device
      const buffer = await comm.readArea(
        0x84,
        s7def.DBS_ALARM[group],
        s7def.DB_ALARM_INIT,
        s7def.DB_ALARM_LEN,
        0x02
      )
      const alarms = await updateAlarmGroup(
        0,
        buffer,
        s7def.ALARM_LEN,
        s7obj.groups[group].alarms
      )
      // s7obj.groups[group]._active(alarms) // setter
      s7obj.groups[group]._active = alarms
    } else {
      await Promise.all(
        s7obj.groups.map(async (group, index) => {
          const buffer = await comm.readArea(
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
          // group._active(alarms)
          group._active = alarms
        })
      )
    }
  } catch (error) {
    s7def.PLC.isOnline = comm.s7Error(error)
  } finally {
    wss.broadcast('ch1', { alarms: s7obj.groups })
  }
}

async function getCards (s7def, s7obj, wss) {
  try {
    const buffer = await comm.readArea(
      0x84,
      s7def.DB_CARDS,
      s7def.DB_CARDS_INIT,
      s7def.DB_CARDS_LEN,
      0x02
    )
    const json = await updateCards(0, buffer, s7def.CARD_LEN, s7obj.cards)
    wss.broadcast('ch1', { cards: json })
  } catch (error) {
    s7def.PLC.isOnline = comm.s7Error(error)
  }
}

async function getData (s7def, s7obj, wss) {
  try {
    const buffer = await comm.readArea(
      0x84,
      s7def.DB_DATA,
      s7def.DB_DATA_INIT,
      s7def.DB_DATA_LEN,
      0x02
    )
    await updateData(buffer, s7def, s7obj)
    /**
     * Diagnostic
     */
    s7obj.overview.devices.forEach(item => {
      if (item?.f !== undefined) {
        item.f.forEach(item => {
          item.motion_()
          item.position_()
        })
      }
    })
  } catch (error) {
    s7def.PLC.isOnline = comm.s7Error(error)
  } finally {
    wss.broadcast('ch1', {
      overview: s7obj.overview,
      racks: s7obj.racks
    })
  }
}

async function getMap (s7def, s7obj, wss) {
  try {
    const buffer = await comm.readArea(
      0x84,
      s7def.DB_MAP,
      s7def.DB_MAP_INIT,
      s7def.DB_MAP_LEN,
      0x02
    )
    const json = await updateMap(buffer, s7def, s7obj)
    wss.broadcast('ch1', { map: json })
  } catch (error) {
    s7def.PLC.isOnline = comm.s7Error(error)
  }
}

async function plc (db, s7def, s7obj, wss) {
  const { PLC, PORT, HOST } = s7def
  /**
   * PLC Log
   */
  logServer(PORT, HOST)
  logEmitter.on('log', async function (s7log) {
    switch (s7log.operation) {
      case 1: // alarm in
      case 2: // alarm out
        getAlarms(s7def, s7obj, wss, { device: s7log.device })
        break
      case 4: // edit card
        getCards(s7def, s7obj, wss)
        break
      case 5: // in
      case 6: // out
      case 7: // shuffle in
      case 8: // shuffle out
      case 9: // reserve stall
        getMap(s7def, s7obj, wss)
        break
    }
    const result = await insertLog(db, s7log, s7obj)
    console.log(result.ops)
  })
  /**
   * PLC Data
   */
  try {
    PLC.isOnline = await comm.connectTo(PLC)
    // getAlarms(s7def, s7obj, wss)
    getCards(s7def, s7obj, wss)
    getMap(s7def, s7obj, wss)
    setTimeout(function forever () {
      wss.broadcast('ch2', { comm: PLC, map: s7obj.map.statistics[0] })
      if (PLC.isOnline) {
        wss.broadcast('ch2', { diag: alarmsCount(s7obj.groups) })
        getData(s7def, s7obj, wss)
      } else {
        PLC.isOnline = comm.connect(PLC)
      }
      setTimeout(forever, PLC.polling_time)
    }, PLC.polling_time)
  } catch (error) {
    PLC.isOnline = comm.s7Error(error)
  }
}

module.exports = plc
