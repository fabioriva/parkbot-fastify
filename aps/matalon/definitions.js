exports.APS = 'washingthonblvd'
exports.TZ = 'America/Jerusalem'
exports.HTTP = 8093
exports.PORT = 49013
exports.HOST = process.env.DEVELOPMENT_SERVER
exports.PLC = {
  ip: '192.168.71.2',
  rack: 0,
  slot: 1,
  polling_time: 300
}

exports.DEVICES = 3
exports.POSITIONS = 5
exports.QUEUE = 5
exports.AB = 23
exports.EB = 29
exports.MB = 8

const CARDS = 59
const CARD_LEN = 10
exports.CARDS = CARDS
exports.DB_CARDS = 511
exports.DB_CARDS_INIT = 0
exports.DB_CARDS_LEN = CARDS * CARD_LEN

const STALLS = 62
const STALL_LEN = 10
exports.STALLS = STALLS
exports.DB_MAP = 510
exports.DB_MAP_INIT = 0
exports.DB_MAP_LEN = STALLS * STALL_LEN

exports.DB_DATA = 505
exports.DB_DATA_INIT = 0
exports.DB_DATA_INIT_DEVICE = 32
exports.DB_DATA_INIT_POS = 80
exports.DB_DATA_INIT_QUEUE = 100
exports.DB_DATA_INIT_AB = 140
exports.DB_DATA_INIT_EB = 164
exports.DB_DATA_INIT_MB = 194
exports.DB_DATA_LEN = 202

const ALARM_LEN = 8
exports.ALARM_LEN = ALARM_LEN
const DB_ALARM_1 = 531
const DB_ALARM_2 = 532
const DB_ALARM_3 = 533

exports.DB_ALARM_INIT = 6
exports.DB_ALARM_LEN = 16 * ALARM_LEN * 4
exports.DBS_ALARM = [DB_ALARM_1, DB_ALARM_2, DB_ALARM_3]
