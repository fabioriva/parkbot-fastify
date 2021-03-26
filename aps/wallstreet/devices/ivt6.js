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
const IV1 = drives[10]
const IV2 = drives[11]

const FTXV = inputs.find(b => b.addr === 'E611.6')
const FTXH = inputs.find(b => b.addr === 'E611.7')
const EM = inputs.find(b => b.addr === 'E611.3')
const LC = [FTXV, FTXH, EM]

const EMC = inputs.find(b => b.addr === 'E605.5')

/**
 * M2: Locking V
 */
const EOM = inputs.find(b => b.addr === 'E605.3')
const EZM = inputs.find(b => b.addr === 'E605.4')
const SMA = outputs.find(b => b.addr === 'A604.0')
const SMB = outputs.find(b => b.addr === 'A604.1')
const AMM = inputs.find(b => b.addr === 'E605.2')

const M2 = new Lock(
  'motor-lock',
  motors.find(b => b.label === 'M2-ENB-VT6'),
  motors.find(b => b.label === 'M2-BWD-VT6'),
  motors.find(b => b.label === 'M2-FWD-VT6'),
  EOM,
  EZM,
  SMA,
  SMB,
  ...[AMM, ...LC]
)

/**
 * M1: Hoisting motor
 */
const IV1EN = inputs.find(b => b.addr === 'E601.1')
const FSBK = inputs.find(b => b.addr === 'E601.4')

const SBK1 = outputs.find(b => b.addr === 'A600.0') // Safety output A1010.7
const SBK2 = outputs.find(b => b.addr === 'A600.0')

const ASBK = inputs.find(b => b.addr === 'E601.5')
const RTA = inputs.find(b => b.addr === 'E601.6')

const M1 = new Hoisting(
  'motor-hoisting',
  motors.find(b => b.label === 'M1-ENB-VT6'),
  motors.find(b => b.label === 'M1-BWD-VT6'),
  motors.find(b => b.label === 'M1-FWD-VT6'),
  IV1,
  positions.slice(14, 16),
  [IV1EN, FSBK],
  [SBK1, SBK2],
  ...[ASBK, RTA, ...LC, EMC, M2.unlocked]
)

/**
 * M2: Traveling motor
 */
const IV2EN = inputs.find(b => b.addr === 'E613.0')

const T101 = outputs.find(b => b.addr === 'A611.0')
const T102 = outputs.find(b => b.addr === 'A612.4')
const T10F = outputs.find(b => b.addr === 'A612.5')

const AH = inputs.find(b => b.addr === 'E614.6')

const M3 = new Traveling(
  'motor-traveling',
  motors.find(b => b.label === 'M2-ENB-VT6'),
  motors.find(b => b.label === 'M2-BWD-VT6'),
  motors.find(b => b.label === 'M2-FWD-VT6'),
  IV2,
  positions.slice(16, 18),
  [IV2EN],
  [T101, T102, T10F],
  ...[AH, ...LC]
)

/**
 * Silomat
 */
const AF7 = inputs.find(b => b.addr === 'E614.4')
// const AGF = inputs.find(b => b.addr === 'E601.3')
const MTC = inputs.find(b => b.addr === 'E614.7')

const FTCR = inputs.find(b => b.addr === 'E614.5')
const TCR = outputs.find(b => b.addr === 'A611.7')

const FTCR1 = inputs.find(b => b.addr === 'E604.2')
const TCR1 = outputs.find(b => b.addr === 'A604.2')

const SIL_IO = [
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
const SIL = new Silomat(
  'motor-silomat',
  motors.find(b => b.label === 'SIL-ENB-VT6'),
  motors.find(b => b.label === 'SIL-BWD-VT6'),
  motors.find(b => b.label === 'SIL-FWD-VT6'),
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
  a: devices[5],
  b: positions.slice(10, 14),
  c: [
    inputs.find(b => b.addr === 'E601.3'),
    outputs.find(b => b.addr === 'A600.7'),
    outputs.find(b => b.addr === 'A600.6'),
    inputs.find(b => b.addr === 'E612.3'),
    merkers.find(b => b.addr === 'M1.4'),
    merkers.find(b => b.addr === 'M1.5')
  ],
  d: [],
  e: SIL_IO,
  f: [M2],
  g: [M1, M3],
  h: [IV1, IV2],
  i: SIL
}

// exports.IVT6 = IVT
module.exports = { IVT }
