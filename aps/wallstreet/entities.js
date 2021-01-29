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

const group1 = new AlarmGroup([], 'EVT1')
const group2 = new AlarmGroup([], 'EVT2')
const group3 = new AlarmGroup([], 'EVT3')
const group4 = new AlarmGroup([], 'IVT1')
const group5 = new AlarmGroup([], 'IVT2')
const group6 = new AlarmGroup([], 'IVT3')
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
const inputs1 = generateBits('E', 0, 5, texts.inputs1)
const inputs2 = generateBits('E', 100, 107, texts.inputs2)
const inputs3 = generateBits('E', 110, 112, texts.inputs3)
const inputs4 = generateBits('E', 200, 207, texts.inputs4)
const inputs5 = generateBits('E', 210, 212, texts.inputs5)
const inputs6 = generateBits('E', 300, 307, texts.inputs6)
const inputs7 = generateBits('E', 310, 312, texts.inputs7)
const inputs8 = generateBits('E', 400, 403, texts.inputs8)
const inputs9 = generateBits('E', 404, 405, texts.inputs9)
const inputs10 = generateBits('E', 410, 414, texts.inputs10)
const inputs11 = generateBits('E', 500, 503, texts.inputs11)
const inputs12 = generateBits('E', 504, 505, texts.inputs12)
const inputs13 = generateBits('E', 510, 514, texts.inputs13)
const inputs14 = generateBits('E', 600, 603, texts.inputs14)
const inputs15 = generateBits('E', 604, 605, texts.inputs15)
const inputs16 = generateBits('E', 610, 614, texts.inputs16)
const inputs = inputs1.concat(
  inputs2,
  inputs3,
  inputs4,
  inputs5,
  inputs6,
  inputs7,
  inputs8,
  inputs9,
  inputs10,
  inputs11,
  inputs12,
  inputs13,
  inputs14,
  inputs15,
  inputs16
)

const EB = generateBytes(inputs)
exports.EB = EB

const outputs1 = generateBits('A', 0, 5, texts.outputs1)
const outputs2 = generateBits('A', 100, 103, texts.outputs2)
const outputs3 = generateBits('A', 110, 111, texts.outputs3)
const outputs4 = generateBits('A', 200, 203, texts.outputs4)
const outputs5 = generateBits('A', 210, 211, texts.outputs5)
const outputs6 = generateBits('A', 300, 303, texts.outputs6)
const outputs7 = generateBits('A', 310, 311, texts.outputs7)
const outputs8 = generateBits('A', 400, 401, texts.outputs8)
const outputs9 = generateBits('A', 404, 404, texts.outputs9)
const outputs10 = generateBits('A', 410, 412, texts.outputs10)
const outputs11 = generateBits('A', 500, 501, texts.outputs11)
const outputs12 = generateBits('A', 504, 504, texts.outputs12)
const outputs13 = generateBits('A', 510, 512, texts.outputs13)
const outputs14 = generateBits('A', 600, 601, texts.outputs14)
const outputs15 = generateBits('A', 604, 604, texts.outputs15)
const outputs16 = generateBits('A', 610, 612, texts.outputs16)
const outputs = outputs1.concat(
  outputs2,
  outputs3,
  outputs4,
  outputs5,
  outputs6,
  outputs7,
  outputs8,
  outputs9,
  outputs10,
  outputs11,
  outputs12,
  outputs13,
  outputs14,
  outputs15,
  outputs16
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
    new S7_521_1BH00_0AB0(2, EB.slice(4, 6)),
    new S7_522_1BL01_0AB0(3, AB.slice(0, 4)),
    new S7_522_1BH01_0AB0(4, AB.slice(4, 6))
  ]
}

const rack2 = {
  nr: 2,
  serie: 'et200m',
  title: 'LS1',
  cards: [
    new S7_521_1BL00_0AB0(1, EB.slice(6, 10)),
    new S7_521_1BL00_0AB0(2, EB.slice(10, 14)),
    new S7_522_1BL01_0AB0(3, AB.slice(6, 10))
  ]
}

const rack3 = {
  nr: 3,
  serie: 'et200s',
  title: 'KKM1',
  cards: [
    new S7_131_6BF00_0BA0(1, EB[14]),
    new S7_131_6BF00_0BA0(2, EB[15]),
    new S7_131_6BF00_0BA0(3, EB[16]),
    new S7_132_6BF00_0BA0(4, AB[10]),
    new S7_132_6BF00_0BA0(5, AB[11])
  ]
}

const rack4 = {
  nr: 4,
  serie: 'et200m',
  title: 'LS2',
  cards: [
    new S7_521_1BL00_0AB0(1, EB.slice(17, 21)),
    new S7_521_1BL00_0AB0(2, EB.slice(21, 25)),
    new S7_522_1BL01_0AB0(3, AB.slice(12, 16))
  ]
}

const rack5 = {
  nr: 5,
  serie: 'et200s',
  title: 'KKM2',
  cards: [
    new S7_131_6BF00_0BA0(1, EB[25]),
    new S7_131_6BF00_0BA0(2, EB[26]),
    new S7_131_6BF00_0BA0(3, EB[27]),
    new S7_132_6BF00_0BA0(4, AB[16]),
    new S7_132_6BF00_0BA0(5, AB[17])
  ]
}

const rack6 = {
  nr: 6,
  serie: 'et200m',
  title: 'LS3',
  cards: [
    new S7_521_1BL00_0AB0(1, EB.slice(28, 32)),
    new S7_521_1BL00_0AB0(2, EB.slice(32, 36)),
    new S7_522_1BL01_0AB0(3, AB.slice(18, 22))
  ]
}

const rack7 = {
  nr: 7,
  serie: 'et200s',
  title: 'KKM3',
  cards: [
    new S7_131_6BF00_0BA0(1, EB[36]),
    new S7_131_6BF00_0BA0(2, EB[37]),
    new S7_131_6BF00_0BA0(3, EB[38]),
    new S7_132_6BF00_0BA0(4, AB[22]),
    new S7_132_6BF00_0BA0(5, AB[23])
  ]
}

const rack8 = {
  nr: 8,
  serie: 'et200m',
  title: 'LS4',
  cards: [
    new S7_521_1BL00_0AB0(1, EB.slice(39, 43)),
    new S7_522_1BH01_0AB0(2, AB.slice(24, 26))
  ]
}

const rack9 = {
  nr: 9,
  serie: 'et200s',
  title: 'KKP4',
  cards: [
    new S7_131_6BF00_0BA0(1, EB[43]),
    new S7_131_6BF00_0BA0(2, EB[44]),
    new S7_132_6BF00_0BA0(3, AB[26])
  ]
}

const rack10 = {
  nr: 10,
  serie: 'et200s',
  title: 'SH4',
  cards: [
    new S7_131_6BF00_0BA0(1, EB[45]),
    new S7_131_6BF00_0BA0(2, EB[46]),
    new S7_131_6BF00_0BA0(3, EB[47]),
    new S7_131_6BF00_0BA0(4, EB[48]),
    new S7_131_6BF00_0BA0(5, EB[49]),
    new S7_132_6BF00_0BA0(1, AB[27]),
    new S7_132_6BF00_0BA0(2, AB[28]),
    new S7_132_6BF00_0BA0(3, AB[29])
  ]
}

const rack11 = {
  nr: 11,
  serie: 'et200m',
  title: 'LS5',
  cards: [
    new S7_521_1BL00_0AB0(1, EB.slice(50, 54)),
    new S7_522_1BH01_0AB0(2, AB.slice(30, 32))
  ]
}

const rack12 = {
  nr: 12,
  serie: 'et200s',
  title: 'KKP5',
  cards: [
    new S7_131_6BF00_0BA0(1, EB[54]),
    new S7_131_6BF00_0BA0(2, EB[55]),
    new S7_132_6BF00_0BA0(3, AB[32])
  ]
}

const rack13 = {
  nr: 13,
  serie: 'et200s',
  title: 'SH5',
  cards: [
    new S7_131_6BF00_0BA0(1, EB[56]),
    new S7_131_6BF00_0BA0(2, EB[57]),
    new S7_131_6BF00_0BA0(3, EB[58]),
    new S7_131_6BF00_0BA0(4, EB[59]),
    new S7_131_6BF00_0BA0(5, EB[60]),
    new S7_132_6BF00_0BA0(1, AB[33]),
    new S7_132_6BF00_0BA0(2, AB[34]),
    new S7_132_6BF00_0BA0(3, AB[35])
  ]
}

const rack14 = {
  nr: 14,
  serie: 'et200m',
  title: 'LS6',
  cards: [
    new S7_521_1BL00_0AB0(1, EB.slice(61, 65)),
    new S7_522_1BH01_0AB0(2, AB.slice(36, 38))
  ]
}

const rack15 = {
  nr: 15,
  serie: 'et200s',
  title: 'KKP6',
  cards: [
    new S7_131_6BF00_0BA0(1, EB[65]),
    new S7_131_6BF00_0BA0(2, EB[66]),
    new S7_132_6BF00_0BA0(3, AB[38])
  ]
}

const rack16 = {
  nr: 16,
  serie: 'et200s',
  title: 'SH6',
  cards: [
    new S7_131_6BF00_0BA0(1, EB[67]),
    new S7_131_6BF00_0BA0(2, EB[68]),
    new S7_131_6BF00_0BA0(3, EB[69]),
    new S7_131_6BF00_0BA0(4, EB[70]),
    new S7_131_6BF00_0BA0(5, EB[71]),
    new S7_132_6BF00_0BA0(1, AB[39]),
    new S7_132_6BF00_0BA0(2, AB[40]),
    new S7_132_6BF00_0BA0(3, AB[41])
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
  rack10,
  rack11,
  rack12,
  rack13,
  rack14,
  rack15,
  rack16
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

const EVT1 = {
  a: devices[0],
  b: positions.slice(0, 2),
  c: [
    inputs.find(b => b.addr === 'E103.3'),
    outputs.find(b => b.addr === 'A100.7'),
    outputs.find(b => b.addr === 'A100.6'),
    merkers.find(b => b.addr === 'E112.3'),
    merkers.find(b => b.addr === 'M0.1'),
    merkers.find(b => b.addr === 'M0.2')
  ],
  d: [
    new Action(
      merkers.find(b => b.addr === 'M3.0'),
      s7def.REQ_1,
      'action-entry'
    ),
    new Action(
      merkers.find(b => b.addr === 'M3.4'),
      s7def.REQ_2,
      'action-rollback'
    )
  ],
  e: [
    inputs.find(b => b.addr === 'E112.0'),
    inputs.find(b => b.addr === 'E112.1'),
    inputs.find(b => b.addr === 'E112.2'),
    inputs.find(b => b.addr === 'E112.3'),
    inputs.find(b => b.addr === 'E112.4'),
    inputs.find(b => b.addr === 'E112.5'),
    inputs.find(b => b.addr === 'E112.6'),
    inputs.find(b => b.addr === 'E112.7'),
    outputs.find(b => b.addr === 'A100.0'), // T2
    outputs.find(b => b.addr === 'A110.2'), // TRA
    outputs.find(b => b.addr === 'A110.3'), // TRB
    outputs.find(b => b.addr === 'A110.4'), // KCS
    outputs.find(b => b.addr === 'A110.5'), // KCV
    outputs.find(b => b.addr === 'A110.6') // KCH
  ]
}

const EVT2 = {
  a: devices[1],
  b: positions.slice(2, 4),
  c: [
    inputs.find(b => b.addr === 'E203.3'),
    outputs.find(b => b.addr === 'A200.7'),
    outputs.find(b => b.addr === 'A200.6'),
    merkers.find(b => b.addr === 'E212.3'),
    merkers.find(b => b.addr === 'M0.2'),
    merkers.find(b => b.addr === 'M0.3')
  ],
  d: [
    new Action(
      merkers.find(b => b.addr === 'M3.1'),
      s7def.REQ_1,
      'action-entry'
    ),
    new Action(
      merkers.find(b => b.addr === 'M3.5'),
      s7def.REQ_2,
      'action-rollback'
    )
  ],
  e: [
    inputs.find(b => b.addr === 'E212.0'),
    inputs.find(b => b.addr === 'E212.1'),
    inputs.find(b => b.addr === 'E212.2'),
    inputs.find(b => b.addr === 'E212.3'),
    inputs.find(b => b.addr === 'E212.4'),
    inputs.find(b => b.addr === 'E212.5'),
    inputs.find(b => b.addr === 'E212.6'),
    inputs.find(b => b.addr === 'E212.7'),
    outputs.find(b => b.addr === 'A200.0'), // T2
    outputs.find(b => b.addr === 'A210.2'), // TRA
    outputs.find(b => b.addr === 'A210.3'), // TRB
    outputs.find(b => b.addr === 'A210.4'), // KCS
    outputs.find(b => b.addr === 'A210.5'), // KCV
    outputs.find(b => b.addr === 'A210.6') // KCH
  ]
}

const EVT3 = {
  a: devices[2],
  b: positions.slice(4, 6),
  c: [
    inputs.find(b => b.addr === 'E303.3'),
    outputs.find(b => b.addr === 'A300.7'),
    outputs.find(b => b.addr === 'A300.6'),
    merkers.find(b => b.addr === 'E312.3'),
    merkers.find(b => b.addr === 'M0.4'),
    merkers.find(b => b.addr === 'M0.5')
  ],
  d: [
    new Action(
      merkers.find(b => b.addr === 'M3.2'),
      s7def.REQ_1,
      'action-entry'
    ),
    new Action(
      merkers.find(b => b.addr === 'M3.6'),
      s7def.REQ_2,
      'action-rollback'
    )
  ],
  e: [
    inputs.find(b => b.addr === 'E312.0'),
    inputs.find(b => b.addr === 'E312.1'),
    inputs.find(b => b.addr === 'E312.2'),
    inputs.find(b => b.addr === 'E312.3'),
    inputs.find(b => b.addr === 'E312.4'),
    inputs.find(b => b.addr === 'E312.5'),
    inputs.find(b => b.addr === 'E312.6'),
    inputs.find(b => b.addr === 'E312.7'),
    outputs.find(b => b.addr === 'A300.0'), // T2
    outputs.find(b => b.addr === 'A310.2'), // TRA
    outputs.find(b => b.addr === 'A310.3'), // TRB
    outputs.find(b => b.addr === 'A310.4'), // KCS
    outputs.find(b => b.addr === 'A310.5'), // KCV
    outputs.find(b => b.addr === 'A310.6') // KCH
  ]
}

const IVT1 = {
  a: devices[3],
  b: positions.slice(6, 10),
  c: [
    inputs.find(b => b.addr === 'E401.3'),
    outputs.find(b => b.addr === 'A400.7'),
    outputs.find(b => b.addr === 'A400.6'),
    merkers.find(b => b.addr === 'E412.3'),
    merkers.find(b => b.addr === 'M1.0'),
    merkers.find(b => b.addr === 'M1.1')
  ],
  d: [],
  e: [
    inputs.find(b => b.addr === 'E412.0'),
    inputs.find(b => b.addr === 'E412.1'),
    inputs.find(b => b.addr === 'E412.2'),
    inputs.find(b => b.addr === 'E412.3'),
    inputs.find(b => b.addr === 'E412.4'),
    inputs.find(b => b.addr === 'E412.5'),
    inputs.find(b => b.addr === 'E412.6'),
    inputs.find(b => b.addr === 'E412.7'),
    outputs.find(b => b.addr === 'A411.1'), // T2
    outputs.find(b => b.addr === 'A411.2'), // TRA
    outputs.find(b => b.addr === 'A411.3'), // TRB
    outputs.find(b => b.addr === 'A411.4'), // KCS
    outputs.find(b => b.addr === 'A411.5'), // KCV
    outputs.find(b => b.addr === 'A411.6') // KCH
  ]
}

const IVT2 = {
  a: devices[4],
  b: positions.slice(10, 14),
  c: [
    inputs.find(b => b.addr === 'E501.3'),
    outputs.find(b => b.addr === 'A500.7'),
    outputs.find(b => b.addr === 'A500.6'),
    merkers.find(b => b.addr === 'E512.3'),
    merkers.find(b => b.addr === 'M1.2'),
    merkers.find(b => b.addr === 'M1.3')
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
    outputs.find(b => b.addr === 'A511.1'), // T2
    outputs.find(b => b.addr === 'A511.2'), // TRA
    outputs.find(b => b.addr === 'A511.3'), // TRB
    outputs.find(b => b.addr === 'A511.4'), // KCS
    outputs.find(b => b.addr === 'A511.5'), // KCV
    outputs.find(b => b.addr === 'A511.6') // KCH
  ]
}

const IVT3 = {
  a: devices[5],
  b: positions.slice(14, 18),
  c: [
    inputs.find(b => b.addr === 'E601.3'),
    outputs.find(b => b.addr === 'A600.7'),
    outputs.find(b => b.addr === 'A600.6'),
    merkers.find(b => b.addr === 'E612.3'),
    merkers.find(b => b.addr === 'M1.4'),
    merkers.find(b => b.addr === 'M1.5')
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
    outputs.find(b => b.addr === 'A611.1'), // T2
    outputs.find(b => b.addr === 'A611.2'), // TRA
    outputs.find(b => b.addr === 'A611.3'), // TRB
    outputs.find(b => b.addr === 'A611.4'), // KCS
    outputs.find(b => b.addr === 'A611.5'), // KCV
    outputs.find(b => b.addr === 'A611.6') // KCH
  ]
}

exports.overview = {
  devices: [EVT1, EVT2, EVT3, IVT1, IVT2, IVT3],
  exitQueue: {
    queueList: exitQueue,
    exitButton: new Action(
      merkers.find(b => b.addr === 'M3.0'),
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
      max: 38,
      stalls: stalls.slice(0, 38),
      elevators: [
        { id: 'el-4', label: 'IVT4' },
        { id: 'el-5', label: 'IVT5' },
        { id: 'el-6', label: 'IVT6' }
      ]
    },
    {
      nr: 2,
      label: '2nd Level (P2)',
      min: 39,
      max: 76,
      stalls: stalls.slice(38, 76),
      elevators: [
        { id: 'el-4', label: 'IVT4' },
        { id: 'el-5', label: 'IVT5' },
        { id: 'el-6', label: 'IVT6' }
      ]
    },
    {
      nr: 3,
      label: '3rd Level (P3)',
      min: 77,
      max: 114,
      stalls: stalls.slice(76, 114),
      elevators: [
        { id: 'el-4', label: 'IVT4' },
        { id: 'el-5', label: 'IVT5' },
        { id: 'el-6', label: 'IVT6' }
      ]
    },
    {
      nr: 4,
      label: '4th Level (P4)',
      min: 115,
      max: 152,
      stalls: stalls.slice(114, 152),
      elevators: [
        { id: 'el-4', label: 'IVT4' },
        { id: 'el-5', label: 'IVT5' },
        { id: 'el-6', label: 'IVT6' }
      ]
    },
    {
      nr: 5,
      label: '5th Level (P5)',
      min: 153,
      max: 190,
      stalls: stalls.slice(152, 190),
      elevators: [
        { id: 'el-4', label: 'IVT4' },
        { id: 'el-5', label: 'IVT5' },
        { id: 'el-6', label: 'IVT6' }
      ]
    },
    {
      nr: 6,
      label: '6th Level (P6)',
      min: 191,
      max: 227,
      stalls: stalls.slice(190, 227),
      elevators: [
        { id: 'el-4', label: 'IVT4' },
        { id: 'el-5', label: 'IVT5' },
        { id: 'el-6', label: 'IVT6' }
      ]
    },
    {
      nr: 7,
      label: '7th Level (P7)',
      min: 228,
      max: 255,
      stalls: stalls.slice(227, 255),
      elevators: [
        { id: 'el-4', label: 'IVT4' },
        { id: 'el-5', label: 'IVT5' },
        { id: 'el-6', label: 'IVT6' }
      ]
    },
    {
      nr: 8,
      label: '8th Level (P8)',
      min: 256,
      max: 276,
      stalls: stalls.slice(255, 276),
      elevators: [
        { id: 'el-4', label: 'IVT4' },
        { id: 'el-5', label: 'IVT5' },
        { id: 'el-6', label: 'IVT6' }
      ]
    }
  ]
}