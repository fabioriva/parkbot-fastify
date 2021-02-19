const s7def = require('./definitions')
const texts = require('./texts')
const { Alarm, AlarmGroup } = require('../../models/alarm')
const { generateBits, generateBytes } = require('../../models/plcIo')
const {
  S7_521_1BL00_0AB0,
  S7_521_1BH00_0AB0,
  S7_522_1BH01_0AB0,
  S7_522_1BL01_0AB0,
  S7_131_6BF00_0BA0,
  S7_132_6BF00_0BA0
} = require('../../models/plcModules')
const Card = require('../../models/card')
const Stall = require('../../models/stall')
const Action = require('../../models/action')
const Device = require('../../models/device')
const Mode = require('../../models/mode')
const Operation = require('../../models/operation')
const Position = require('../../models/position')
const Queue = require('../../models/queue')

/**
 * Alarms.
 */

const group1 = new AlarmGroup([], 'T1')
const group2 = new AlarmGroup([], 'EL1')
const group3 = new AlarmGroup([], 'EL2')
for (let i = 0; i < 64; i++) {
  group1.alarms.push(new Alarm(i + 1, 1, false, texts.alarms1[i].label))
  group2.alarms.push(new Alarm(i + 1, 2, false, texts.alarms1[i].label))
  group3.alarms.push(new Alarm(i + 1, 3, false, texts.alarms1[i].label))
}
exports.groups = [group1, group2, group3]

/*
 * Cards
 */
const cards = []
for (let c = 0; c < s7def.CARDS; c++) {
  cards.push(new Card(c + 1))
}
exports.cards = cards

/*
 * Stalls
 */
const stalls = []
for (let s = 0; s < s7def.STALLS; s++) {
  stalls.push(new Stall(s + 1, 0))
}
exports.stalls = stalls

/*
 * I/O
 */
const inputs1 = generateBits('E', 0, 3, texts.inputs1)
const inputs2 = generateBits('E', 10, 14, texts.inputs2)
const inputs3 = generateBits('E', 100, 109, texts.inputs3)
const inputs4 = generateBits('E', 200, 209, texts.inputs4)
const inputs = inputs1.concat(inputs2, inputs3, inputs4)
exports.inputs = inputs

const EB = generateBytes(inputs)
exports.EB = EB

const outputs1 = generateBits('A', 0, 3, texts.outputs1)
const outputs2 = generateBits('A', 10, 12, texts.outputs2)
const outputs3 = generateBits('A', 100, 107, texts.outputs3)
const outputs4 = generateBits('A', 200, 207, texts.outputs4)
const outputs = outputs1.concat(outputs2, outputs3, outputs4)
exports.outputs = outputs

const AB = generateBytes(outputs)
exports.AB = AB

const merkers = generateBits('M', 0, 7, texts.merkers1)
exports.merkers = merkers

const MB = generateBytes(merkers)
exports.MB = MB

/**
 * Racks
 */

const rack1 = {
  nr: 1,
  serie: 'et200m',
  title: 'Main',
  cards: [
    new S7_521_1BL00_0AB0(1, EB.slice(0, 4)),
    new S7_522_1BL01_0AB0(2, AB.slice(0, 4))
  ]
}

const rack2 = {
  nr: 2,
  serie: 'et200s',
  title: 'KKU',
  cards: [
    new S7_131_6BF00_0BA0(1, EB[4]),
    new S7_131_6BF00_0BA0(2, EB[5]),
    new S7_131_6BF00_0BA0(3, EB[6]),
    new S7_131_6BF00_0BA0(4, EB[7]),
    new S7_131_6BF00_0BA0(5, EB[8]),
    new S7_132_6BF00_0BA0(6, AB[4]),
    new S7_132_6BF00_0BA0(7, AB[5]),
    new S7_132_6BF00_0BA0(8, AB[6])
  ]
}

const rack3 = {
  nr: 3,
  serie: 'et200m',
  title: 'LS1',
  cards: [
    new S7_521_1BL00_0AB0(1, EB.slice(9, 13)),
    new S7_521_1BL00_0AB0(2, EB.slice(13, 17)),
    new S7_521_1BH00_0AB0(3, EB.slice(17, 19)),
    new S7_522_1BL01_0AB0(4, AB.slice(7, 11)),
    new S7_522_1BH01_0AB0(5, AB.slice(11, 15))
  ]
}

const rack4 = {
  nr: 4,
  serie: 'et200m',
  title: 'LS2',
  cards: [
    new S7_521_1BL00_0AB0(1, EB.slice(19, 23)),
    new S7_521_1BL00_0AB0(2, EB.slice(23, 27)),
    new S7_521_1BH00_0AB0(3, EB.slice(27, 29)),
    new S7_522_1BL01_0AB0(4, AB.slice(15, 19)),
    new S7_522_1BH01_0AB0(5, AB.slice(19, 23))
  ]
}

exports.racks = [rack1, rack2, rack3, rack4]

/*
 * System
 */
const devices = []
for (let i = 0; i < s7def.DEVICES; i++) {
  devices.push(new Device(i + 1, texts.devices[i]))
}
exports.devices = devices

// const modes = []
// texts.modes.forEach((mode, key) => modes.push(new Mode(key, mode)))
const modes = texts.modes.map((item, key) => new Mode(key, item))
exports.modes = modes

const operations = texts.operations.map((item, key) => new Operation(key, item))
exports.operations = operations

const positions = []
for (let i = 0; i < s7def.POSITIONS; i++) {
  positions.push(new Position(texts.positions[i]))
}
exports.positions = positions

const exitQueue = []
for (let q = 0; q < s7def.QUEUE; q++) {
  exitQueue.push(new Queue(q + 1))
}
exports.exitQueue = exitQueue

const { EL1 } = require('./devices/el1')
// const { EL2 } = require('./devices/el2')
// const { T1 } = require('./devices/t1')

exports.overview = {
  devices: [EL1],
  exitQueue: {
    queueList: exitQueue,
    exitButton: new Action(
      merkers.find(b => b.addr === 'M0.0'),
      s7def.REQ_0,
      'action-exit'
    )
  }
}

/*
 * Map
 */
const TYPE_0 = [
  {
    id: 'free',
    label: 'Free',
    value: 100
  },
  {
    id: 'busy',
    label: 'Busy',
    value: 0
  },
  {
    id: 'lock',
    label: 'Locked',
    value: 0
  }
]

exports.map = {
  limits: {
    minCard: 1,
    maxCard: s7def.CARDS,
    minStall: 1,
    maxStall: s7def.STALLS
  },
  statistics: [TYPE_0],
  levels: [
    {
      nr: 1,
      label: '1st Level (P1)',
      min: 1,
      max: 78,
      stalls: stalls.slice(0, 1),
      elevators: [
        { id: 'el-1', label: 'EL1' },
        { id: 'el-2', label: 'EL2' }
      ]
    },
    {
      nr: 2,
      label: '2nd Level (P2)',
      min: 79,
      max: 144,
      stalls: stalls.slice(1, 2),
      elevators: [
        { id: 'el-1', label: 'EL1' },
        { id: 'el-2', label: 'EL2' }
      ]
    },
    {
      nr: 3,
      label: '3rd Level (P3)',
      min: 145,
      max: 213,
      stalls: stalls.slice(2, 3),
      elevators: [
        { id: 'el-1', label: 'EL1' },
        { id: 'el-2', label: 'EL2' }
      ]
    }
  ]
}
