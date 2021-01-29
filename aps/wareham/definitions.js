exports.APS = 'wareham'
exports.HTTP = 8086
exports.PORT = 49006
exports.HOST = process.env.DEVELOPMENT_SERVER
exports.PLC = {
  ip: '192.168.59.2',
  rack: 0,
  slot: 1,
  polling_time: 300
}

exports.DEVICES = 4
exports.POSITIONS = 8
exports.OPERATIONS = 16
exports.QUEUE = 5
exports.AB = 19
exports.EB = 31
exports.MB = 8

const CARDS = 69
const CARD_LEN = 10
exports.CARDS = CARDS
exports.DB_CARDS = 511
exports.DB_CARDS_INIT = 0
exports.DB_CARDS_LEN = CARDS * CARD_LEN

const STALLS = 71
const STALL_LEN = 10
exports.STALLS = STALLS
exports.DB_MAP = 510
exports.DB_MAP_INIT = 0
exports.DB_MAP_LEN = STALLS * STALL_LEN

exports.DB_DATA = 505
exports.DB_DATA_INIT = 0
exports.DB_DATA_INIT_DEVICE = 32
exports.DB_DATA_INIT_POS = 96
exports.DB_DATA_INIT_QUEUE = 128
exports.DB_DATA_INIT_AB = 168
exports.DB_DATA_INIT_EB = 188
exports.DB_DATA_INIT_MB = 220
exports.DB_DATA_LEN = 228

exports.REQ_EXIT = 244
exports.REQ_ENTRY_1 = 246
exports.REQ_ENTRY_2 = 248

const ALARM_LEN = 8
exports.ALARM_LEN = ALARM_LEN
const DB_ALARM_1 = 531
const DB_ALARM_2 = 532
const DB_ALARM_3 = 533
const DB_ALARM_4 = 534
exports.DB_ALARM_INIT = 6
exports.DB_ALARM_LEN = 16 * ALARM_LEN * 4
exports.DBS_ALARM = [DB_ALARM_1, DB_ALARM_2, DB_ALARM_3, DB_ALARM_4]
