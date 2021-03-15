exports.APS = 'wallstreet'
exports.TZ = 'America/Los_Angeles'
exports.HTTP = 8089
exports.PORT = 49009
exports.HOST = process.env.DEVELOPMENT_SERVER
exports.PLC = {
  ip: '192.168.67.2',
  rack: 0,
  slot: 1,
  polling_time: 999
}

exports.DEVICES = 6
exports.DRIVES = 12
exports.POSITIONS = 18
exports.QUEUE = 5
// exports.AB = 36
// exports.EB = 66
// exports.MB = 8
exports.PN = 8 // Profinet nodes

const CARDS = 266
const CARD_LEN = 12
exports.CARDS = CARDS
exports.CARD_LEN = CARD_LEN
exports.DB_CARDS = 512
exports.DB_CARDS_INIT = 0
exports.DB_CARDS_LEN = CARDS * CARD_LEN

const STALLS = 276
const STALL_LEN = 10
exports.STALLS = STALLS
exports.STALL_LEN = STALL_LEN
exports.DB_MAP = 510
exports.DB_MAP_INIT = 0
exports.DB_MAP_LEN = STALLS * STALL_LEN

const DB_DATA = 506
exports.DB_DATA = DB_DATA
exports.DB_DATA_INIT = 0
exports.DB_DATA_INIT_DEVICE = 32
exports.DB_DATA_INIT_DRIVE = 128
exports.DB_DATA_INIT_POS = 248
exports.DB_DATA_INIT_QUEUE = 320
exports.DB_DATA_INIT_AB = 360
exports.DB_DATA_INIT_EB = 402
exports.DB_DATA_INIT_MB = 474
exports.DB_DATA_INIT_PN = 482
exports.DB_DATA_INIT_MOTORS = 490
exports.DB_DATA_LEN = 508

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

exports.MAP_EDIT = {
  area: 0x84,
  dbNumber: DB_DATA,
  start: 520,
  amount: 4,
  wordLen: 0x02
}
exports.CARD_EDIT = {
  area: 0x84,
  dbNumber: DB_DATA,
  start: 524,
  amount: 4,
  wordLen: 0x02
}
exports.QUEUE_DELETE = {
  area: 0x84,
  dbNumber: DB_DATA,
  start: 528,
  amount: 4,
  wordLen: 0x02
}
exports.REQ_0 = {
  area: 0x84,
  dbNumber: DB_DATA,
  start: 532,
  amount: 2,
  wordLen: 0x02
}
