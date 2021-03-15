exports.APS = 'washingtonblvd'
exports.TZ = 'America/Los_Angeles'
exports.HTTP = 8092
exports.PORT = 49012
exports.HOST = process.env.DEVELOPMENT_SERVER
exports.PLC = {
  ip: '192.168.61.2',
  rack: 0,
  slot: 1,
  polling_time: 300
}

exports.DEVICES = 6
exports.DRIVES = 9
exports.POSITIONS = 18
exports.QUEUE = 5
// exports.AB = 36
// exports.EB = 66
// exports.MB = 8
exports.PN = 8 // Profinet nodes

const CARDS = 212
const CARD_LEN = 10
exports.CARDS = CARDS
exports.CARD_LEN = CARD_LEN
exports.DB_CARDS = 511
exports.DB_CARDS_INIT = 0
exports.DB_CARDS_LEN = CARDS * CARD_LEN

const STALLS = 213
const STALL_LEN = 10
exports.STALLS = STALLS
exports.STALL_LEN = STALL_LEN
exports.DB_MAP = 510
exports.DB_MAP_INIT = 0
exports.DB_MAP_LEN = STALLS * STALL_LEN

exports.DB_DATA = 505
exports.DB_DATA_INIT = 0
exports.DB_DATA_INIT_DEVICE = 32
exports.DB_DATA_INIT_DRIVE = 128
exports.DB_DATA_INIT_POS = 218
exports.DB_DATA_INIT_QUEUE = 290
exports.DB_DATA_INIT_AB = 310
exports.DB_DATA_INIT_EB = 350
exports.DB_DATA_INIT_MB = 402
exports.DB_DATA_INIT_PN = 410
exports.DB_DATA_INIT_MOTORS = 418
exports.DB_DATA_LEN = 434

const ALARM_LEN = 8
exports.ALARM_LEN = ALARM_LEN
const DB_ALARM_1 = 531
const DB_ALARM_2 = 532
const DB_ALARM_3 = 533
const DB_ALARM_4 = 534
const DB_ALARM_5 = 535
const DB_ALARM_6 = 536
exports.DB_ALARM_INIT = 4
exports.DB_ALARM_LEN = 16 * ALARM_LEN * 4
exports.DBS_ALARM = [
  DB_ALARM_1,
  DB_ALARM_2,
  DB_ALARM_3,
  DB_ALARM_4,
  DB_ALARM_5,
  DB_ALARM_6
]

/**
 * Monitor service
 */
exports.DB_MONITOR = 828
exports.DB_MONITOR_INIT = 0
exports.DB_MONITOR_LEN = 30
