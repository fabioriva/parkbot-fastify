const { devices, positions, inputs, outputs, merkers } = require('../entities')

const SIL_IO = []

const U1 = {
  a: devices[4],
  b: [positions[10]],
  c: [
    inputs.find(b => b.addr === 'E101.1'),
    outputs.find(b => b.addr === 'A101.0'),
    outputs.find(b => b.addr === 'A101.1'),
    merkers.find(b => b.addr === 'M3.0'),
    merkers.find(b => b.addr === 'M3.1'),
    merkers.find(b => b.addr === 'M3.2')
  ],
  d: [],
  e: SIL_IO
}

const xU1 = {
  ...U1,
  f: [],
  g: [],
  h: []
}

module.exports = { U1, xU1 }
