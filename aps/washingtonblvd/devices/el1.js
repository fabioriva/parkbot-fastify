const {
  devices,
  drives,
  positions,
  inputs,
  outputs,
  merkers,
  motors,
  nodes
} = require('../entities')
const { Flap, Lock, Hoisting } = require('../../../models/motors')
const Vfd = require('../../../models/vfd')

/**
 * VF Drives
 */

const IV = new Vfd(
  'IV-A',
  nodes.find(b => b.label === 'IV-A'),
  inputs.find(b => b.addr === 'E104.3')
)

const M1 = new Hoisting(
  'motor-hoisting',
  motors.find(b => b.label === 'M1-ENB-A'),
  motors.find(b => b.label === 'M1-BWD-A'),
  motors.find(b => b.label === 'M1-FWD-A'),
  IV,
  positions[12],
  ...[inputs.find(b => b.addr === 'E105.5')]
)

const M3 = new Hoisting(
  'motor-rotation',
  motors.find(b => b.label === 'M3-ENB-A'),
  motors.find(b => b.label === 'M3-BWD-A'),
  motors.find(b => b.label === 'M3-FWD-A'),
  IV,
  positions[13],
  ...[inputs.find(b => b.addr === 'E105.5')]
)

/**
 * Motors
 */

const M2 = new Lock(
  'motor-lock',
  motors.find(b => b.label === 'M2-ENB-A'),
  motors.find(b => b.label === 'M2-BWD-A'),
  motors.find(b => b.label === 'M2-FWD-A'),
  inputs.find(b => b.addr === 'E105.3'),
  inputs.find(b => b.addr === 'E105.4'),
  outputs.find(b => b.addr === 'A102.0'),
  outputs.find(b => b.addr === 'A102.1'),
  ...[inputs.find(b => b.addr === 'E105.5')]
)

const M4 = new Lock(
  'motor-lock',
  motors.find(b => b.label === 'M4-ENB-A'),
  motors.find(b => b.label === 'M4-BWD-A'),
  motors.find(b => b.label === 'M4-FWD-A'),
  inputs.find(b => b.addr === 'E108.0'),
  inputs.find(b => b.addr === 'E108.1'),
  outputs.find(b => b.addr === 'A105.0'),
  outputs.find(b => b.addr === 'A105.1'),
  ...[inputs.find(b => b.addr === 'E108.2')]
)

const M5 = new Flap(
  'motor-flap',
  // inputs.find(b => b.addr === 'E102.4'),
  // inputs.find(b => b.addr === 'E102.5'),
  // outputs.find(b => b.addr === 'A102.4'),
  // outputs.find(b => b.addr === 'A102.5'),
  motors.find(b => b.label === 'M5-ENB-A'),
  motors.find(b => b.label === 'M5-BWD-A'),
  motors.find(b => b.label === 'M5-FWD-A'),
  inputs.find(b => b.addr === 'E102.4'),
  inputs.find(b => b.addr === 'E102.5'),
  outputs.find(b => b.addr === 'A102.4'),
  outputs.find(b => b.addr === 'A102.5'),
  ...[inputs.find(b => b.addr === 'E102.6')]
)

const iv2 = new Vfd(
  'IV-B',
  nodes.find(b => b.addr === 'M0.5'),
  inputs.find(b => b.addr === 'E204.3')
)
const iv3 = new Vfd(
  'IV-C',
  nodes.find(b => b.addr === 'M1.1'),
  inputs.find(b => b.addr === 'E304.3')
)
const iv1_t1 = new Vfd(
  'IV1-T1',
  nodes.find(b => b.addr === 'M1.6'),
  inputs.find(b => b.addr === 'E401.0')
)
const iv2_t1 = new Vfd(
  'IV2-T1',
  nodes.find(b => b.addr === 'M1.7'),
  inputs.find(b => b.addr === 'E401.1')
)
const iv1_t2 = new Vfd(
  'IV1-T2',
  nodes.find(b => b.addr === 'M2.6'),
  inputs.find(b => b.addr === 'E501.0')
)
const iv2_t2 = new Vfd(
  'IV2-T2',
  nodes.find(b => b.addr === 'M2.7'),
  inputs.find(b => b.addr === 'E501.1')
)
const iv1_t3 = new Vfd(
  'IV1-T3',
  nodes.find(b => b.addr === 'M3.5'),
  inputs.find(b => b.addr === 'E601.0')
)
const iv2_t3 = new Vfd(
  'IV2-T3',
  nodes.find(b => b.addr === 'M3.6'),
  inputs.find(b => b.addr === 'E601.1')
)
drives.push(iv1_t1, iv2_t1, iv1_t2, iv2_t2, iv1_t3, iv2_t3, IV, iv2, iv3)

// const iv1 = drives.find(item => item.name === 'IV-A')
// console.log(IV)

const EL1 = {
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
  e: [],
  f: [M2, M4, M5],
  g: [M1, M3],
  h: [IV]
}

exports.EL1 = EL1
