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
const IV1 = drives[4]
const IV1EN = inputs.find(b => b.addr === 'E601.0')

const IV2 = drives[5]
const IV2EN = inputs.find(b => b.addr === 'E601.1')
/**
 * LC
 */
const FTXV = inputs.find(b => b.addr === 'E611.6')
const FTXH = inputs.find(b => b.addr === 'E611.7')
const EM = inputs.find(b => b.addr === 'E611.0')
const LC = [FTXV, FTXH, EM]

/**
 * M1: Hoisting motor
 */
const FSBK = inputs.find(b => b.addr === 'E611.2')

const SBK1 = outputs.find(b => b.addr === 'A611.0')
const SBK2 = outputs.find(b => b.addr === 'A612.0')

const ASBK = inputs.find(b => b.addr === 'E611.3')
const AKKP = inputs.find(b => b.addr === 'E601.7')

const M1 = new Hoisting(
  'motor-hoisting',
  motors.find(b => b.label === 'M1-ENB-T3'),
  motors.find(b => b.label === 'M1-BWD-T3'),
  motors.find(b => b.label === 'M1-FWD-T3'),
  IV1,
  positions.slice(0, 2),
  [IV1EN, FSBK],
  [SBK1, SBK2],
  ...[ASBK, AKKP, ...LC]
)

/**
 * M2: Traveling motor
 */
const T101 = outputs.find(b => b.addr === 'A601.0')
const T102 = outputs.find(b => b.addr === 'A601.3')
const T10F = outputs.find(b => b.addr === 'A601.2')

const AH = inputs.find(b => b.addr === 'E601.5')

const M2 = new Traveling(
  'motor-traveling',
  motors.find(b => b.label === 'M2-ENB-T3'),
  motors.find(b => b.label === 'M2-BWD-T3'),
  motors.find(b => b.label === 'M2-FWD-T3'),
  IV2,
  positions.slice(2, 4),
  [IV2EN],
  [T101, T102, T10F],
  ...[AH, AKKP, ...LC]
)

/**
 * Silomat
 */
const AF7 = inputs.find(b => b.addr === 'E601.0')
const AGF = inputs.find(b => b.addr === 'E601.3')
const MTC = inputs.find(b => b.addr === 'E601.3')
const FTCR = inputs.find(b => b.addr === 'E611.4')

const TCR = outputs.find(b => b.addr === 'A611.7')

const SIL = new Silomat(
  'motor-silomat',
  motors.find(b => b.label === 'SIL-ENB-T3'),
  motors.find(b => b.label === 'SIL-BWD-T3'),
  motors.find(b => b.label === 'SIL-FWD-T3'),
  IV2,
  [IV2EN, FTCR],
  [TCR],
  [
    inputs.find(b => b.addr === 'E612.0'),
    inputs.find(b => b.addr === 'E612.1'),
    inputs.find(b => b.addr === 'E612.2'),
    inputs.find(b => b.addr === 'E612.3'),
    inputs.find(b => b.addr === 'E612.4'),
    inputs.find(b => b.addr === 'E612.5'),
    inputs.find(b => b.addr === 'E612.6'),
    inputs.find(b => b.addr === 'E612.7'),
    outputs.find(b => b.addr === 'A601.1'), // T2
    outputs.find(b => b.addr === 'A611.2'), // TRA
    outputs.find(b => b.addr === 'A611.3'), // TRB
    outputs.find(b => b.addr === 'A611.4'), // KCS
    outputs.find(b => b.addr === 'A611.5'), // KCV
    outputs.find(b => b.addr === 'A611.6') // KCH
  ],
  ...[AF7, AKKP, AGF, MTC, FTCR]
)

const T = {
  a: devices[2],
  b: positions.slice(8, 12),
  c: [
    inputs.find(b => b.addr === 'E601.3'),
    outputs.find(b => b.addr === 'A612.7'),
    outputs.find(b => b.addr === 'A612.6'),
    inputs.find(b => b.addr === 'E612.3'),
    merkers.find(b => b.addr === 'M2.5'),
    merkers.find(b => b.addr === 'M2.6')
  ],
  d: [],
  e: SIL,
  f: [],
  g: [M1, M2],
  h: [IV1, IV2]
}

exports.T3 = T
