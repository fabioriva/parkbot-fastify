const { devices, positions, inputs, outputs, merkers } = require('../entities')

const SIL_IO = []

const E2 = {
  a: devices[3],
  b: [positions[9]],
  c: [
    inputs.find(b => b.addr === 'E201.1'),
    outputs.find(b => b.addr === 'A201.0'),
    outputs.find(b => b.addr === 'A201.1'),
    merkers.find(b => b.addr === 'M2.3'),
    merkers.find(b => b.addr === 'M2.4'),
    merkers.find(b => b.addr === 'M2.5')
  ],
  d: [],
  e: SIL_IO
}

const xE2 = {
  ...E2,
  f: [],
  g: [],
  h: []
}

module.exports = { E2, xE2 }
