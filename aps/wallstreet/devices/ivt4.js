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
const IV1 = drives[6]
const IV2 = drives[7]

const FTXV = inputs.find(b => b.addr === 'E411.6')
const FTXH = inputs.find(b => b.addr === 'E411.7')
const EM = inputs.find(b => b.addr === 'E411.3')
const LC = [FTXV, FTXH, EM]

const EMC = inputs.find(b => b.addr === 'E405.5')

/**
 * M2: Locking V
 */
const EOM = inputs.find(b => b.addr === 'E405.3')
const EZM = inputs.find(b => b.addr === 'E405.4')
const SMA = outputs.find(b => b.addr === 'A404.0')
const SMB = outputs.find(b => b.addr === 'A404.1')
const AMM = inputs.find(b => b.addr === 'E405.2')

const M2 = new Lock(
  'motor-lock',
  motors.find(b => b.label === 'M2-ENB-VT4'),
  motors.find(b => b.label === 'M2-BWD-VT4'),
  motors.find(b => b.label === 'M2-FWD-VT4'),
  EOM,
  EZM,
  SMA,
  SMB,
  ...[AMM, ...LC]
)

/**
 * M1: Hoisting motor
 */
const IV1EN = inputs.find(b => b.addr === 'E401.1')
const FSBK = inputs.find(b => b.addr === 'E401.4')

const SBK1 = outputs.find(b => b.addr === 'A400.0') // Safety output A1010.7
const SBK2 = outputs.find(b => b.addr === 'A400.0')

const ASBK = inputs.find(b => b.addr === 'E401.5')
const RTA = inputs.find(b => b.addr === 'E401.6')

const M1 = new Hoisting(
  'motor-hoisting',
  motors.find(b => b.label === 'M1-ENB-VT4'),
  motors.find(b => b.label === 'M1-BWD-VT4'),
  motors.find(b => b.label === 'M1-FWD-VT4'),
  IV1,
  positions.slice(6, 8),
  [IV1EN, FSBK],
  [SBK1, SBK2],
  ...[ASBK, RTA, ...LC, EMC, M2.unlocked]
)

/**
 * M2: Traveling motor
 */
const IV2EN = inputs.find(b => b.addr === 'E413.0')

const T101 = outputs.find(b => b.addr === 'A411.0')
const T102 = outputs.find(b => b.addr === 'A412.4')
const T10F = outputs.find(b => b.addr === 'A412.5')

const AH = inputs.find(b => b.addr === 'E414.6')

const M3 = new Traveling(
  'motor-traveling',
  motors.find(b => b.label === 'M2-ENB-VT4'),
  motors.find(b => b.label === 'M2-BWD-VT4'),
  motors.find(b => b.label === 'M2-FWD-VT4'),
  IV2,
  positions.slice(8, 10),
  [IV2EN],
  [T101, T102, T10F],
  ...[AH, ...LC]
)

/**
 * Silomat
 */
const AF7 = inputs.find(b => b.addr === 'E414.4')
// const AGF = inputs.find(b => b.addr === 'E401.3')
const MTC = inputs.find(b => b.addr === 'E414.7')

const FTCR = inputs.find(b => b.addr === 'E414.5')
const TCR = outputs.find(b => b.addr === 'A411.7')

const FTCR1 = inputs.find(b => b.addr === 'E404.2')
const TCR1 = outputs.find(b => b.addr === 'A404.2')

const SIL_IO = [
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
const SIL = new Silomat(
  'motor-silomat',
  motors.find(b => b.label === 'SIL-ENB-VT4'),
  motors.find(b => b.label === 'SIL-BWD-VT4'),
  motors.find(b => b.label === 'SIL-FWD-VT4'),
  IV2,
  [IV2EN, FTCR, FTCR1],
  [TCR, TCR1],
  SIL_IO,
  ...[AF7, MTC, FTCR, FTCR1]
)

/**
 * Device
 */
const IVT4 = {
  a: devices[3],
  b: positions.slice(6, 10),
  c: [
    inputs.find(b => b.addr === 'E401.3'),
    outputs.find(b => b.addr === 'A400.7'),
    outputs.find(b => b.addr === 'A400.6'),
    inputs.find(b => b.addr === 'E412.3'),
    merkers.find(b => b.addr === 'M1.0'),
    merkers.find(b => b.addr === 'M1.1')
  ],
  d: [],
  e: SIL_IO
}

const augmentedIVT4 = {
  ...IVT4,
  f: [M2],
  g: [M1, M3],
  h: [IV1, IV2],
  i: SIL
}

module.exports = { IVT4, augmentedIVT4 }
