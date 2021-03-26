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
const IV1 = drives[2]
const IV2 = drives[3]

const FTXV = inputs.find(b => b.addr === 'E211.6')
const FTXH = inputs.find(b => b.addr === 'E211.7')
const EM = inputs.find(b => b.addr === 'E211.0')
const LC = [FTXV, FTXH, EM]

const EXPV = inputs.find(b => b.addr === 'E211.1')
const KEXPV = inputs.find(b => b.addr === 'E211.1') // Safety input E2020.3

/**
 * M2: Locking V
 */
const EOM = inputs.find(b => b.addr === 'E210.3')
const EZM = inputs.find(b => b.addr === 'E210.4')
const SMA = outputs.find(b => b.addr === 'A211.0')
const SMB = outputs.find(b => b.addr === 'A211.1')
const AMM = inputs.find(b => b.addr === 'E210.5')

const M2 = new Lock(
  'motor-lock',
  motors.find(b => b.label === 'M2-ENB-VT2'),
  motors.find(b => b.label === 'M2-BWD-VT2'),
  motors.find(b => b.label === 'M2-FWD-VT2'),
  EOM,
  EZM,
  SMA,
  SMB,
  ...[AMM, ...LC]
)

/**
 * M4: Flap
 */
const ECA = inputs.find(b => b.addr === 'E210.0')
const ECB = inputs.find(b => b.addr === 'E210.1')
const SCA = outputs.find(b => b.addr === 'A211.2')
const SCB = outputs.find(b => b.addr === 'A211.3')
const AMC = inputs.find(b => b.addr === 'E210.2')

const M4 = new Flap(
  'motor-flap',
  motors.find(b => b.label === 'M4-ENB-VT2'),
  motors.find(b => b.label === 'M4-BWD-VT2'),
  motors.find(b => b.label === 'M4-FWD-VT2'),
  ECA,
  ECB,
  SCA,
  SCB,
  ...[AMC, ...LC]
)

/**
 * M5: Door E
 */
const EZE = inputs.find(b => b.addr === 'E206.0')
const EOE = inputs.find(b => b.addr === 'E206.1')
const SZE = outputs.find(b => b.addr === 'A200.4')
const SOE = outputs.find(b => b.addr === 'A200.5')
const APE = inputs.find(b => b.addr === 'E201.6')

const KXPE = [EXPV, KEXPV, M2.locked]

const M5 = new Door(
  'motor-door',
  motors.find(b => b.label === 'M5-ENB-VT2'),
  motors.find(b => b.label === 'M5-BWD-VT2'),
  motors.find(b => b.label === 'M5-FWD-VT2'),
  EZE,
  EOE,
  SZE,
  SOE,
  ...[APE, ...KXPE]
)

/**
 * M6: Door U
 */
const EZA = inputs.find(b => b.addr === 'E201.0')
const EOA = inputs.find(b => b.addr === 'E201.1')
const SZA = outputs.find(b => b.addr === 'A202.0')
const SOA = outputs.find(b => b.addr === 'A202.1')
const APA = inputs.find(b => b.addr === 'E201.3')

const KXPA = [EXPV, KEXPV, M2.locked]

const M6 = new Door(
  'motor-door',
  motors.find(b => b.label === 'M6-ENB-VT2'),
  motors.find(b => b.label === 'M6-BWD-VT2'),
  motors.find(b => b.label === 'M6-FWD-VT2'),
  EZA,
  EOA,
  SZA,
  SOA,
  ...[APA, ...KXPA]
)

/**
 * M1: Hoisting motor
 */
const IV1EN = inputs.find(b => b.addr === 'E202.3')
const FSBK = inputs.find(b => b.addr === 'E202.4')
const SQA = outputs.find(b => b.addr === 'A202.2')
const SBK1 = outputs.find(b => b.addr === 'A200.2')
const SBK2 = outputs.find(b => b.addr === 'A202.4')

const ASBK = inputs.find(b => b.addr === 'E202.5')
const RTA = inputs.find(b => b.addr === 'E202.6')

const M1 = new Hoisting(
  'motor-hoisting',
  motors.find(b => b.label === 'M1-ENB-VT2'),
  motors.find(b => b.label === 'M1-BWD-VT2'),
  motors.find(b => b.label === 'M1-FWD-VT2'),
  IV1,
  [positions[0]],
  [IV1EN, FSBK],
  [SQA, SBK1, SBK2],
  ...[ASBK, RTA, ...LC, M2.unlocked, M5.closed, ...M6.closed]
)

/**
 * M3: Rotation
 */
const IV2EN = inputs.find(b => b.addr === 'E202.0')
const AKKM = inputs.find(b => b.addr === 'E201.5')
const ASBK2 = inputs.find(b => b.addr === 'E202.1')
const TD = outputs.find(b => b.addr === 'A202.6')

const M3 = new Rotation(
  'motor-rotation',
  motors.find(b => b.label === 'M3-ENB-VT2'),
  motors.find(b => b.label === 'M3-BWD-VT2'),
  motors.find(b => b.label === 'M3-FWD-VT2'),
  IV2,
  [positions[1]],
  [IV2EN],
  [TD],
  ...[AKKM, ASBK2, ...LC, KEXPV, M2.locked, M5.closed, ...M6.closed]
)

/**
 * Silomat
 */
const AGF = inputs.find(b => b.addr === 'E201.4')
const MTC = inputs.find(b => b.addr === 'E211.5')
const FTCR = inputs.find(b => b.addr === 'E211.4')

const TCR = outputs.find(b => b.addr === 'A210.7')

const SIL_IO = [
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
const SIL = new Silomat(
  'motor-silomat',
  motors.find(b => b.label === 'SIL-ENB-VT2'),
  motors.find(b => b.label === 'SIL-BWD-VT2'),
  motors.find(b => b.label === 'SIL-FWD-VT2'),
  IV2,
  [IV2EN, FTCR],
  [TCR],
  SIL_IO,
  ...[AKKM, AGF, MTC, FTCR]
)

/**
 * Device
 */
const EVT = {
  a: devices[1],
  b: positions.slice(2, 4),
  c: [
    inputs.find(b => b.addr === 'E203.3'),
    outputs.find(b => b.addr === 'A200.7'),
    outputs.find(b => b.addr === 'A200.6'),
    inputs.find(b => b.addr === 'E212.3'),
    merkers.find(b => b.addr === 'M0.2'),
    merkers.find(b => b.addr === 'M0.3')
  ],
  d: [
    // new Action(
    //   merkers.find(b => b.addr === 'M3.0'),
    //   s7def.REQ_1,
    //   'action-entry'
    // ),
    // new Action(
    //   merkers.find(b => b.addr === 'M3.4'),
    //   s7def.REQ_2,
    //   'action-rollback'
    // )
  ],
  e: SIL_IO,
  f: [M2, M4, M5, M6],
  g: [M1, M3],
  h: [IV1, IV2],
  i: SIL
}

// exports.EVT2 = EVT
module.exports = { EVT }
