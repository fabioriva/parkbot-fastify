const {
  format,
  parseISO,
  endOfDay,
  endOfWeek,
  endOfMonth,
  endOfYear,
  startOfDay,
  startOfWeek,
  startOfMonth,
  startOfYear,
  subWeeks,
  subMonths,
  subYears
} = require('date-fns')
const util = require('util')

// add zero: 2013-02-08  # A calendar date part
const addZero = n => (n <= 9 ? '0' + n.toString() : n.toString())

exports.operationsDaily = util.promisify((daystr, history, callback) => {
  console.log('(1) daily', typeof daystr, daystr)
  const day = parseISO(daystr)
  console.log('(2) daily', typeof day, day)
  const start = startOfDay(day)
  console.log('(3) daily', typeof start, start)
  const end = endOfDay(day)
  console.log('(4) daily', typeof end, end)

  const pipeline = [
    {
      $match: {
        $and: [
          { date: { $gte: start, $lt: end } },
          { $or: [{ 'operation.id': 5 }, { 'operation.id': 6 }] }
        ]
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$date' },
          month: { $month: '$date' },
          day: { $dayOfMonth: '$date' },
          hour: { $hour: '$date' }
        },
        total: { $sum: 1 },
        entries: { $sum: { $cond: [{ $eq: ['$operation.id', 5] }, 1, 0] } },
        exits: { $sum: { $cond: [{ $eq: ['$operation.id', 6] }, 1, 0] } }
      }
    },
    { $sort: { _id: 1 } } // order by date ascending
  ]
  history.aggregate(pipeline).toArray(function (err, docs) {
    if (err) callback(err)
    console.log('daily', docs)
    const statistics = docs.map(e => {
      // const date = `${e._id.year}-${addZero(e._id.month)}-${addZero(
      //   e._id.day
      // )} ${addZero(e._id.hour)}`
      const date = addZero(e._id.hour)
      return {
        name: date, // format(new Date(date), 'hh a'),
        entries: e.entries,
        exits: e.exits,
        total: e.total
      }
    })
    const operations = {
      data: statistics,
      label: daystr, // format(startOfDay(day), 'yyyy-MM-dd'),
      title: 'Daily operations'
    }
    callback(null, operations)
  })
})

exports.operationsWeekly = util.promisify((daystr, history, callback) => {
  const day = parseISO(daystr)
  const start = startOfWeek(subWeeks(day, 1), { weekStartsOn: 1 })
  const end = endOfWeek(subWeeks(day, 1), { weekStartsOn: 1 })

  const pipeline = [
    {
      $match: {
        $and: [
          { date: { $gte: start, $lt: end } },
          { $or: [{ 'operation.id': 5 }, { 'operation.id': 6 }] }
        ]
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$date' },
          month: { $month: '$date' },
          day: { $dayOfMonth: '$date' }
        },
        total: { $sum: 1 },
        entries: { $sum: { $cond: [{ $eq: ['$operation.id', 5] }, 1, 0] } },
        exits: { $sum: { $cond: [{ $eq: ['$operation.id', 6] }, 1, 0] } }
      }
    },
    { $sort: { _id: 1 } }
  ]
  history.aggregate(pipeline).toArray(function (err, docs) {
    if (err) return callback(err)
    console.log('weekly', docs)
    const statistics = docs.map(e => {
      // const date = `${e._id.year}-${addZero(e._id.month)}-${addZero(e._id.day)}`
      const date = addZero(e._id.day)
      return {
        name: date, // dayjs(date).isValid() ? `${dayjs(date).format('ddd')}` : null,
        entries: e.entries,
        exits: e.exits,
        total: e.total
      }
    })
    const operations = {
      data: statistics, // prepareData(statistics), // statistics,
      label: format(start, 'yyyy-MM-dd') + ' ' + format(end, 'yyyy-MM-dd'),
      // label: `${dayjs(start)
      //   .startOf('day')
      //   .format('YYYY-MM-DD')} - ${dayjs(end)
      //   .startOf('day')
      //   .format('YYYY-MM-DD')}`,
      title: 'Weekly operations'
    }
    callback(null, operations)
  })
})

exports.operationsMontly = util.promisify((daystr, history, callback) => {
  const day = parseISO(daystr)
  const start = startOfMonth(subMonths(day, 1))
  const end = endOfMonth(subMonths(day, 1))

  const pipeline = [
    {
      $match: {
        $and: [
          { date: { $gte: start, $lt: end } },
          { $or: [{ 'operation.id': 5 }, { 'operation.id': 6 }] }
        ]
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$date' },
          month: { $month: '$date' },
          day: { $dayOfMonth: '$date' }
        },
        total: { $sum: 1 },
        entries: { $sum: { $cond: [{ $eq: ['$operation.id', 5] }, 1, 0] } },
        exits: { $sum: { $cond: [{ $eq: ['$operation.id', 6] }, 1, 0] } }
      }
    },
    { $sort: { _id: 1 } } // order by date ascending
  ]
  history.aggregate(pipeline).toArray(function (err, docs) {
    if (err) return callback(err)
    console.log('montly', day, start, end, docs)
    const statistics = docs.map(e => {
      return {
        name: addZero(e._id.day), // `${e._id.month}-${e._id.day}`, // `${e._id.year}-${e._id.month}-${e._id.day}`,
        entries: e.entries,
        exits: e.exits,
        total: e.total
      }
    })
    const operations = {
      data: statistics, // prepareData(statistics), // statistics,
      label:
        format(startOfDay(start), 'yyyy-MM-dd') +
        ' ' +
        format(endOfDay(end), 'yyyy-MM-dd'),
      // label: `${dayjs(start).startOf('day').format('YYYY-MM-DD')} - ${dayjs(end).startOf('day').format('YYYY-MM-DD')}`,
      title: 'Monthly operations'
    }
    callback(null, operations)
  })
})

exports.operationsYearly = util.promisify((daystr, history, callback) => {
  const day = parseISO(daystr)
  const start = startOfYear(subYears(day, 1))
  const end = endOfYear(subYears(day, 1))

  const pipeline = [
    {
      $match: {
        $and: [
          { date: { $gte: start, $lt: end } },
          { $or: [{ 'operation.id': 5 }, { 'operation.id': 6 }] }
        ]
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$date' },
          month: { $month: '$date' }
        },
        total: { $sum: 1 },
        entries: { $sum: { $cond: [{ $eq: ['$operation.id', 5] }, 1, 0] } },
        exits: { $sum: { $cond: [{ $eq: ['$operation.id', 6] }, 1, 0] } }
      }
    },
    { $sort: { _id: 1 } }
  ]
  history.aggregate(pipeline).toArray(function (err, docs) {
    if (err) return callback(err)
    console.log('yearly', day, start, end, docs)
    const statistics = docs.map(e => {
      return {
        name: addZero(e._id.month), // `${e._id.year}-${e._id.month}`,
        entries: e.entries,
        exits: e.exits,
        total: e.total
      }
    })
    const operations = {
      data: statistics, // prepareData(statistics), // statistics,
      label:
        format(startOfDay(start), 'yyyy-MM-dd') +
        ' ' +
        format(endOfDay(end), 'yyyy-MM-dd'),
      // label: `${dayjs(start).startOf('day').format('YYYY-MM-DD')} - ${dayjs(end).startOf('day').format('YYYY-MM-DD')}`,
      title: 'Yearly operations'
    }
    callback(null, operations)
  })
})
