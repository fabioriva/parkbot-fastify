const fs = require('fs')

const BYTE_LEN = 8
const FILE = './strings.js'

/**
 * PLC I/O texts
 */
generateBits('E', 0, 1, 'inputs1')
generateBits('E', 100, 107, 'inputs2')
generateBits('E', 110, 117, 'inputs3')
generateBits('E', 200, 207, 'inputs4')
generateBits('E', 210, 217, 'inputs5')
// generateBits('E', 410, 413, 'inputs6')
// generateBits('E', 500, 501, 'inputs7')
// generateBits('E', 510, 513, 'inputs8')
// generateBits('E', 600, 601, 'inputs9')
// generateBits('E', 610, 613, 'inputs10')

generateBits('A', 0, 1, 'outputs1')
generateBits('A', 100, 105, 'outputs2')
generateBits('A', 110, 117, 'outputs3')
generateBits('A', 200, 205, 'outputs4')
generateBits('A', 210, 217, 'outputs5')
// generateBits('A', 410, 413, 'outputs6')
// generateBits('A', 500, 501, 'outputs7')
// generateBits('A', 510, 513, 'outputs8')
// generateBits('A', 600, 601, 'outputs9')
// generateBits('A', 610, 613, 'outputs10')

generateBits('M', 0, 7, 'merkers')

generateBits('PN', 0, 7, 'nodes')

generateBits('MT', 0, 15, 'motors')

function generateBits (type, min, max, name) {
  fs.appendFileSync(FILE, `exports.${name} = [\r\n`)
  for (let e = min; e <= max; e++) {
    for (let b = 0; b < BYTE_LEN; b++) {
      fs.appendFileSync(FILE, `  { addr: '${type}${e}.${b}', label: '' },\r\n`)
    }
  }
  fs.appendFileSync(FILE, ']\r\n')
}

/**
 * Alarms text
 */
generateAlarms('EL1', 0, 64, 'alarms1')
generateAlarms('EL2', 0, 64, 'alarms2')
generateAlarms('E1', 0, 64, 'alarms3')
generateAlarms('E2', 0, 64, 'alarms4')
generateAlarms('U1', 0, 64, 'alarms5')
generateAlarms('U2', 0, 64, 'alarms6')

function generateAlarms (group, min, max, name) {
  fs.appendFileSync(FILE, `exports.${name} = [\r\n`)
  for (let a = min; a < max; a++) {
    fs.appendFileSync(FILE, `  { class: '${group}', label: 'AL${a + 1}' },\r\n`)
  }
  fs.appendFileSync(FILE, ']\r\n')
}
