const { devices, inputs, outputs, merkers } = require('../entities')
const { Door, Flap, Lock } = require('../../../models/motor')

const LC = [
  inputs.find(b => b.addr === 'E15.6'), // FTXV
  inputs.find(b => b.addr === 'E15.7'), // FTXH
  inputs.find(b => b.addr === 'E11.7') // FTC
]

const flap = new Flap(
  'motor-flap',
  inputs.find(b => b.addr === 'E10.0'),
  inputs.find(b => b.addr === 'E10.1'),
  outputs.find(b => b.addr === 'A12.0'),
  outputs.find(b => b.addr === 'A12.1'),
  merkers.find(b => b.addr === 'M1.0'),
  merkers.find(b => b.addr === 'M1.1'),
  merkers.find(b => b.addr === 'M1.2'),
  ...[inputs.find(b => b.addr === 'E10.2'), ...LC]
)

const lock1 = new Lock(
  'motor-lock',
  inputs.find(b => b.addr === 'E11.0'),
  inputs.find(b => b.addr === 'E11.1'),
  outputs.find(b => b.addr === 'A12.2'),
  outputs.find(b => b.addr === 'A12.3'),
  merkers.find(b => b.addr === 'M1.3'),
  merkers.find(b => b.addr === 'M1.4'),
  merkers.find(b => b.addr === 'M1.5'),
  ...[
    inputs.find(b => b.addr === 'E11.2'), // AMM1
    inputs.find(b => b.addr === 'E10.0'), // KEXPV
    ...LC
  ]
)

const lock2 = new Lock(
  'motor-lock',
  inputs.find(b => b.addr === 'E11.3'),
  inputs.find(b => b.addr === 'E11.4'),
  outputs.find(b => b.addr === 'A12.4'),
  outputs.find(b => b.addr === 'A12.5'),
  merkers.find(b => b.addr === 'M1.6'),
  merkers.find(b => b.addr === 'M1.7'),
  merkers.find(b => b.addr === 'M2.0'),
  ...[
    inputs.find(b => b.addr === 'E11.5'), // AMM
    inputs.find(b => b.addr === 'E10.0'), // KEXPV
    ...LC
  ]
)

const door = new Door(
  'motor-door',
  inputs.find(b => b.addr === 'E14.0'),
  inputs.find(b => b.addr === 'E14.1'),
  outputs.find(b => b.addr === 'A15.0'),
  outputs.find(b => b.addr === 'A15.1'),
  merkers.find(b => b.addr === 'M3.3'),
  merkers.find(b => b.addr === 'M3.4'),
  merkers.find(b => b.addr === 'M3.5'),
  ...[
    inputs.find(b => b.addr === 'E15.4') // APE
    // inputs.find(b => b.addr === 'E105.7'),
    // inputs.find(b => b.addr === 'E109.7')
    // lock1.locked,
    // lock2.locked
  ]
)

const ELA = {
  a: devices[0],
  b: [],
  c: [
    inputs.find(b => b.addr === 'E2.3'),
    outputs.find(b => b.addr === 'A12.7'),
    outputs.find(b => b.addr === 'A12.6')
  ],
  d: [],
  e: [],
  f: [door, flap, lock1, lock2]
}

exports.ELA = ELA
