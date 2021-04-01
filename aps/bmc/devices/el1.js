const { devices, positions, inputs, outputs, merkers } = require('../entities')

const SIL_IO = [
  inputs.find(b => b.addr === 'E116.0'),
  inputs.find(b => b.addr === 'E116.1'),
  inputs.find(b => b.addr === 'E116.2'),
  inputs.find(b => b.addr === 'E116.3'),
  inputs.find(b => b.addr === 'E116.4'),
  inputs.find(b => b.addr === 'E116.5'),
  inputs.find(b => b.addr === 'E116.6'),
  inputs.find(b => b.addr === 'E116.7'),
  outputs.find(b => b.addr === 'A115.5'), // T2
  outputs.find(b => b.addr === 'A115.6'), // TRA
  outputs.find(b => b.addr === 'A115.7'), // TRB
  outputs.find(b => b.addr === 'A116.1'), // KCS
  outputs.find(b => b.addr === 'A116.2'), // KCV
  outputs.find(b => b.addr === 'A116.3') // KCH
]

const EL1 = {
  a: devices[0],
  b: positions.slice(0, 4),
  c: [
    inputs.find(b => b.addr === 'E110.3'),
    outputs.find(b => b.addr === 'A110.0'),
    outputs.find(b => b.addr === 'A110.1'),
    merkers.find(b => b.addr === 'M1.0'),
    merkers.find(b => b.addr === 'M1.1'),
    merkers.find(b => b.addr === 'M1.2')
  ],
  d: [],
  e: SIL_IO
}

const xEL1 = {
  ...EL1,
  f: [],
  g: [],
  h: []
}

module.exports = { EL1, xEL1 }
