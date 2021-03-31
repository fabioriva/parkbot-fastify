exports.APS = 'washingtonblvd'
exports.TZ = 'America/Los_Angeles'
exports.HTTP = 8092
exports.PORT = 49012
exports.HOST =
  process.env.NODE_ENV !== 'production'
    ? process.env.DEVELOPMENT_SERVER
    : process.env.PRODUCTION_SERVER
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

const CARDS = 212
const CARD_LEN = 10
exports.CARDS = CARDS
exports.CARD_LEN = CARD_LEN

const STALLS = 213
const STALL_LEN = 10
exports.STALLS = STALLS
exports.STALL_LEN = STALL_LEN

const DB_DATA = 505
exports.DB_DATA_INIT_DEVICE = 32
exports.DB_DATA_INIT_DRIVE = 128
exports.DB_DATA_INIT_POS = 218
exports.DB_DATA_INIT_QUEUE = 290
exports.DB_DATA_INIT_AB = 310
exports.DB_DATA_INIT_EB = 350
exports.DB_DATA_INIT_MB = 402
exports.DB_DATA_INIT_PN = 410
exports.DB_DATA_INIT_MOTORS = 418
// exports.DB_DATA_LEN = 434

const ALARM_LEN = 8
exports.ALARM_LEN = ALARM_LEN
exports.DB_ALARM_INIT = 4
exports.DB_ALARM_LEN = 16 * ALARM_LEN * 4
exports.DBS_ALARM = [531, 532, 533, 534, 535, 536]

exports.DATA_READ = {
  area: 0x84,
  dbNumber: DB_DATA,
  start: 0,
  amount: 434,
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
  start: 446,
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
  start: 450,
  amount: 4,
  wordLen: 0x02
}
exports.QUEUE_DELETE = {
  area: 0x84,
  dbNumber: DB_DATA,
  start: 454,
  amount: 4,
  wordLen: 0x02
}
exports.REQ_0 = {
  area: 0x84,
  dbNumber: DB_DATA,
  start: 458,
  amount: 2,
  wordLen: 0x02
}

/**
 * Monitor service
 */
exports.DB_MONITOR = 828
exports.DB_MONITOR_INIT = 0
exports.DB_MONITOR_LEN = 30
