const {
  devices,
  drives,
  positions,
  inputs,
  outputs,
  merkers,
  motors
} = require('../entities')
const { Hoisting, Traveling, Silomat } = require('../../../models/motors')

/**
 * VFDs
 */
const IV1 = drives[0]
const IV1EN = inputs.find(b => b.addr === 'E401.0')

const IV2 = drives[1]
const IV2EN = inputs.find(b => b.addr === 'E401.1')
/**
 * LC
 */
const FTXV = inputs.find(b => b.addr === 'E411.6')
const FTXH = inputs.find(b => b.addr === 'E411.7')
const EM = inputs.find(b => b.addr === 'E411.0')
const LC = [FTXV, FTXH, EM]

/**
 * M1: Hoisting motor
 */
const FSBK = inputs.find(b => b.addr === 'E411.2')

const SBK1 = outputs.find(b => b.addr === 'A411.0')
const SBK2 = outputs.find(b => b.addr === 'A412.0')

const ASBK = inputs.find(b => b.addr === 'E411.3')
const AKKP = inputs.find(b => b.addr === 'E401.7')

const M1 = new Hoisting(
  'motor-hoisting',
  motors.find(b => b.label === 'M1-ENB-T1'),
  motors.find(b => b.label === 'M1-BWD-T1'),
  motors.find(b => b.label === 'M1-FWD-T1'),
  IV1,
  positions.slice(0, 2),
  [IV1EN, FSBK],
  [SBK1, SBK2],
  ...[ASBK, AKKP, ...LC]
)

/**
 * M2: Traveling motor
 */
const T101 = outputs.find(b => b.addr === 'A401.0')
const T102 = outputs.find(b => b.addr === 'A401.3')
const T10F = outputs.find(b => b.addr === 'A401.2')

const AH = inputs.find(b => b.addr === 'E401.5')

const M2 = new Traveling(
  'motor-traveling',
  motors.find(b => b.label === 'M2-ENB-T1'),
  motors.find(b => b.label === 'M2-BWD-T1'),
  motors.find(b => b.label === 'M2-FWD-T1'),
  IV2,
  positions.slice(2, 4),
  [IV2EN],
  [T101, T102, T10F],
  ...[AH, AKKP, ...LC]
)

/**
 * Silomat
 */
const AF7 = inputs.find(b => b.addr === 'E401.0')
const AGF = inputs.find(b => b.addr === 'E401.3')
const MTC = inputs.find(b => b.addr === 'E401.3')
const FTCR = inputs.find(b => b.addr === 'E411.4')

const TCR = outputs.find(b => b.addr === 'A411.7')

const SIL = new Silomat(
  'motor-silomat',
  motors.find(b => b.label === 'SIL-ENB-T1'),
  motors.find(b => b.label === 'SIL-BWD-T1'),
  motors.find(b => b.label === 'SIL-FWD-T1'),
  IV2,
  [IV2EN, FTCR],
  [TCR],
  [
    inputs.find(b => b.addr === 'E412.0'),
    inputs.find(b => b.addr === 'E412.1'),
    inputs.find(b => b.addr === 'E412.2'),
    inputs.find(b => b.addr === 'E412.3'),
    inputs.find(b => b.addr === 'E412.4'),
    inputs.find(b => b.addr === 'E412.5'),
    inputs.find(b => b.addr === 'E412.6'),
    inputs.find(b => b.addr === 'E412.7'),
    outputs.find(b => b.addr === 'A401.1'), // T2
    outputs.find(b => b.addr === 'A411.2'), // TRA
    outputs.find(b => b.addr === 'A411.3'), // TRB
    outputs.find(b => b.addr === 'A411.4'), // KCS
    outputs.find(b => b.addr === 'A411.5'), // KCV
    outputs.find(b => b.addr === 'A411.6') // KCH
  ],
  ...[AF7, AKKP, AGF, MTC, FTCR]
)

const T = {
  a: devices[0],
  b: positions.slice(0, 4),
  c: [
    inputs.find(b => b.addr === 'E401.3'),
    outputs.find(b => b.addr === 'A412.7'),
    outputs.find(b => b.addr === 'A412.6'),
    inputs.find(b => b.addr === 'E412.3'),
    merkers.find(b => b.addr === 'M2.1'),
    merkers.find(b => b.addr === 'M2.2')
  ],
  d: [],
  e: SIL,
  f: [],
  g: [M1, M2],
  h: [IV1, IV2]
}

exports.T1 = T
