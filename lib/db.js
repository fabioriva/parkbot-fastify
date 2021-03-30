const mongo = require('mongodb')
const format = require('date-fns/format')
const parseISO = require('date-fns/parseISO')
const util = require('util')
const Diag = {}
const {
  operationsDaily,
  operationsWeekly,
  operationsMontly,
  operationsYearly
} = require('./operations')

class Log {
  constructor (s7log, s7obj) {
    this.alarm = { id: s7log.alarm, info: this.getAlarm(s7log, s7obj) }
    this.card = s7log.card
    this.date = new Date(format(s7log.date, "yyyy-MM-dd'T'HH:mm:ss.SSS'z'"))
    this.device = { id: s7log.device, name: this.getDevice(s7log, s7obj) }
    this.diagnostic = Diag
    this.event = s7log.event
    this.logged = this.getTimestamp(s7log.date)
    this.mode = { id: s7log.mode, info: this.getMode(s7log, s7obj) }
    this.operation = {
      id: s7log.operation,
      info: this.getOperation(s7log, s7obj)
    }
    this.size = s7log.size
    this.stall = s7log.stall
    this.system = s7log.system
  }

  getAlarm (s7log, s7obj) {
    const device = s7log.device - 1
    return s7log.alarm === 0
      ? 'al-ready'
      : s7obj.groups[device].alarms.find(a => a.id === s7log.alarm).label
  }

  getDevice (s7log, s7obj) {
    return s7log.device === 0
      ? 'dev-operator'
      : s7obj.devices.find(d => d.id === s7log.device).name
  }

  getMode (s7log, s7obj) {
    return s7obj.modes.find(item => item.id === s7log.mode).label
  }

  getOperation (s7log, s7obj) {
    return s7obj.operations.find(item => item.id === s7log.operation).label
  }

  getTimestamp (date) {
    return format(date, 'yyyy-MM-dd HH:mm:ss')
  }
}

exports.getHistory = util.promisify((db, query, callback) => {
  let params = {}
  // if (Object.keys(query).length > 0) {
  // console.log('query:', query)
  const { dateFrom, dateTo, filter, number } = query
  params = {
    date: {
      $gte: new Date(dateFrom),
      $lt: new Date(dateTo)
    },
    'alarm.id': filter === 'e' ? { $eq: number } : { $gte: 0 },
    // 'device.id': device === undefined ? { $ne: 0 } : device !== '0' ? { $eq: device } : { $gte: 0 },
    'operation.id': filter === 'b' ? { $gte: 1, $lte: 2 } : { $ne: 0 },
    card: filter === 'c' ? { $eq: number } : { $gte: 0 },
    stall: filter === 'd' ? { $eq: number } : { $gte: 0 }
  }
  // }
  console.log(params, typeof dateFrom, dateFrom)
  // const collection = db.collection('history')
  db.collection('history')
    .find(params)
    .sort({ date: -1 })
    .toArray(function (err, docs) {
      if (err) callback(err)
      console.log('docs:', docs)
      callback(null, {
        count: docs.length,
        dateFrom: format(parseISO(dateFrom), 'yyyy-MM-dd HH:mm'),
        dateTo: format(parseISO(dateTo), 'yyyy-MM-dd HH:mm'),
        // dateFrom: format(parseISO(dateFrom.slice(0, -1)), 'yyyy-MM-dd HH:mm'),
        // dateTo: format(parseISO(dateTo.slice(0, -1)), 'yyyy-MM-dd HH:mm'),
        // dateFrom: format(from, 'yyyy-MM-dd HH:mm'),
        // dateTo: format(to, 'yyyy-MM-dd HH:mm'),
        query: docs
      })
    })
})

exports.getHistoryLog = util.promisify((db, id, callback) => {
  db.collection('history').findOne({ _id: new mongo.ObjectID(id) }, function (
    err,
    log
  ) {
    // .toArray(function (err, docs) {
    if (err) callback(err)
    callback(null, log)
  })
})

exports.getRecentActivity = util.promisify((db, limit, callback) => {
  db.collection('history')
    .find()
    .sort({ $natural: -1 })
    .limit(limit)
    .toArray(function (err, docs) {
      if (err) callback(err)
      callback(null, {
        count: docs.length,
        documents: docs
      })
    })
})

exports.insertLog = util.promisify((db, s7log, s7obj, callback) => {
  const log = new Log(s7log, s7obj)
  // const collection = db.collection('history')
  db.collection('history').insertOne(log, function (err, result) {
    if (err) callback(err)
    callback(null, result)
  })
})

exports.getOperations = util.promisify(async (db, query, callback) => {
  console.log('getOperations', query, typeof query.dateString)
  // const day = format(parseISO(query.dateString), 'yyyy-MM-dd')
  try {
    const day = query.dateString
    const history = db.collection('history')
    const operations = await Promise.all([
      operationsDaily(day, history),
      operationsWeekly(day, history),
      operationsMontly(day, history),
      operationsYearly(day, history)
    ])
    callback(null, operations)
  } catch (err) {
    callback(err)
  }
})
