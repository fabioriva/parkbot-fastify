const s7def = require('./definitions')
const texts = require('./texts')
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
const { Alarm, AlarmGroup } = require('../../models/alarm')

/**
 * Alarms.
 */

const group1 = new AlarmGroup([], 'SH1')
const group2 = new AlarmGroup([], 'SH2')
const group3 = new AlarmGroup([], 'EL1')
const group4 = new AlarmGroup([], 'EL2')
for (let i = 0; i < 64; i++) {
  group1.alarms.push(new Alarm(i + 1, 1, false, texts.alarms1[i].label))
  group2.alarms.push(new Alarm(i + 1, 2, false, texts.alarms1[i].label))
  group3.alarms.push(new Alarm(i + 1, 3, false, texts.alarms1[i].label))
  group4.alarms.push(new Alarm(i + 1, 4, false, texts.alarms1[i].label))
}
exports.groups = [group1, group2, group3, group4]

/**
 * Cards
 */
const cards = []
for (let c = 0; c < s7def.CARDS; c++) {
  cards.push(new Card(c + 1))
}
exports.cards = cards

/**
 * Stalls
 */
const stalls = []
for (let s = 0; s < s7def.STALLS; s++) {
  stalls.push(new Stall(s + 1, 0))
}
exports.stalls = stalls

/**
 * I/O
 */
const inputs1 = generateBits('E', 0, 3, texts.inputs1)
const inputs2 = generateBits('E', 100, 109, texts.inputs2)
const inputs3 = generateBits('E', 110, 112, texts.inputs3)
const inputs4 = generateBits('E', 200, 209, texts.inputs4)
const inputs5 = generateBits('E', 210, 212, texts.inputs5)
const inputs6 = generateBits('E', 4, 4, texts.inputs6)
const inputs = inputs1.concat(inputs2, inputs3, inputs4, inputs5, inputs6)

const EB = generateBytes(inputs)
exports.EB = EB

const outputs1 = generateBits('A', 0, 1, texts.outputs1)
const outputs2 = generateBits('A', 100, 105, texts.outputs2)
const outputs3 = generateBits('A', 110, 111, texts.outputs3)
const outputs4 = generateBits('A', 200, 205, texts.outputs4)
const outputs5 = generateBits('A', 210, 211, texts.outputs5)
const outputs6 = generateBits('A', 4, 4, texts.outputs6)
const outputs = outputs1.concat(
  outputs2,
  outputs3,
  outputs4,
  outputs5,
  outputs6
)

const AB = generateBytes(outputs)
exports.AB = AB

const merkers = generateBits('M', 0, 7, texts.merkers)
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
    new S7_522_1BH01_0AB0(2, AB.slice(0, 2))
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
    new S7_522_1BL01_0AB0(4, AB.slice(2, 6)),
    new S7_522_1BH01_0AB0(5, AB.slice(6, 8))
  ]
}

const rack3 = {
  nr: 3,
  serie: 'et200s',
  title: 'KKS1',
  cards: [
    new S7_131_6BF00_0BA0(1, EB[14]),
    new S7_131_6BF00_0BA0(2, EB[15]),
    new S7_131_6BF00_0BA0(3, EB[16]),
    new S7_132_6BF00_0BA0(4, AB[8]),
    new S7_132_6BF00_0BA0(5, AB[9])
  ]
}

const rack4 = {
  nr: 4,
  serie: 'et200m',
  title: 'LS2',
  cards: [
    new S7_521_1BL00_0AB0(1, EB.slice(17, 21)),
    new S7_521_1BL00_0AB0(2, EB.slice(21, 25)),
    new S7_521_1BH00_0AB0(3, EB.slice(25, 27)),
    new S7_522_1BL01_0AB0(4, AB.slice(10, 14)),
    new S7_522_1BH01_0AB0(5, AB.slice(14, 16))
  ]
}

const rack5 = {
  nr: 5,
  serie: 'et200s',
  title: 'KKS2',
  cards: [
    new S7_131_6BF00_0BA0(1, EB[27]),
    new S7_131_6BF00_0BA0(2, EB[28]),
    new S7_131_6BF00_0BA0(3, EB[29]),
    new S7_132_6BF00_0BA0(4, AB[16]),
    new S7_132_6BF00_0BA0(5, AB[17])
  ]
}

const rack6 = {
  nr: 6,
  serie: 'et200s',
  title: 'ACCESS',
  cards: [new S7_131_6BF00_0BA0(1, EB[30]), new S7_132_6BF00_0BA0(5, AB[18])]
}

exports.racks = [rack1, rack2, rack3, rack4, rack5, rack6]

/**
 * System
 */
const devices = []
for (let i = 0; i < s7def.DEVICES; i++) {
  devices.push(new Device(i + 1, texts.devices[i]))
}
exports.devices = devices

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

const SH1 = {
  a: devices[0],
  b: positions.slice(0, 3),
  c: [
    inputs.find(b => b.addr === 'E103.3'),
    outputs.find(b => b.addr === 'A100.7'),
    outputs.find(b => b.addr === 'A100.6'),
    merkers.find(b => b.addr === 'M0.0'),
    merkers.find(b => b.addr === 'M0.1'),
    merkers.find(b => b.addr === 'M0.2')
  ],
  d: [],
  e: [
    inputs.find(b => b.addr === 'E110.0'),
    inputs.find(b => b.addr === 'E110.1'),
    inputs.find(b => b.addr === 'E110.2'),
    inputs.find(b => b.addr === 'E110.3'),
    inputs.find(b => b.addr === 'E110.4'),
    inputs.find(b => b.addr === 'E110.5'),
    inputs.find(b => b.addr === 'E110.6'),
    inputs.find(b => b.addr === 'E110.7'),
    outputs.find(b => b.addr === 'A110.1'), // T2
    outputs.find(b => b.addr === 'A110.2'), // TRA
    outputs.find(b => b.addr === 'A110.3'), // TRB
    outputs.find(b => b.addr === 'A111.2'), // KCS
    outputs.find(b => b.addr === 'A111.3'), // KCV
    outputs.find(b => b.addr === 'A111.4') // KCH
  ]
}

const SH2 = {
  a: devices[1],
  b: positions.slice(3, 6),
  c: [
    inputs.find(b => b.addr === 'E203.3'),
    outputs.find(b => b.addr === 'A200.7'),
    outputs.find(b => b.addr === 'A200.6'),
    merkers.find(b => b.addr === 'M0.3'),
    merkers.find(b => b.addr === 'M0.4'),
    merkers.find(b => b.addr === 'M0.5')
  ],
  d: [],
  e: [
    inputs.find(b => b.addr === 'E210.0'),
    inputs.find(b => b.addr === 'E210.1'),
    inputs.find(b => b.addr === 'E210.2'),
    inputs.find(b => b.addr === 'E210.3'),
    inputs.find(b => b.addr === 'E210.4'),
    inputs.find(b => b.addr === 'E210.5'),
    inputs.find(b => b.addr === 'E210.6'),
    inputs.find(b => b.addr === 'E210.7'),
    outputs.find(b => b.addr === 'A210.1'), // T2
    outputs.find(b => b.addr === 'A210.2'), // TRA
    outputs.find(b => b.addr === 'A210.3'), // TRB
    outputs.find(b => b.addr === 'A211.2'), // KCS
    outputs.find(b => b.addr === 'A211.3'), // KCV
    outputs.find(b => b.addr === 'A211.4') // KCH
  ]
}

const EL1 = {
  a: devices[2],
  b: positions.slice(6, 7),
  c: [
    inputs.find(b => b.addr === 'E103.3'),
    outputs.find(b => b.addr === 'A100.7'),
    outputs.find(b => b.addr === 'A100.6'),
    merkers.find(b => b.addr === 'M1.0'),
    merkers.find(b => b.addr === 'M1.1'),
    merkers.find(b => b.addr === 'M1.2')
  ],
  d: [
    new Action(
      merkers.find(b => b.addr === 'M3.0'),
      {},
      'action-entry'
    ),
    new Action(
      merkers.find(b => b.addr === 'M4.0'),
      {},
      'action-rollback'
    )
  ],
  e: []
}

const EL2 = {
  a: devices[3],
  b: positions.slice(7, 8),
  c: [
    inputs.find(b => b.addr === 'E203.3'),
    outputs.find(b => b.addr === 'A200.7'),
    outputs.find(b => b.addr === 'A200.6'),
    merkers.find(b => b.addr === 'M1.3'),
    merkers.find(b => b.addr === 'M1.4'),
    merkers.find(b => b.addr === 'M1.5')
  ],
  d: [
    new Action(
      merkers.find(b => b.addr === 'M3.1'),
      {},
      'action-entry'
    ),
    new Action(
      merkers.find(b => b.addr === 'M4.1'),
      {},
      'action-rollback'
    )
  ],
  e: []
}

exports.overview = {
  devices: [SH1, SH2, EL1, EL2],
  exitQueue: {
    queueList: exitQueue,
    exitButton: new Action(
      merkers.find(b => b.addr === 'M3.0'),
      s7def.REQ_0,
      'action-exit'
    )
  }
}

/**
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
      label: 'Level -1',
      min: 1,
      max: 71,
      stalls: stalls.slice(0, 71),
      elevators: [
        { id: 'el-1', label: 'EL1' },
        { id: 'el-2', label: 'EL2' }
      ]
    }
  ]
}
