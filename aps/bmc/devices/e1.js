const { devices, positions, inputs, outputs, merkers } = require('../entities')

const SIL_IO = []

const E1 = {
  a: devices[2],
  b: [positions[8]],
  c: [
    inputs.find(b => b.addr === 'E101.1'),
    outputs.find(b => b.addr === 'A101.0'),
    outputs.find(b => b.addr === 'A101.1'),
    merkers.find(b => b.addr === 'M2.0'),
    merkers.find(b => b.addr === 'M2.1'),
    merkers.find(b => b.addr === 'M2.2')
  ],
  d: [],
  e: SIL_IO
}

const xE1 = {
  ...E1,
  f: [],
  g: [],
  h: []
}

module.exports = { E1, xE1 }
