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
  Rotation
} = require('../../../models/motors')

/**
 * VFDs
 */
const IV = drives[7]

const FTXV = inputs.find(b => b.addr === 'E203.0')
const FTXH = inputs.find(b => b.addr === 'E203.1')
const FTC = inputs.find(b => b.addr === 'E202.1')
const LC = [FTXV, FTXH, FTC]

const EFB = inputs.find(b => b.addr === 'E202.3')
const EXPV = inputs.find(b => b.addr === 'E202.2')
const KEXPV = inputs.find(b => b.addr === 'E202.0')

/**
 * M2: Locking V
 */
const EOM = inputs.find(b => b.addr === 'E205.3')
const EZM = inputs.find(b => b.addr === 'E205.4')
const SMA = outputs.find(b => b.addr === 'A202.0')
const SMB = outputs.find(b => b.addr === 'A202.1')
const AMM = inputs.find(b => b.addr === 'E205.5')

const M2 = new Lock(
  'motor-lock',
  motors.find(b => b.label === 'M2-ENB-B'),
  motors.find(b => b.label === 'M2-BWD-B'),
  motors.find(b => b.label === 'M2-FWD-B'),
  EOM,
  EZM,
  SMA,
  SMB,
  ...[AMM, ...LC, EXPV, EFB]
)

/**
 * M4: Locking R
 */
const EOMD = inputs.find(b => b.addr === 'E208.0')
const EZMD = inputs.find(b => b.addr === 'E208.1')
const SMAD = outputs.find(b => b.addr === 'A205.0')
const SMBD = outputs.find(b => b.addr === 'A205.1')
const AMD = inputs.find(b => b.addr === 'E208.2')

const M4 = new Lock(
  'motor-lock',
  motors.find(b => b.label === 'M4-ENB-B'),
  motors.find(b => b.label === 'M4-BWD-B'),
  motors.find(b => b.label === 'M4-FWD-B'),
  EOMD,
  EZMD,
  SMAD,
  SMBD,
  ...[AMD, ...LC, KEXPV]
)

/**
 * M5: Flap
 */
const ECA = inputs.find(b => b.addr === 'E202.4')
const ECB = inputs.find(b => b.addr === 'E202.5')
const SCA = outputs.find(b => b.addr === 'A202.4')
const SCB = outputs.find(b => b.addr === 'A202.5')
const AMC = inputs.find(b => b.addr === 'E202.6')

const M5 = new Flap(
  'motor-flap',
  motors.find(b => b.label === 'M5-ENB-B'),
  motors.find(b => b.label === 'M5-BWD-B'),
  motors.find(b => b.label === 'M5-FWD-B'),
  ECA,
  ECB,
  SCA,
  SCB,
  ...[AMC, ...LC]
)

/**
 * M6: Door
 */
const EZE = inputs.find(b => b.addr === 'E206.0')
const EOE = inputs.find(b => b.addr === 'E206.1')
const SZE = outputs.find(b => b.addr === 'A200.4')
const SOE = outputs.find(b => b.addr === 'A200.5')
const APE = inputs.find(b => b.addr === 'E202.7')

const KXPE = [EXPV, KEXPV, M2.locked]

const M6 = new Door(
  'motor-door',
  motors.find(b => b.label === 'M6-ENB-B'),
  motors.find(b => b.label === 'M6-BWD-B'),
  motors.find(b => b.label === 'M6-FWD-B'),
  EZE,
  EOE,
  SZE,
  SOE,
  ...[APE, ...KXPE]
)

/**
 * M1: Hoisting motor
 */
const IVEN = inputs.find(b => b.addr === 'E204.3')
const FSBK = inputs.find(b => b.addr === 'E204.4')
const SQA = outputs.find(b => b.addr === 'A202.2')
const SBK1 = outputs.find(b => b.addr === 'A200.2')
const SBK2 = outputs.find(b => b.addr === 'A203.5')

const ASBK = inputs.find(b => b.addr === 'E204.5')
const RTA = inputs.find(b => b.addr === 'E204.6')

const M1 = new Hoisting(
  'motor-hoisting',
  motors.find(b => b.label === 'M1-ENB-B'),
  motors.find(b => b.label === 'M1-BWD-B'),
  motors.find(b => b.label === 'M1-FWD-B'),
  IV,
  [positions[14]],
  [IVEN, FSBK],
  [SQA, SBK1, SBK2],
  ...[ASBK, RTA, ...LC, M2.unlocked, M4.locked, ...M6.closed]
)

/**
 * M3: Rotation
 */
const AD = inputs.find(b => b.addr === 'E205.1')
const ASBK2 = inputs.find(b => b.addr === 'E204.1')
const TD = outputs.find(b => b.addr === 'A202.6')

const M3 = new Rotation(
  'motor-rotation',
  motors.find(b => b.label === 'M3-ENB-B'),
  motors.find(b => b.label === 'M3-BWD-B'),
  motors.find(b => b.label === 'M3-FWD-B'),
  IV,
  [positions[15]],
  [],
  [TD],
  ...[AD, ASBK2, ...LC, KEXPV, M2.locked, M4.unlocked, ...M6.closed]
)

/**
 * Device
 */
const EL2 = {
  a: devices[1],
  b: positions.slice(14, 16),
  c: [
    inputs.find(b => b.addr === 'E203.3'),
    outputs.find(b => b.addr === 'A200.7'),
    outputs.find(b => b.addr === 'A200.6'),
    merkers.find(b => b.addr === 'M1.3'),
    merkers.find(b => b.addr === 'M1.4'),
    merkers.find(b => b.addr === 'M1.5')
  ],
  d: [],
  e: []
}

const xEL2 = {
  ...EL2,
  f: [M2, M4, M5, M6],
  g: [M1, M3],
  h: [IV]
}

module.exports = { EL2, xEL2 }
