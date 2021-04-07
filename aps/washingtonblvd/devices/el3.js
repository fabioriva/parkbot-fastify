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
const IV = drives[8]

const FTXV = inputs.find(b => b.addr === 'E303.0')
const FTXH = inputs.find(b => b.addr === 'E303.1')
const FTC = inputs.find(b => b.addr === 'E302.1')
const LC = [FTXV, FTXH, FTC]

const EFB = inputs.find(b => b.addr === 'E302.3')
const EXPV = inputs.find(b => b.addr === 'E302.2')
const KEXPV = inputs.find(b => b.addr === 'E302.0')

/**
 * M2: Locking V
 */
const EOM = inputs.find(b => b.addr === 'E305.3')
const EZM = inputs.find(b => b.addr === 'E305.4')
const SMA = outputs.find(b => b.addr === 'A302.0')
const SMB = outputs.find(b => b.addr === 'A302.1')
const AMM = inputs.find(b => b.addr === 'E305.5')

const M2 = new Lock(
  'motor-lock',
  motors.find(b => b.label === 'M2-ENB-C'),
  motors.find(b => b.label === 'M2-BWD-C'),
  motors.find(b => b.label === 'M2-FWD-C'),
  EOM,
  EZM,
  SMA,
  SMB,
  ...[AMM, ...LC, EXPV, EFB]
)

/**
 * M4: Locking R
 */
const EOMD = inputs.find(b => b.addr === 'E308.0')
const EZMD = inputs.find(b => b.addr === 'E308.1')
const SMAD = outputs.find(b => b.addr === 'A305.0')
const SMBD = outputs.find(b => b.addr === 'A305.1')
const AMD = inputs.find(b => b.addr === 'E308.2')

const M4 = new Lock(
  'motor-lock',
  motors.find(b => b.label === 'M4-ENB-C'),
  motors.find(b => b.label === 'M4-BWD-C'),
  motors.find(b => b.label === 'M4-FWD-C'),
  EOMD,
  EZMD,
  SMAD,
  SMBD,
  ...[AMD, ...LC, KEXPV]
)

/**
 * M5: Flap
 */
const ECA = inputs.find(b => b.addr === 'E302.4')
const ECB = inputs.find(b => b.addr === 'E302.5')
const SCA = outputs.find(b => b.addr === 'A302.4')
const SCB = outputs.find(b => b.addr === 'A302.5')
const AMC = inputs.find(b => b.addr === 'E302.6')

const M5 = new Flap(
  'motor-flap',
  motors.find(b => b.label === 'M5-ENB-C'),
  motors.find(b => b.label === 'M5-BWD-C'),
  motors.find(b => b.label === 'M5-FWD-C'),
  ECA,
  ECB,
  SCA,
  SCB,
  ...[AMC, ...LC]
)

/**
 * M6: Door
 */
const EZE = inputs.find(b => b.addr === 'E306.0')
const EOE = inputs.find(b => b.addr === 'E306.1')
const SZE = outputs.find(b => b.addr === 'A300.4')
const SOE = outputs.find(b => b.addr === 'A300.5')
const APE = inputs.find(b => b.addr === 'E302.7')

const KXPE = [EXPV, KEXPV, M2.locked]

const M6 = new Door(
  'motor-door',
  motors.find(b => b.label === 'M6-ENB-C'),
  motors.find(b => b.label === 'M6-BWD-C'),
  motors.find(b => b.label === 'M6-FWD-C'),
  EZE,
  EOE,
  SZE,
  SOE,
  ...[APE, ...KXPE]
)

/**
 * M1: Hoisting motor
 */
const IVEN = inputs.find(b => b.addr === 'E304.3')
const FSBK = inputs.find(b => b.addr === 'E304.4')
const SQA = outputs.find(b => b.addr === 'A302.2')
const SBK1 = outputs.find(b => b.addr === 'A300.2')
const SBK2 = outputs.find(b => b.addr === 'A303.5')

const ASBK = inputs.find(b => b.addr === 'E304.5')
const RTA = inputs.find(b => b.addr === 'E304.6')

const M1 = new Hoisting(
  'motor-hoisting',
  motors.find(b => b.label === 'M1-ENB-C'),
  motors.find(b => b.label === 'M1-BWD-C'),
  motors.find(b => b.label === 'M1-FWD-C'),
  IV,
  [positions[16]],
  [IVEN, FSBK],
  [SQA, SBK1, SBK2],
  ...[ASBK, RTA, ...LC, M2.unlocked, M4.locked, ...M6.closed]
)

/**
 * M3: Rotation
 */
const AD = inputs.find(b => b.addr === 'E305.1')
const ASBK2 = inputs.find(b => b.addr === 'E304.1')
const TD = outputs.find(b => b.addr === 'A302.6')

const M3 = new Rotation(
  'motor-rotation',
  motors.find(b => b.label === 'M3-ENB-C'),
  motors.find(b => b.label === 'M3-BWD-C'),
  motors.find(b => b.label === 'M3-FWD-C'),
  IV,
  [positions[17]],
  [],
  [TD],
  ...[AD, ASBK2, ...LC, KEXPV, M2.locked, M4.unlocked, ...M6.closed]
)

/**
 * Device
 */
const EL3 = {
  a: devices[2],
  b: positions.slice(16, 18),
  c: [
    inputs.find(b => b.addr === 'E303.3'),
    outputs.find(b => b.addr === 'A300.7'),
    outputs.find(b => b.addr === 'A300.6'),
    merkers.find(b => b.addr === 'M1.6'),
    merkers.find(b => b.addr === 'M1.7'),
    merkers.find(b => b.addr === 'M2.0')
  ],
  d: [],
  e: []
}

const xEL3 = {
  ...EL3,
  f: [M2, M4, M5, M6],
  g: [M1, M3],
  h: [IV]
}

module.exports = { EL3, xEL3 }
