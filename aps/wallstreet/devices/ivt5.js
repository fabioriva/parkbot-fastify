const {
  devices,
  drives,
  inputs,
  outputs,
  merkers,
  motors,
  positions
} = require('../entities')
const { Lock, Hoisting, Traveling, Silomat } = require('../../../models/motors')

/**
 * VFDs
 */
const IV1 = drives[8]
const IV2 = drives[9]

const FTXV = inputs.find(b => b.addr === 'E511.6')
const FTXH = inputs.find(b => b.addr === 'E511.7')
const EM = inputs.find(b => b.addr === 'E511.3')
const LC = [FTXV, FTXH, EM]

const EMC = inputs.find(b => b.addr === 'E505.5')

/**
 * M2: Locking V
 */
const EOM = inputs.find(b => b.addr === 'E505.3')
const EZM = inputs.find(b => b.addr === 'E505.4')
const SMA = outputs.find(b => b.addr === 'A504.0')
const SMB = outputs.find(b => b.addr === 'A504.1')
const AMM = inputs.find(b => b.addr === 'E505.2')

const M2 = new Lock(
  'motor-lock',
  motors.find(b => b.label === 'M2-ENB-VT5'),
  motors.find(b => b.label === 'M2-BWD-VT5'),
  motors.find(b => b.label === 'M2-FWD-VT5'),
  EOM,
  EZM,
  SMA,
  SMB,
  ...[AMM, ...LC]
)

/**
 * M1: Hoisting motor
 */
const IV1EN = inputs.find(b => b.addr === 'E501.1')
const FSBK = inputs.find(b => b.addr === 'E501.4')

const SBK1 = outputs.find(b => b.addr === 'A500.0') // Safety output A1010.7
const SBK2 = outputs.find(b => b.addr === 'A500.0')

const ASBK = inputs.find(b => b.addr === 'E501.5')
const RTA = inputs.find(b => b.addr === 'E501.6')

const M1 = new Hoisting(
  'motor-hoisting',
  motors.find(b => b.label === 'M1-ENB-VT5'),
  motors.find(b => b.label === 'M1-BWD-VT5'),
  motors.find(b => b.label === 'M1-FWD-VT5'),
  IV1,
  positions.slice(10, 12),
  [IV1EN, FSBK],
  [SBK1, SBK2],
  ...[ASBK, RTA, ...LC, EMC, M2.unlocked]
)

/**
 * M2: Traveling motor
 */
const IV2EN = inputs.find(b => b.addr === 'E513.0')

const T101 = outputs.find(b => b.addr === 'A511.0')
const T102 = outputs.find(b => b.addr === 'A512.4')
const T10F = outputs.find(b => b.addr === 'A512.5')

const AH = inputs.find(b => b.addr === 'E514.6')

const M3 = new Traveling(
  'motor-traveling',
  motors.find(b => b.label === 'M2-ENB-VT5'),
  motors.find(b => b.label === 'M2-BWD-VT5'),
  motors.find(b => b.label === 'M2-FWD-VT5'),
  IV2,
  positions.slice(12, 14),
  [IV2EN],
  [T101, T102, T10F],
  ...[AH, ...LC]
)

/**
 * Silomat
 */
const AF7 = inputs.find(b => b.addr === 'E514.4')
// const AGF = inputs.find(b => b.addr === 'E501.3')
const MTC = inputs.find(b => b.addr === 'E514.7')

const FTCR = inputs.find(b => b.addr === 'E514.5')
const TCR = outputs.find(b => b.addr === 'A511.7')

const FTCR1 = inputs.find(b => b.addr === 'E504.2')
const TCR1 = outputs.find(b => b.addr === 'A504.2')

const SIL_IO = [
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
const SIL = new Silomat(
  'motor-silomat',
  motors.find(b => b.label === 'SIL-ENB-VT5'),
  motors.find(b => b.label === 'SIL-BWD-VT5'),
  motors.find(b => b.label === 'SIL-FWD-VT5'),
  IV2,
  [IV2EN, FTCR, FTCR1],
  [TCR, TCR1],
  SIL_IO,
  ...[AF7, MTC, FTCR, FTCR1]
)

/**
 * Device
 */
const IVT = {
  a: devices[4],
  b: positions.slice(10, 14),
  c: [
    inputs.find(b => b.addr === 'E501.3'),
    outputs.find(b => b.addr === 'A500.7'),
    outputs.find(b => b.addr === 'A500.6'),
    inputs.find(b => b.addr === 'E512.3'),
    merkers.find(b => b.addr === 'M1.2'),
    merkers.find(b => b.addr === 'M1.3')
  ],
  d: [],
  e: SIL_IO,
  f: [M2],
  g: [M1, M3],
  h: [IV1, IV2],
  i: SIL
}

// exports.IVT5 = IVT
module.exports = { IVT }
