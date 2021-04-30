const s7def = require('./definitions')
const texts = require('./texts')
const { generateAlarms, AlarmGroup } = require('../../models/alarm')
const { generateBits, generateBytes } = require('../../models/plcIo')
const {
  S7_523_1BL00_0AA0,
  S7_131_6BH01_0BA0,
  S7_132_6BH01_0BA0
} = require('../../models/plcModules')
const Card = require('../../models/card')
const Stall = require('../../models/stall')
const Action = require('../../models/action')
const Device = require('../../models/device')
const Mode = require('../../models/mode')
const Operation = require('../../models/operation')
const Position = require('../../models/position')
const Queue = require('../../models/queue')
const Vfd = require('../../models/vfd')

/**
 * Alarms.
 */
const group1 = new AlarmGroup(generateAlarms(1, 1, 64, texts.alarms1), 'EL1')
const group2 = new AlarmGroup(generateAlarms(2, 1, 64, texts.alarms2), 'EL2')
const group3 = new AlarmGroup(generateAlarms(3, 1, 64, texts.alarms3), 'E1')
const group4 = new AlarmGroup(generateAlarms(4, 1, 64, texts.alarms4), 'E2')
const group5 = new AlarmGroup(generateAlarms(5, 1, 64, texts.alarms5), 'U1')
const group6 = new AlarmGroup(generateAlarms(6, 1, 64, texts.alarms6), 'U2')

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
 * Inputs
 */
const inputs1 = generateBits('E', 0, 1, texts.inputs1)
const inputs2 = generateBits('E', 100, 107, texts.inputs2)
const inputs3 = generateBits('E', 110, 117, texts.inputs3)
const inputs4 = generateBits('E', 200, 207, texts.inputs4)
const inputs5 = generateBits('E', 210, 217, texts.inputs5)
const inputs = inputs1.concat(inputs2, inputs3, inputs4, inputs5)
exports.inputs = inputs

const EB = generateBytes(inputs)
exports.EB = EB

/*
 * Outputs
 */
const outputs1 = generateBits('A', 0, 1, texts.outputs1)
const outputs2 = generateBits('A', 100, 105, texts.outputs2)
const outputs3 = generateBits('A', 110, 117, texts.outputs3)
const outputs4 = generateBits('A', 200, 205, texts.outputs4)
const outputs5 = generateBits('A', 210, 217, texts.outputs5)
const outputs = outputs1.concat(outputs2, outputs3, outputs4, outputs5)
exports.outputs = outputs

const AB = generateBytes(outputs)
exports.AB = AB

/*
 * Merkers
 */
const merkers = generateBits('M', 0, 7, texts.merkers)
exports.merkers = merkers

const MB = generateBytes(merkers)
exports.MB = MB

/**
 * PN nodes
 */
const nodes = generateBits('M', 0, 7, texts.nodes)
exports.nodes = nodes

const PN = generateBytes(nodes)
exports.PN = PN

/**
 * Motors
 */

const motors = generateBits('M', 0, 15, texts.motors)
exports.motors = motors

const MT = generateBytes(motors)
exports.MT = MT

/**
 * Racks
 */

const rack1 = {
  nr: 1,
  serie: 'et200m',
  title: 'Main',
  cards: [new S7_523_1BL00_0AA0(1, [...EB.slice(0, 2), ...AB.slice(0, 2)])]
}

const rack2 = {
  nr: 2,
  serie: 'et200s',
  title: 'KKE1',
  cards: [
    new S7_131_6BH01_0BA0(1, EB.slice(2, 4)),
    new S7_131_6BH01_0BA0(2, EB.slice(4, 6)),
    new S7_131_6BH01_0BA0(3, EB.slice(6, 8)),
    new S7_131_6BH01_0BA0(4, EB.slice(8, 10)),
    new S7_132_6BH01_0BA0(5, AB.slice(2, 4)),
    new S7_132_6BH01_0BA0(6, AB.slice(4, 6)),
    new S7_132_6BH01_0BA0(7, AB.slice(6, 8))
  ]
}

const rack3 = {
  nr: 3,
  serie: 'et200s',
  title: 'LS1',
  cards: [
    new S7_131_6BH01_0BA0(1, EB.slice(10, 12)),
    new S7_132_6BH01_0BA0(2, AB.slice(8, 10))
  ]
}

const rack4 = {
  nr: 4,
  serie: 'et200s',
  title: 'KKP1',
  cards: [
    new S7_131_6BH01_0BA0(1, EB.slice(12, 14)),
    new S7_132_6BH01_0BA0(2, AB.slice(10, 12))
  ]
}

const rack5 = {
  nr: 5,
  serie: 'et200s',
  title: 'SH1',
  cards: [
    new S7_131_6BH01_0BA0(1, EB.slice(14, 16)),
    new S7_131_6BH01_0BA0(2, EB.slice(16, 18)),
    new S7_132_6BH01_0BA0(3, AB.slice(12, 14)),
    new S7_132_6BH01_0BA0(4, AB.slice(14, 16))
  ]
}

const rack6 = {
  nr: 6,
  serie: 'et200s',
  title: 'KKE2',
  cards: [
    new S7_131_6BH01_0BA0(1, EB.slice(18, 20)),
    new S7_131_6BH01_0BA0(2, EB.slice(20, 22)),
    new S7_131_6BH01_0BA0(3, EB.slice(22, 24)),
    new S7_131_6BH01_0BA0(4, EB.slice(24, 26)),
    new S7_132_6BH01_0BA0(5, AB.slice(16, 18)),
    new S7_132_6BH01_0BA0(6, AB.slice(18, 20)),
    new S7_132_6BH01_0BA0(7, AB.slice(20, 22))
  ]
}

const rack7 = {
  nr: 7,
  serie: 'et200s',
  title: 'LS2',
  cards: [
    new S7_131_6BH01_0BA0(1, EB.slice(26, 28)),
    new S7_132_6BH01_0BA0(2, AB.slice(22, 24))
  ]
}

const rack8 = {
  nr: 8,
  serie: 'et200s',
  title: 'KKP2',
  cards: [
    new S7_131_6BH01_0BA0(1, EB.slice(28, 30)),
    new S7_132_6BH01_0BA0(2, AB.slice(24, 26))
  ]
}

const rack9 = {
  nr: 9,
  serie: 'et200s',
  title: 'SH2',
  cards: [
    new S7_131_6BH01_0BA0(1, EB.slice(30, 32)),
    new S7_131_6BH01_0BA0(2, EB.slice(32, 34)),
    new S7_132_6BH01_0BA0(3, AB.slice(26, 28)),
    new S7_132_6BH01_0BA0(4, AB.slice(28, 30))
  ]
}

exports.racks = [rack1, rack2, rack3, rack4, rack5, rack6, rack7, rack8, rack9]

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

/**
 * VFDrives
 */
const drives = texts.drives.map(
  item =>
    new Vfd(
      item,
      nodes.find(b => b.label === item)
    )
)
// drives[0].enabled = inputs.find(b => b.addr === 'E401.0')
// drives[1].enabled = inputs.find(b => b.addr === 'E401.1')
// drives[2].enabled = inputs.find(b => b.addr === 'E501.0')
// drives[3].enabled = inputs.find(b => b.addr === 'E501.1')
// drives[4].enabled = inputs.find(b => b.addr === 'E601.0')
// drives[5].enabled = inputs.find(b => b.addr === 'E601.1')
// drives[6].enabled = inputs.find(b => b.addr === 'E104.3')
// drives[7].enabled = inputs.find(b => b.addr === 'E204.3')
// drives[8].enabled = inputs.find(b => b.addr === 'E304.3')

exports.drives = drives

/**
 * Devices
 */
const { EL1, xEL1 } = require('./devices/el1')
const { EL2, xEL2 } = require('./devices/el2')
const { E1, xE1 } = require('./devices/e1')
const { E2, xE2 } = require('./devices/e2')
const { U1, xU1 } = require('./devices/u1')
const { U2, xU2 } = require('./devices/u2')

exports.overview = {
  definitions: s7def.APS_DEF,
  devices: [EL1, EL2, E1, E2, U1, U2],
  exitQueue: {
    queueList: exitQueue,
    exitButton: new Action(
      merkers.find(b => b.addr === 'M0.0'),
      s7def.REQ_0,
      'action-exit'
    )
  }
}

exports.diagnostic = [xEL1, xEL2, xE1, xE2, xU1, xU2]

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
  definitions: s7def.APS_DEF,
  // limits: {
  //   minCard: 1,
  //   maxCard: s7def.CARDS,
  //   minStall: 1,
  //   maxStall: s7def.STALLS
  // },
  statistics: [TYPE_0],
  levels: [
    {
      nr: 1,
      label: 'Level 1',
      min: 1,
      max: 12,
      stalls: stalls.slice(0, 12),
      elevators: [
        { id: 'el-1', label: 'EL1' },
        { id: 'el-2', label: 'EL2' }
      ]
    },
    {
      nr: 2,
      label: 'Level 2',
      min: 13,
      max: 24,
      stalls: stalls.slice(12, 24),
      elevators: [
        { id: 'el-1', label: 'EL1' },
        { id: 'el-2', label: 'EL2' }
      ]
    },
    {
      nr: 3,
      label: 'Level 3',
      min: 25,
      max: 36,
      stalls: stalls.slice(24, 36),
      elevators: [
        { id: 'el-1', label: 'EL1' },
        { id: 'el-2', label: 'EL2' }
      ]
    },
    {
      nr: 4,
      label: 'Level 4',
      min: 37,
      max: 48,
      stalls: stalls.slice(36, 48),
      elevators: [
        { id: 'el-1', label: 'EL1' },
        { id: 'el-2', label: 'EL2' }
      ]
    },
    {
      nr: 5,
      label: 'Level 5',
      min: 49,
      max: 60,
      stalls: stalls.slice(48, 60),
      elevators: [
        { id: 'el-1', label: 'EL1' },
        { id: 'el-2', label: 'EL2' }
      ]
    },
    {
      nr: 6,
      label: 'Level 6',
      min: 61,
      max: 72,
      stalls: stalls.slice(60, 72),
      elevators: [
        { id: 'el-1', label: 'EL1' },
        { id: 'el-2', label: 'EL2' }
      ]
    },
    {
      nr: 7,
      label: 'Level 7',
      min: 73,
      max: 84,
      stalls: stalls.slice(72, 84),
      elevators: [
        { id: 'el-1', label: 'EL1' },
        { id: 'el-2', label: 'EL2' }
      ]
    },
    {
      nr: 8,
      label: 'Level 8',
      min: 85,
      max: 96,
      stalls: stalls.slice(84, 96),
      elevators: [
        { id: 'el-1', label: 'EL1' },
        { id: 'el-2', label: 'EL2' }
      ]
    },
    {
      nr: 9,
      label: 'Level 9',
      min: 97,
      max: 108,
      stalls: stalls.slice(96, 108),
      elevators: [
        { id: 'el-1', label: 'EL1' },
        { id: 'el-2', label: 'EL2' }
      ]
    },
    {
      nr: 10,
      label: 'Level 10',
      min: 109,
      max: 120,
      stalls: stalls.slice(108, 120),
      elevators: [
        { id: 'el-1', label: 'EL1' },
        { id: 'el-2', label: 'EL2' }
      ]
    },
    {
      nr: 11,
      label: 'Level 11',
      min: 121,
      max: 132,
      stalls: stalls.slice(120, 132),
      elevators: [
        { id: 'el-1', label: 'EL1' },
        { id: 'el-2', label: 'EL2' }
      ]
    },
    {
      nr: 12,
      label: 'Level 12',
      min: 133,
      max: 144,
      stalls: stalls.slice(132, 144),
      elevators: [
        { id: 'el-1', label: 'EL1' },
        { id: 'el-2', label: 'EL2' }
      ]
    },
    {
      nr: 13,
      label: 'Level 13',
      min: 145,
      max: 156,
      stalls: stalls.slice(144, 156),
      elevators: [
        { id: 'el-1', label: 'EL1' },
        { id: 'el-2', label: 'EL2' }
      ]
    },
    {
      nr: 14,
      label: 'Level 14',
      min: 157,
      max: 168,
      stalls: stalls.slice(156, 168),
      elevators: [
        { id: 'el-1', label: 'EL1' },
        { id: 'el-2', label: 'EL2' }
      ]
    },
    {
      nr: 15,
      label: 'Level 15',
      min: 169,
      max: 180,
      stalls: stalls.slice(168, 180),
      elevators: [
        { id: 'el-1', label: 'EL1' },
        { id: 'el-2', label: 'EL2' }
      ]
    },
    {
      nr: 16,
      label: 'Level 16',
      min: 181,
      max: 192,
      stalls: stalls.slice(180, 192),
      elevators: [
        { id: 'el-1', label: 'EL1' },
        { id: 'el-2', label: 'EL2' }
      ]
    },
    {
      nr: 17,
      label: 'Level 17',
      min: 193,
      max: 204,
      stalls: stalls.slice(192, 204),
      elevators: [
        { id: 'el-1', label: 'EL1' },
        { id: 'el-2', label: 'EL2' }
      ]
    },
    {
      nr: 18,
      label: 'Level 18',
      min: 205,
      max: 216,
      stalls: stalls.slice(204, 216),
      elevators: [
        { id: 'el-1', label: 'EL1' },
        { id: 'el-2', label: 'EL2' }
      ]
    },
    {
      nr: 19,
      label: 'Level 19',
      min: 217,
      max: 228,
      stalls: stalls.slice(216, 228),
      elevators: [
        { id: 'el-1', label: 'EL1' },
        { id: 'el-2', label: 'EL2' }
      ]
    },
    {
      nr: 20,
      label: 'Level 20',
      min: 229,
      max: 240,
      stalls: stalls.slice(228, 240),
      elevators: [
        { id: 'el-1', label: 'EL1' },
        { id: 'el-2', label: 'EL2' }
      ]
    }
  ]
}
