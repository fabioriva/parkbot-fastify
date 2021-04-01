const { devices, positions, inputs, outputs, merkers } = require('../entities')

const SIL_IO = [
  inputs.find(b => b.addr === 'E216.0'),
  inputs.find(b => b.addr === 'E216.1'),
  inputs.find(b => b.addr === 'E216.2'),
  inputs.find(b => b.addr === 'E216.3'),
  inputs.find(b => b.addr === 'E216.4'),
  inputs.find(b => b.addr === 'E216.5'),
  inputs.find(b => b.addr === 'E216.6'),
  inputs.find(b => b.addr === 'E216.7'),
  outputs.find(b => b.addr === 'A215.5'), // T2
  outputs.find(b => b.addr === 'A215.6'), // TRA
  outputs.find(b => b.addr === 'A215.7'), // TRB
  outputs.find(b => b.addr === 'A216.1'), // KCS
  outputs.find(b => b.addr === 'A216.2'), // KCV
  outputs.find(b => b.addr === 'A216.3') // KCH
]

const EL2 = {
  a: devices[1],
  b: positions.slice(4, 8),
  c: [
    inputs.find(b => b.addr === 'E210.3'),
    outputs.find(b => b.addr === 'A210.0'),
    outputs.find(b => b.addr === 'A210.1'),
    merkers.find(b => b.addr === 'M1.3'),
    merkers.find(b => b.addr === 'M1.4'),
    merkers.find(b => b.addr === 'M1.5')
  ],
  d: [],
  e: SIL_IO
}

const xEL2 = {
  ...EL2,
  f: [],
  g: [],
  h: []
}

module.exports = { EL2, xEL2 }
