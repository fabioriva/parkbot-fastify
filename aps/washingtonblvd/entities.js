const s7def = require('./definitions')
const texts = require('./texts')
const { Alarm, AlarmGroup } = require('../../models/alarm')
const { generateBits, generateBytes } = require('../../models/plcIo')
const {
  S7_521_1BL00_0AB0,
  S7_521_1BH00_0AB0,
  S7_522_1BH01_0AB0,
  S7_522_1BL01_0AB0
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
const group2 = new AlarmGroup([], 'T2')
const group3 = new AlarmGroup([], 'T3')
const group4 = new AlarmGroup([], 'EL1')
const group5 = new AlarmGroup([], 'EL2')
const group6 = new AlarmGroup([], 'EL3')
for (let i = 0; i < 64; i++) {
  group1.alarms.push(new Alarm(i + 1, 1, false, texts.alarms1[i].label))
  group2.alarms.push(new Alarm(i + 1, 2, false, texts.alarms1[i].label))
  group3.alarms.push(new Alarm(i + 1, 3, false, texts.alarms1[i].label))
  group4.alarms.push(new Alarm(i + 1, 4, false, texts.alarms1[i].label))
  group5.alarms.push(new Alarm(i + 1, 5, false, texts.alarms1[i].label))
  group6.alarms.push(new Alarm(i + 1, 6, false, texts.alarms1[i].label))
}
exports.groups = [group1, group2, group3, group4, group5, group6]

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
const inputs2 = generateBits('E', 100, 109, texts.inputs2)
const inputs3 = generateBits('E', 200, 209, texts.inputs3)
const inputs4 = generateBits('E', 300, 309, texts.inputs4)
const inputs5 = generateBits('E', 400, 401, texts.inputs5)
const inputs6 = generateBits('E', 410, 413, texts.inputs6)
const inputs7 = generateBits('E', 500, 501, texts.inputs7)
const inputs8 = generateBits('E', 510, 513, texts.inputs8)
const inputs9 = generateBits('E', 600, 601, texts.inputs9)
const inputs10 = generateBits('E', 610, 613, texts.inputs10)
const inputs = inputs1.concat(
  inputs2,
  inputs3,
  inputs4,
  inputs5,
  inputs6,
  inputs7,
  inputs8,
  inputs9,
  inputs10
)
exports.inputs = inputs

const EB = generateBytes(inputs)
exports.EB = EB

const outputs1 = generateBits('A', 0, 3, texts.outputs1)
const outputs2 = generateBits('A', 100, 105, texts.outputs2)
const outputs3 = generateBits('A', 200, 205, texts.outputs3)
const outputs4 = generateBits('A', 300, 305, texts.outputs4)
const outputs5 = generateBits('A', 400, 401, texts.outputs5)
const outputs6 = generateBits('A', 410, 413, texts.outputs6)
const outputs7 = generateBits('A', 500, 501, texts.outputs7)
const outputs8 = generateBits('A', 510, 513, texts.outputs8)
const outputs9 = generateBits('A', 600, 601, texts.outputs9)
const outputs10 = generateBits('A', 610, 613, texts.outputs10)
const outputs = outputs1.concat(
  outputs2,
  outputs3,
  outputs4,
  outputs5,
  outputs6,
  outputs7,
  outputs8,
  outputs9,
  outputs10
)
exports.outputs = outputs

const AB = generateBytes(outputs)
exports.AB = AB

const merkers = generateBits('M', 0, 7, texts.merkers)
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
  serie: 'et200m',
  title: 'LS1',
  cards: [
    new S7_521_1BL00_0AB0(1, EB.slice(4, 8)),
    new S7_521_1BL00_0AB0(2, EB.slice(8, 12)),
    new S7_521_1BH00_0AB0(3, EB.slice(12, 14)),
    new S7_522_1BL01_0AB0(4, AB.slice(4, 8)),
    new S7_522_1BH01_0AB0(5, AB.slice(8, 10))
  ]
}

const rack3 = {
  nr: 3,
  serie: 'et200m',
  title: 'LS2',
  cards: [
    new S7_521_1BL00_0AB0(1, EB.slice(14, 18)),
    new S7_521_1BL00_0AB0(2, EB.slice(18, 22)),
    new S7_521_1BH00_0AB0(3, EB.slice(22, 24)),
    new S7_522_1BL01_0AB0(4, AB.slice(10, 14)),
    new S7_522_1BH01_0AB0(5, AB.slice(14, 16))
  ]
}

const rack4 = {
  nr: 4,
  serie: 'et200m',
  title: 'LS3',
  cards: [
    new S7_521_1BL00_0AB0(1, EB.slice(24, 28)),
    new S7_521_1BL00_0AB0(2, EB.slice(28, 32)),
    new S7_521_1BH00_0AB0(3, EB.slice(32, 34)),
    new S7_522_1BL01_0AB0(4, AB.slice(16, 20)),
    new S7_522_1BH01_0AB0(5, AB.slice(20, 22))
  ]
}

const rack5 = {
  nr: 5,
  serie: 'et200m',
  title: 'T1',
  cards: [
    new S7_521_1BH00_0AB0(1, EB.slice(34, 36)),
    new S7_522_1BH01_0AB0(2, AB.slice(22, 24))
  ]
}

const rack6 = {
  nr: 6,
  serie: 'et200m',
  title: 'KKP1',
  cards: [
    new S7_521_1BL00_0AB0(1, EB.slice(36, 40)),
    new S7_522_1BL01_0AB0(2, AB.slice(24, 28))
  ]
}

const rack7 = {
  nr: 7,
  serie: 'et200m',
  title: 'T2',
  cards: [
    new S7_521_1BH00_0AB0(1, EB.slice(40, 42)),
    new S7_522_1BH01_0AB0(2, AB.slice(28, 30))
  ]
}

const rack8 = {
  nr: 8,
  serie: 'et200m',
  title: 'KKP2',
  cards: [
    new S7_521_1BL00_0AB0(1, EB.slice(42, 46)),
    new S7_522_1BL01_0AB0(2, AB.slice(30, 34))
  ]
}

const rack9 = {
  nr: 9,
  serie: 'et200m',
  title: 'T3',
  cards: [
    new S7_521_1BH00_0AB0(1, EB.slice(46, 48)),
    new S7_522_1BH01_0AB0(2, AB.slice(34, 36))
  ]
}

const rack10 = {
  nr: 10,
  serie: 'et200m',
  title: 'KKP3',
  cards: [
    new S7_521_1BL00_0AB0(1, EB.slice(48, 52)),
    new S7_522_1BL01_0AB0(2, AB.slice(36, 40))
  ]
}

exports.racks = [
  rack1,
  rack2,
  rack3,
  rack4,
  rack5,
  rack6,
  rack7,
  rack8,
  rack9,
  rack10
]

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
const { T1 } = require('./devices/t1')

const T2 = {
  a: devices[1],
  b: positions.slice(4, 8),
  c: [
    inputs.find(b => b.addr === 'E501.3'),
    outputs.find(b => b.addr === 'A512.7'),
    outputs.find(b => b.addr === 'A512.6'),
    inputs.find(b => b.addr === 'E512.3'),
    merkers.find(b => b.addr === 'M0.3'),
    merkers.find(b => b.addr === 'M0.4')
  ],
  d: [],
  e: [
    inputs.find(b => b.addr === 'E512.0'),
    inputs.find(b => b.addr === 'E512.1'),
    inputs.find(b => b.addr === 'E512.2'),
    inputs.find(b => b.addr === 'E512.3'),
    inputs.find(b => b.addr === 'E512.4'),
    inputs.find(b => b.addr === 'E512.5'),
    inputs.find(b => b.addr === 'E512.6'),
    inputs.find(b => b.addr === 'E512.7'),
    outputs.find(b => b.addr === 'A501.1'), // T2
    outputs.find(b => b.addr === 'A511.2'), // TRA
    outputs.find(b => b.addr === 'A511.3'), // TRB
    outputs.find(b => b.addr === 'A511.4'), // KCS
    outputs.find(b => b.addr === 'A511.5'), // KCV
    outputs.find(b => b.addr === 'A511.6') // KCH
  ],
  f: []
}

const T3 = {
  a: devices[2],
  b: positions.slice(8, 12),
  c: [
    inputs.find(b => b.addr === 'E601.3'),
    outputs.find(b => b.addr === 'A612.7'),
    outputs.find(b => b.addr === 'A612.6'),
    inputs.find(b => b.addr === 'E612.3'),
    merkers.find(b => b.addr === 'M0.5'),
    merkers.find(b => b.addr === 'M0.6')
  ],
  d: [],
  e: [
    inputs.find(b => b.addr === 'E612.0'),
    inputs.find(b => b.addr === 'E612.1'),
    inputs.find(b => b.addr === 'E612.2'),
    inputs.find(b => b.addr === 'E612.3'),
    inputs.find(b => b.addr === 'E612.4'),
    inputs.find(b => b.addr === 'E612.5'),
    inputs.find(b => b.addr === 'E612.6'),
    inputs.find(b => b.addr === 'E612.7'),
    outputs.find(b => b.addr === 'A601.1'), // T2
    outputs.find(b => b.addr === 'A611.2'), // TRA
    outputs.find(b => b.addr === 'A611.3'), // TRB
    outputs.find(b => b.addr === 'A611.4'), // KCS
    outputs.find(b => b.addr === 'A611.5'), // KCV
    outputs.find(b => b.addr === 'A611.6') // KCH
  ],
  f: []
}

const EL2 = {
  a: devices[4],
  b: positions.slice(14, 16),
  c: [
    inputs.find(b => b.addr === 'E203.3'),
    outputs.find(b => b.addr === 'A200.7'),
    outputs.find(b => b.addr === 'A200.6'),
    merkers.find(b => b.addr === 'M2.0'),
    merkers.find(b => b.addr === 'M2.1'),
    merkers.find(b => b.addr === 'M2.2')
  ],
  d: [],
  e: [],
  f: []
}

const EL3 = {
  a: devices[5],
  b: positions.slice(16, 18),
  c: [
    inputs.find(b => b.addr === 'E303.3'),
    outputs.find(b => b.addr === 'A300.7'),
    outputs.find(b => b.addr === 'A300.6'),
    merkers.find(b => b.addr === 'M3.0'),
    merkers.find(b => b.addr === 'M3.1'),
    merkers.find(b => b.addr === 'M3.2')
  ],
  d: [],
  e: [],
  f: []
}

exports.overview = {
  devices: [T1, T2, T3, EL1, EL2, EL3],
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
      stalls: stalls.slice(0, 78),
      elevators: [
        { id: 'el-1', label: 'EL1' },
        { id: 'el-2', label: 'EL2' },
        { id: 'el-3', label: 'EL3' }
      ]
    },
    {
      nr: 2,
      label: '2nd Level (P2)',
      min: 79,
      max: 144,
      stalls: stalls.slice(78, 144),
      elevators: [
        { id: 'el-1', label: 'EL1' },
        { id: 'el-2', label: 'EL2' },
        { id: 'el-3', label: 'EL3' }
      ]
    },
    {
      nr: 3,
      label: '3rd Level (P3)',
      min: 145,
      max: 213,
      stalls: stalls.slice(144, 213),
      elevators: [
        { id: 'el-1', label: 'EL1' },
        { id: 'el-2', label: 'EL2' },
        { id: 'el-3', label: 'EL3' }
      ]
    }
  ]
}
