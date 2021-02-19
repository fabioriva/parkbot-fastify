const { devices, positions, inputs, outputs, merkers } = require('../entities')
const { Door, Flap, Lock } = require('../../../models/motor')

/**
 * Motors
 */

const LC = [
  inputs.find(b => b.addr === 'E105.0'),
  inputs.find(b => b.addr === 'E105.2'),
  inputs.find(b => b.addr === 'E105.3')
]

const lock1 = new Lock(
  'name-lock-v1',
  inputs.find(b => b.addr === 'E104.0'),
  inputs.find(b => b.addr === 'E104.1'),
  outputs.find(b => b.addr === 'A103.0'),
  outputs.find(b => b.addr === 'A103.1'),
  merkers.find(b => b.addr === 'M2.0'),
  merkers.find(b => b.addr === 'M2.1'),
  merkers.find(b => b.addr === 'M2.2'),
  ...[
    inputs.find(b => b.addr === 'E109.0'),
    inputs.find(b => b.addr === 'E105.7'),
    inputs.find(b => b.addr === 'E109.7'),
    ...LC
  ]
)

const lock2 = new Lock(
  'name-lock-v2',
  inputs.find(b => b.addr === 'E104.2'),
  inputs.find(b => b.addr === 'E104.3'),
  outputs.find(b => b.addr === 'A103.2'),
  outputs.find(b => b.addr === 'A103.3'),
  merkers.find(b => b.addr === 'M2.3'),
  merkers.find(b => b.addr === 'M2.4'),
  merkers.find(b => b.addr === 'M2.5'),
  ...[
    inputs.find(b => b.addr === 'E109.1'),
    inputs.find(b => b.addr === 'E105.7'),
    inputs.find(b => b.addr === 'E109.7'),
    ...LC
  ]
)

const flap = new Flap(
  'name-flap',
  inputs.find(b => b.addr === 'E104.4'),
  inputs.find(b => b.addr === 'E104.5'),
  outputs.find(b => b.addr === 'A103.4'),
  outputs.find(b => b.addr === 'A103.5'),
  merkers.find(b => b.addr === 'M3.0'),
  merkers.find(b => b.addr === 'M3.1'),
  merkers.find(b => b.addr === 'M3.2'),
  ...[inputs.find(b => b.addr === 'E109.2')]
)

const door = new Door(
  'name-door',
  inputs.find(b => b.addr === 'E106.0'),
  inputs.find(b => b.addr === 'E106.1'),
  outputs.find(b => b.addr === 'A106.1'),
  outputs.find(b => b.addr === 'A106.2'),
  merkers.find(b => b.addr === 'M3.3'),
  merkers.find(b => b.addr === 'M3.4'),
  merkers.find(b => b.addr === 'M3.5'),
  ...[
    inputs.find(b => b.addr === 'E109.3'),
    inputs.find(b => b.addr === 'E105.7'),
    inputs.find(b => b.addr === 'E109.7')
    // lock1.locked,
    // lock2.locked
  ]
)

const EL1 = {
  a: devices[1],
  b: [],
  c: [
    inputs.find(b => b.addr === 'E101.3'),
    outputs.find(b => b.addr === 'A101.7'),
    outputs.find(b => b.addr === 'A101.6')
  ],
  d: [],
  e: [],
  f: [door, flap, lock1, lock2]
}

exports.EL1 = EL1

console.log(lock1)
