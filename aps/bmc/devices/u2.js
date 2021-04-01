const { devices, positions, inputs, outputs, merkers } = require('../entities')

const SIL_IO = []

const U2 = {
  a: devices[5],
  b: [positions[11]],
  c: [
    inputs.find(b => b.addr === 'E201.1'),
    outputs.find(b => b.addr === 'A201.0'),
    outputs.find(b => b.addr === 'A201.1'),
    merkers.find(b => b.addr === 'M3.3'),
    merkers.find(b => b.addr === 'M3.4'),
    merkers.find(b => b.addr === 'M3.5')
  ],
  d: [],
  e: SIL_IO
}

const xU2 = {
  ...U2,
  f: [],
  g: [],
  h: []
}

module.exports = { U2, xU2 }
