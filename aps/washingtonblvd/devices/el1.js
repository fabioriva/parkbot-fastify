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
const IV = drives[6]

const FTXV = inputs.find(b => b.addr === 'E103.0')
const FTXH = inputs.find(b => b.addr === 'E103.1')
const FTC = inputs.find(b => b.addr === 'E102.1')
const LC = [FTXV, FTXH, FTC]

const EFB = inputs.find(b => b.addr === 'E102.3')
const EXPV = inputs.find(b => b.addr === 'E102.2')
const KEXPV = inputs.find(b => b.addr === 'E102.0')

/**
 * M2: Locking V
 */
const EOM = inputs.find(b => b.addr === 'E105.3')
const EZM = inputs.find(b => b.addr === 'E105.4')
const SMA = outputs.find(b => b.addr === 'A102.0')
const SMB = outputs.find(b => b.addr === 'A102.1')
const AMM = inputs.find(b => b.addr === 'E105.5')

const M2 = new Lock(
  'motor-lock',
  motors.find(b => b.label === 'M2-ENB-A'),
  motors.find(b => b.label === 'M2-BWD-A'),
  motors.find(b => b.label === 'M2-FWD-A'),
  EOM,
  EZM,
  SMA,
  SMB,
  ...[AMM, ...LC, EXPV, EFB]
)

/**
 * M4: Locking R
 */
const EOMD = inputs.find(b => b.addr === 'E108.0')
const EZMD = inputs.find(b => b.addr === 'E108.1')
const SMAD = outputs.find(b => b.addr === 'A105.0')
const SMBD = outputs.find(b => b.addr === 'A105.1')
const AMD = inputs.find(b => b.addr === 'E108.2')

const M4 = new Lock(
  'motor-lock',
  motors.find(b => b.label === 'M4-ENB-A'),
  motors.find(b => b.label === 'M4-BWD-A'),
  motors.find(b => b.label === 'M4-FWD-A'),
  EOMD,
  EZMD,
  SMAD,
  SMBD,
  ...[AMD, ...LC, KEXPV]
)

/**
 * M5: Flap
 */
const ECA = inputs.find(b => b.addr === 'E102.4')
const ECB = inputs.find(b => b.addr === 'E102.5')
const SCA = outputs.find(b => b.addr === 'A102.4')
const SCB = outputs.find(b => b.addr === 'A102.5')
const AMC = inputs.find(b => b.addr === 'E102.6')

const M5 = new Flap(
  'motor-flap',
  motors.find(b => b.label === 'M5-ENB-A'),
  motors.find(b => b.label === 'M5-BWD-A'),
  motors.find(b => b.label === 'M5-FWD-A'),
  ECA,
  ECB,
  SCA,
  SCB,
  ...[AMC, ...LC]
)

/**
 * M6: Door
 */
const EZE = inputs.find(b => b.addr === 'E106.0')
const EOE = inputs.find(b => b.addr === 'E106.1')
const SZE = outputs.find(b => b.addr === 'A100.4')
const SOE = outputs.find(b => b.addr === 'A100.5')
const APE = inputs.find(b => b.addr === 'E102.7')

const KXPE = [EXPV, KEXPV, M2.locked]

const M6 = new Door(
  'motor-door',
  motors.find(b => b.label === 'M6-ENB-A'),
  motors.find(b => b.label === 'M6-BWD-A'),
  motors.find(b => b.label === 'M6-FWD-A'),
  EZE,
  EOE,
  SZE,
  SOE,
  ...[APE, ...KXPE]
)

/**
 * M1: Hoisting motor
 */
const IVEN = inputs.find(b => b.addr === 'E104.3')
const FSBK = inputs.find(b => b.addr === 'E104.4')
const SQA = outputs.find(b => b.addr === 'A102.2')
const SBK1 = outputs.find(b => b.addr === 'A100.2')
const SBK2 = outputs.find(b => b.addr === 'A103.5')

const ASBK = inputs.find(b => b.addr === 'E104.5')
const RTA = inputs.find(b => b.addr === 'E104.6')

const M1 = new Hoisting(
  'motor-hoisting',
  motors.find(b => b.label === 'M1-ENB-A'),
  motors.find(b => b.label === 'M1-BWD-A'),
  motors.find(b => b.label === 'M1-FWD-A'),
  IV,
  [positions[12]],
  [IVEN, FSBK],
  [SQA, SBK1, SBK2],
  ...[ASBK, RTA, ...LC, M2.unlocked, M4.locked, ...M6.closed]
)

/**
 * M3: Rotation
 */
const AD = inputs.find(b => b.addr === 'E105.1')
const ASBK2 = inputs.find(b => b.addr === 'E104.1')
const TD = outputs.find(b => b.addr === 'A102.6')

const M3 = new Rotation(
  'motor-rotation',
  motors.find(b => b.label === 'M3-ENB-A'),
  motors.find(b => b.label === 'M3-BWD-A'),
  motors.find(b => b.label === 'M3-FWD-A'),
  IV,
  [positions[13]],
  [],
  [TD],
  ...[AD, ASBK2, ...LC, KEXPV, M2.locked, M4.unlocked, ...M6.closed]
)

/**
 * Device
 */
const EL = {
  a: devices[3],
  b: positions.slice(12, 14),
  c: [
    inputs.find(b => b.addr === 'E103.3'),
    outputs.find(b => b.addr === 'A100.7'),
    outputs.find(b => b.addr === 'A100.6'),
    merkers.find(b => b.addr === 'M1.0'),
    merkers.find(b => b.addr === 'M1.1'),
    merkers.find(b => b.addr === 'M1.2')
  ],
  d: [],
  // e: [],
  f: [M2, M4, M5, M6],
  g: [M1, M3],
  h: [IV]
}

exports.EL1 = EL
