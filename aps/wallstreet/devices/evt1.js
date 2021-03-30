const {
  devices,
  drives,
  inputs,
  outputs,
  merkers,
  motors,
  positions
} = require('../entities')
const {
  Door,
  Flap,
  Lock,
  Hoisting,
  Rotation,
  Silomat
} = require('../../../models/motors')
const Action = require('../../../models/action')

/**
 * VFDs
 */
const IV1 = drives[0]
const IV2 = drives[1]

const FTXV = inputs.find(b => b.addr === 'E111.6')
const FTXH = inputs.find(b => b.addr === 'E111.7')
const EM = inputs.find(b => b.addr === 'E111.0')
const LC = [FTXV, FTXH, EM]

const EXPV = inputs.find(b => b.addr === 'E111.1')
const KEXPV = inputs.find(b => b.addr === 'E111.1') // Safety input E1020.3

/**
 * M2: Locking V
 */
const EOM = inputs.find(b => b.addr === 'E110.3')
const EZM = inputs.find(b => b.addr === 'E110.4')
const SMA = outputs.find(b => b.addr === 'A111.0')
const SMB = outputs.find(b => b.addr === 'A111.1')
const AMM = inputs.find(b => b.addr === 'E110.5')

const M2 = new Lock(
  'motor-lock-v',
  motors.find(b => b.label === 'M2-ENB-VT1'),
  motors.find(b => b.label === 'M2-BWD-VT1'),
  motors.find(b => b.label === 'M2-FWD-VT1'),
  EOM,
  EZM,
  SMA,
  SMB,
  ...[AMM, ...LC]
)

/**
 * M4: Flap
 */
const ECA = inputs.find(b => b.addr === 'E110.0')
const ECB = inputs.find(b => b.addr === 'E110.1')
const SCA = outputs.find(b => b.addr === 'A111.2')
const SCB = outputs.find(b => b.addr === 'A111.3')
const AMC = inputs.find(b => b.addr === 'E110.2')

const M4 = new Flap(
  'motor-flap',
  motors.find(b => b.label === 'M4-ENB-VT1'),
  motors.find(b => b.label === 'M4-BWD-VT1'),
  motors.find(b => b.label === 'M4-FWD-VT1'),
  ECA,
  ECB,
  SCA,
  SCB,
  ...[AMC, ...LC]
)

/**
 * M5: Door E
 */
const EZE = inputs.find(b => b.addr === 'E106.0')
const EOE = inputs.find(b => b.addr === 'E106.1')
const SZE = outputs.find(b => b.addr === 'A100.4')
const SOE = outputs.find(b => b.addr === 'A100.5')
const APE = inputs.find(b => b.addr === 'E101.6')

const KXPE = [EXPV, KEXPV, M2.locked]

const M5 = new Door(
  'motor-door-entry',
  motors.find(b => b.label === 'M5-ENB-VT1'),
  motors.find(b => b.label === 'M5-BWD-VT1'),
  motors.find(b => b.label === 'M5-FWD-VT1'),
  EZE,
  EOE,
  SZE,
  SOE,
  ...[APE, ...KXPE]
)

/**
 * M6: Door U
 */
const EZA = inputs.find(b => b.addr === 'E101.0')
const EOA = inputs.find(b => b.addr === 'E101.1')
const SZA = outputs.find(b => b.addr === 'A102.0')
const SOA = outputs.find(b => b.addr === 'A102.1')
const APA = inputs.find(b => b.addr === 'E101.3')

const KXPA = [EXPV, KEXPV, M2.locked]

const M6 = new Door(
  'motor-door-exit',
  motors.find(b => b.label === 'M6-ENB-VT1'),
  motors.find(b => b.label === 'M6-BWD-VT1'),
  motors.find(b => b.label === 'M6-FWD-VT1'),
  EZA,
  EOA,
  SZA,
  SOA,
  ...[APA, ...KXPA]
)

/**
 * M1: Hoisting motor
 */
const IV1EN = inputs.find(b => b.addr === 'E102.3')
const FSBK = inputs.find(b => b.addr === 'E102.4')
const SQA = outputs.find(b => b.addr === 'A102.2')
const SBK1 = outputs.find(b => b.addr === 'A100.2')
const SBK2 = outputs.find(b => b.addr === 'A102.4')

const ASBK = inputs.find(b => b.addr === 'E102.5')
const RTA = inputs.find(b => b.addr === 'E102.6')

const M1 = new Hoisting(
  'motor-hoisting',
  motors.find(b => b.label === 'M1-ENB-VT1'),
  motors.find(b => b.label === 'M1-BWD-VT1'),
  motors.find(b => b.label === 'M1-FWD-VT1'),
  IV1,
  [positions[0]],
  [IV1EN, FSBK],
  [SQA, SBK1, SBK2],
  ...[ASBK, RTA, ...LC, M2.unlocked, M5.closed, ...M6.closed]
)

/**
 * M3: Rotation
 */
const IV2EN = inputs.find(b => b.addr === 'E102.0')
const AKKM = inputs.find(b => b.addr === 'E101.5')
const ASBK2 = inputs.find(b => b.addr === 'E102.1')
const TD = outputs.find(b => b.addr === 'A102.6')

const M3 = new Rotation(
  'motor-rotation',
  motors.find(b => b.label === 'M3-ENB-VT1'),
  motors.find(b => b.label === 'M3-BWD-VT1'),
  motors.find(b => b.label === 'M3-FWD-VT1'),
  IV2,
  [positions[1]],
  [IV2EN],
  [TD],
  ...[AKKM, ASBK2, ...LC, KEXPV, M2.locked, M5.closed, ...M6.closed]
)

/**
 * Silomat
 */
const AGF = inputs.find(b => b.addr === 'E101.4')
const MTC = inputs.find(b => b.addr === 'E111.5')
const FTCR = inputs.find(b => b.addr === 'E111.4')

const TCR = outputs.find(b => b.addr === 'A110.7')

const SIL_IO = [
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
const SIL = new Silomat(
  'motor-silomat',
  motors.find(b => b.label === 'SIL-ENB-VT1'),
  motors.find(b => b.label === 'SIL-BWD-VT1'),
  motors.find(b => b.label === 'SIL-FWD-VT1'),
  IV2,
  [IV2EN, FTCR],
  [TCR],
  SIL_IO,
  ...[AKKM, AGF, MTC, FTCR]
)

/**
 * Device
 */
const EVT1 = {
  a: devices[0],
  b: positions.slice(0, 2),
  c: [
    inputs.find(b => b.addr === 'E103.3'),
    outputs.find(b => b.addr === 'A100.7'),
    outputs.find(b => b.addr === 'A100.6'),
    inputs.find(b => b.addr === 'E112.3'),
    merkers.find(b => b.addr === 'M0.1'),
    merkers.find(b => b.addr === 'M0.2')
  ],
  d: [
    new Action(
      merkers.find(b => b.addr === 'M3.0'),
      {},
      'action-entry'
    ),
    new Action(
      merkers.find(b => b.addr === 'M3.3'),
      {},
      'action-rollback'
    )
  ],
  e: SIL_IO
}

const augmentedEVT1 = {
  ...EVT1,
  f: [M2, M4, M5, M6],
  g: [M1, M3],
  h: [IV1, IV2],
  i: SIL
}

module.exports = { EVT1, augmentedEVT1 }
