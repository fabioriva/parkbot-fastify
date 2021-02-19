const { devices, positions, inputs, outputs, merkers } = require('../entities')

/**
 * Motors
 */

const T1 = {
  a: devices[0],
  b: positions.slice(0, 4),
  c: [
    inputs.find(b => b.addr === 'E401.3'),
    outputs.find(b => b.addr === 'A412.7'),
    outputs.find(b => b.addr === 'A412.6'),
    inputs.find(b => b.addr === 'E412.3'),
    merkers.find(b => b.addr === 'M0.1'),
    merkers.find(b => b.addr === 'M0.2')
  ],
  d: [],
  e: [
    inputs.find(b => b.addr === 'E412.0'),
    inputs.find(b => b.addr === 'E412.1'),
    inputs.find(b => b.addr === 'E412.2'),
    inputs.find(b => b.addr === 'E412.3'),
    inputs.find(b => b.addr === 'E412.4'),
    inputs.find(b => b.addr === 'E412.5'),
    inputs.find(b => b.addr === 'E412.6'),
    inputs.find(b => b.addr === 'E412.7'),
    outputs.find(b => b.addr === 'A401.1'), // T2
    outputs.find(b => b.addr === 'A411.2'), // TRA
    outputs.find(b => b.addr === 'A411.3'), // TRB
    outputs.find(b => b.addr === 'A411.4'), // KCS
    outputs.find(b => b.addr === 'A411.5'), // KCV
    outputs.find(b => b.addr === 'A411.6') // KCH
  ],
  f: []
}

exports.module = T1
