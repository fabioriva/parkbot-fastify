const {
  devices,
  drives,
  positions,
  inputs,
  outputs,
  merkers,
  motors
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
const IV1 = drives[4]
const IV2 = drives[5]

const FTXV = inputs.find(b => b.addr === 'E311.6')
const FTXH = inputs.find(b => b.addr === 'E311.7')
const EM = inputs.find(b => b.addr === 'E311.0')
const LC = [FTXV, FTXH, EM]

const EXPV = inputs.find(b => b.addr === 'E311.1')
const KEXPV = inputs.find(b => b.addr === 'E311.1') // Safety input E3020.3

/**
 * M2: Locking V
 */
const EOM = inputs.find(b => b.addr === 'E310.3')
const EZM = inputs.find(b => b.addr === 'E310.4')
const SMA = outputs.find(b => b.addr === 'A311.0')
const SMB = outputs.find(b => b.addr === 'A311.1')
const AMM = inputs.find(b => b.addr === 'E310.5')

const M2 = new Lock(
  'motor-lock',
  motors.find(b => b.label === 'M2-ENB-VT3'),
  motors.find(b => b.label === 'M2-BWD-VT3'),
  motors.find(b => b.label === 'M2-FWD-VT3'),
  EOM,
  EZM,
  SMA,
  SMB,
  ...[AMM, ...LC]
)

/**
 * M4: Flap
 */
const ECA = inputs.find(b => b.addr === 'E310.0')
const ECB = inputs.find(b => b.addr === 'E310.1')
const SCA = outputs.find(b => b.addr === 'A311.2')
const SCB = outputs.find(b => b.addr === 'A311.3')
const AMC = inputs.find(b => b.addr === 'E310.2')

const M4 = new Flap(
  'motor-flap',
  motors.find(b => b.label === 'M4-ENB-VT3'),
  motors.find(b => b.label === 'M4-BWD-VT3'),
  motors.find(b => b.label === 'M4-FWD-VT3'),
  ECA,
  ECB,
  SCA,
  SCB,
  ...[AMC, ...LC]
)

/**
 * M5: Door E
 */
const EZE = inputs.find(b => b.addr === 'E306.0')
const EOE = inputs.find(b => b.addr === 'E306.1')
const SZE = outputs.find(b => b.addr === 'A300.4')
const SOE = outputs.find(b => b.addr === 'A300.5')
const APE = inputs.find(b => b.addr === 'E301.6')

const KXPE = [EXPV, KEXPV, M2.locked]

const M5 = new Door(
  'motor-door',
  motors.find(b => b.label === 'M5-ENB-VT3'),
  motors.find(b => b.label === 'M5-BWD-VT3'),
  motors.find(b => b.label === 'M5-FWD-VT3'),
  EZE,
  EOE,
  SZE,
  SOE,
  ...[APE, ...KXPE]
)

/**
 * M6: Door U
 */
const EZA = inputs.find(b => b.addr === 'E301.0')
const EOA = inputs.find(b => b.addr === 'E301.1')
const SZA = outputs.find(b => b.addr === 'A302.0')
const SOA = outputs.find(b => b.addr === 'A302.1')
const APA = inputs.find(b => b.addr === 'E301.3')

const KXPA = [EXPV, KEXPV, M2.locked]

const M6 = new Door(
  'motor-door',
  motors.find(b => b.label === 'M6-ENB-VT3'),
  motors.find(b => b.label === 'M6-BWD-VT3'),
  motors.find(b => b.label === 'M6-FWD-VT3'),
  EZA,
  EOA,
  SZA,
  SOA,
  ...[APA, ...KXPA]
)

/**
 * M1: Hoisting motor
 */
const IV1EN = inputs.find(b => b.addr === 'E302.3')
const FSBK = inputs.find(b => b.addr === 'E302.4')
const SQA = outputs.find(b => b.addr === 'A302.2')
const SBK1 = outputs.find(b => b.addr === 'A300.2')
const SBK2 = outputs.find(b => b.addr === 'A302.4')

const ASBK = inputs.find(b => b.addr === 'E302.5')
const RTA = inputs.find(b => b.addr === 'E302.6')

const M1 = new Hoisting(
  'motor-hoisting',
  motors.find(b => b.label === 'M1-ENB-VT3'),
  motors.find(b => b.label === 'M1-BWD-VT3'),
  motors.find(b => b.label === 'M1-FWD-VT3'),
  IV1,
  [positions[0]],
  [IV1EN, FSBK],
  [SQA, SBK1, SBK2],
  ...[ASBK, RTA, ...LC, M2.unlocked, M5.closed, ...M6.closed]
)

/**
 * M3: Rotation
 */
const IV2EN = inputs.find(b => b.addr === 'E302.0')
const AKKM = inputs.find(b => b.addr === 'E301.5')
const ASBK2 = inputs.find(b => b.addr === 'E302.1')
const TD = outputs.find(b => b.addr === 'A302.6')

const M3 = new Rotation(
  'motor-rotation',
  motors.find(b => b.label === 'M3-ENB-VT3'),
  motors.find(b => b.label === 'M3-BWD-VT3'),
  motors.find(b => b.label === 'M3-FWD-VT3'),
  IV2,
  [positions[1]],
  [IV2EN],
  [TD],
  ...[AKKM, ASBK2, ...LC, KEXPV, M2.locked, M5.closed, ...M6.closed]
)

/**
 * Silomat
 */
const AGF = inputs.find(b => b.addr === 'E301.4')
const MTC = inputs.find(b => b.addr === 'E311.5')
const FTCR = inputs.find(b => b.addr === 'E311.4')

const TCR = outputs.find(b => b.addr === 'A310.7')

const SIL = new Silomat(
  'motor-silomat',
  motors.find(b => b.label === 'SIL-ENB-VT3'),
  motors.find(b => b.label === 'SIL-BWD-VT3'),
  motors.find(b => b.label === 'SIL-FWD-VT3'),
  IV2,
  [IV2EN, FTCR],
  [TCR],
  [
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
  ],
  ...[AKKM, AGF, MTC, FTCR]
)

/**
 * Device
 */
const EVT = {
  a: devices[2],
  b: positions.slice(4, 6),
  c: [
    inputs.find(b => b.addr === 'E303.3'),
    outputs.find(b => b.addr === 'A300.7'),
    outputs.find(b => b.addr === 'A300.6'),
    inputs.find(b => b.addr === 'E312.3'),
    merkers.find(b => b.addr === 'M0.4'),
    merkers.find(b => b.addr === 'M0.5')
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
  e: SIL,
  f: [M2, M4, M5, M6],
  g: [M1, M3],
  h: [IV1, IV2]
}

exports.EVT3 = EVT
