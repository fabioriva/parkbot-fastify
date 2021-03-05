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

const group1 = new AlarmGroup([], 'ELA')
const group2 = new AlarmGroup([], 'ELB')
const group3 = new AlarmGroup([], 'TT')
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
const inputs2 = generateBits('E', 10, 17, texts.inputs2)
const inputs3 = generateBits('E', 20, 27, texts.inputs3)
const inputs4 = generateBits('E', 30, 31, texts.inputs4)
const inputs5 = generateBits('E', 40, 43, texts.inputs5)
const inputs = inputs1.concat(inputs2, inputs3, inputs4, inputs5)
exports.inputs = inputs

const EB = generateBytes(inputs)
exports.EB = EB

const outputs1 = generateBits('A', 0, 1, texts.outputs1)
const outputs2 = generateBits('A', 10, 15, texts.outputs2)
const outputs3 = generateBits('A', 20, 25, texts.outputs3)
const outputs4 = generateBits('A', 30, 31, texts.outputs4)
const outputs5 = generateBits('A', 40, 42, texts.outputs5)
const outputs = outputs1.concat(outputs2, outputs3, outputs4, outputs5)
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
  title: 'ELA',
  cards: [
    new S7_521_1BL00_0AB0(1, EB.slice(0, 4)),
    new S7_522_1BH01_0AB0(2, AB.slice(0, 2)),
    new S7_521_1BL00_0AB0(3, EB.slice(4, 8)),
    new S7_521_1BL00_0AB0(4, EB.slice(8, 12)),
    new S7_522_1BL01_0AB0(5, AB.slice(2, 6)),
    new S7_522_1BH01_0AB0(6, AB.slice(6, 8))
  ]
}

const rack2 = {
  nr: 2,
  serie: 'et200m',
  title: 'ELB',
  cards: [
    new S7_521_1BL00_0AB0(1, EB.slice(12, 16)),
    new S7_521_1BL00_0AB0(2, EB.slice(16, 20)),
    new S7_522_1BL01_0AB0(3, AB.slice(8, 12)),
    new S7_522_1BH01_0AB0(4, AB.slice(12, 14))
  ]
}

const rack3 = {
  nr: 3,
  serie: 'et200m',
  title: 'TT',
  cards: [
    new S7_521_1BH00_0AB0(1, EB.slice(20, 22)),
    new S7_522_1BH01_0AB0(2, AB.slice(14, 16))
  ]
}

const rack4 = {
  nr: 4,
  serie: 'et200s',
  title: 'KKP',
  cards: [
    new S7_131_6BF00_0BA0(1, EB[22]),
    new S7_131_6BF00_0BA0(2, EB[23]),
    new S7_131_6BF00_0BA0(3, EB[24]),
    new S7_131_6BF00_0BA0(4, EB[25]),
    new S7_132_6BF00_0BA0(5, AB[16]),
    new S7_132_6BF00_0BA0(6, AB[17]),
    new S7_132_6BF00_0BA0(7, AB[18])
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

const { ELA } = require('./devices/a')
console.log(ELA)

const ELB = {
  a: devices[1],
  b: [],
  c: [
    inputs.find(b => b.addr === 'E2.3'),
    outputs.find(b => b.addr === 'A22.7'),
    outputs.find(b => b.addr === 'A22.6')
  ],
  d: [],
  e: [],
  f: []
}

const TT = {
  a: devices[2],
  b: positions.slice(0, 4),
  c: [
    inputs.find(b => b.addr === 'E31.3'),
    outputs.find(b => b.addr === 'A42.7'),
    outputs.find(b => b.addr === 'A42.6')
  ],
  d: [],
  e: [
    inputs.find(b => b.addr === 'E42.0'),
    inputs.find(b => b.addr === 'E42.1'),
    inputs.find(b => b.addr === 'E42.2'),
    inputs.find(b => b.addr === 'E42.3'),
    inputs.find(b => b.addr === 'E42.4'),
    inputs.find(b => b.addr === 'E42.5'),
    inputs.find(b => b.addr === 'E42.6'),
    inputs.find(b => b.addr === 'E42.7'),
    outputs.find(b => b.addr === 'A31.1'),
    outputs.find(b => b.addr === 'A41.2'),
    outputs.find(b => b.addr === 'A41.3'),
    outputs.find(b => b.addr === 'A41.4'),
    outputs.find(b => b.addr === 'A41.5'),
    outputs.find(b => b.addr === 'A41.6')
  ]
}

exports.overview = {
  devices: [ELA, ELB, TT],
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
      label: 'Piano 1',
      min: 1,
      max: 31,
      stalls: stalls.slice(0, 31)
    },
    {
      nr: 2,
      label: 'Piano 2',
      min: 32,
      max: 62,
      stalls: stalls.slice(31, 62)
    },
    {
      nr: 3,
      label: 'Piano 3',
      min: 63,
      max: 93,
      stalls: stalls.slice(62, 93)
    },
    {
      nr: 4,
      label: 'Piano 4',
      min: 95,
      max: 124,
      stalls: stalls.slice(93, 124)
    },
    {
      nr: 5,
      label: 'Piano 5',
      min: 125,
      max: 149,
      stalls: stalls.slice(124, 149),
      elevators: [
        { id: 'el-a', label: 'A' },
        { id: 'el-b', label: 'B' }
      ]
    }
  ]
}
