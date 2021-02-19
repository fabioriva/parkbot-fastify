const { devices, positions, inputs, outputs, merkers } = require('../entities')
const { Flap, Lock } = require('../../../models/motor')

/**
 * Motors
 */

const flap = new Flap(
  'name-flap',
  merkers.find(b => b.addr === 'M1.0'),
  merkers.find(b => b.addr === 'M1.1'),
  merkers.find(b => b.addr === 'M1.2'),
  merkers.find(b => b.addr === 'M1.3'),
  merkers.find(b => b.addr === 'M1.4'),
  merkers.find(b => b.addr === 'M1.5'),
  merkers.find(b => b.addr === 'M1.6'),
  ...[
    merkers.find(b => b.addr === 'M1.7'),
    merkers.find(b => b.addr === 'M2.7')
  ]
)

const lock1 = new Lock(
  'name-lock-v',
  merkers.find(b => b.addr === 'M2.0'),
  merkers.find(b => b.addr === 'M2.1'),
  merkers.find(b => b.addr === 'M2.2'),
  merkers.find(b => b.addr === 'M2.3'),
  merkers.find(b => b.addr === 'M2.4'),
  merkers.find(b => b.addr === 'M2.5'),
  merkers.find(b => b.addr === 'M2.6'),
  ...[merkers.find(b => b.addr === 'M2.7')]
)

const lock2 = new Lock(
  'name-lock-r',
  merkers.find(b => b.addr === 'M2.0'),
  merkers.find(b => b.addr === 'M2.1'),
  merkers.find(b => b.addr === 'M2.2'),
  merkers.find(b => b.addr === 'M2.3'),
  merkers.find(b => b.addr === 'M2.4'),
  merkers.find(b => b.addr === 'M2.5'),
  merkers.find(b => b.addr === 'M2.6'),
  ...[merkers.find(b => b.addr === 'M2.7')]
)

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
  f: [flap, lock1, lock2]
}

exports.EL1 = EL1
