exports.APS = 'bmc'
exports.TZ = 'Asia/Kolkata'
exports.HTTP = 8095
exports.PORT = 49015
exports.HOST =
  process.env.NODE_ENV !== 'production'
    ? process.env.DEVELOPMENT_SERVER
    : process.env.PRODUCTION_SERVER
exports.PLC = {
  ip: '192.168.69.2',
  rack: 0,
  slot: 1,
  polling_time: 500
}

exports.DEVICES = 6
exports.DRIVES = 4
exports.POSITIONS = 12
exports.QUEUE = 5

const CARDS = 240
const CARD_LEN = 10
exports.CARDS = CARDS
exports.CARD_LEN = CARD_LEN

const STALLS = 240
const STALL_LEN = 10
exports.STALLS = STALLS
exports.STALL_LEN = STALL_LEN

exports.APS_DEF = {
  cards: CARDS,
  stalls: STALLS,
  stallStatus: {
    FREE: 0,
    PAPA: 997,
    RSVD: 998,
    LOCK: 999
  }
}

const DB_DATA = 505
const DB_DATA_LEN = 332
exports.DB_DATA_INIT_DEVICE = 32
exports.DB_DATA_INIT_DRIVE = 128
exports.DB_DATA_INIT_POS = 168
exports.DB_DATA_INIT_QUEUE = 216
exports.DB_DATA_INIT_AB = 236
exports.DB_DATA_INIT_EB = 266
exports.DB_DATA_INIT_MB = 300
exports.DB_DATA_INIT_PN = 308
exports.DB_DATA_INIT_MOTORS = 316

const ALARM_LEN = 8
exports.ALARM_LEN = ALARM_LEN
exports.DB_ALARM_INIT = 4
exports.DB_ALARM_LEN = 16 * ALARM_LEN * 4
exports.DBS_ALARM = [531, 532, 533, 534, 535, 536]

exports.DATA_READ = {
  area: 0x84,
  dbNumber: DB_DATA,
  start: 0,
  amount: DB_DATA_LEN,
  wordLen: 0x02
}
exports.MAP_READ = {
  area: 0x84,
  dbNumber: 510,
  start: 0,
  amount: STALLS * STALL_LEN,
  wordLen: 0x02
}
exports.MAP_EDIT = {
  area: 0x84,
  dbNumber: DB_DATA,
  start: 344,
  amount: 4,
  wordLen: 0x02
}
exports.CARD_READ = {
  area: 0x84,
  dbNumber: 511,
  start: 0,
  amount: CARDS * CARD_LEN,
  wordLen: 0x02
}
exports.CARD_EDIT = {
  area: 0x84,
  dbNumber: DB_DATA,
  start: 348,
  amount: 4,
  wordLen: 0x02
}
exports.QUEUE_DELETE = {
  area: 0x84,
  dbNumber: DB_DATA,
  start: 352,
  amount: 4,
  wordLen: 0x02
}
exports.REQ_0 = {
  area: 0x84,
  dbNumber: DB_DATA,
  start: 356,
  amount: 2,
  wordLen: 0x02
}
