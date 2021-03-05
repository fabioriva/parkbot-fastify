const fs = require('fs')

const BYTE_LEN = 8
const FILE = './strings.js'

/**
 * PLC I/O texts
 */
generateBits('E', 0, 3, 'inputs1')
generateBits('E', 10, 17, 'inputs2')
generateBits('E', 20, 27, 'inputs3')
generateBits('E', 30, 31, 'inputs4')
generateBits('E', 40, 43, 'inputs5')

generateBits('A', 0, 1, 'outputs1')
generateBits('A', 10, 15, 'outputs2')
generateBits('A', 20, 25, 'outputs3')
generateBits('A', 30, 31, 'outputs4')
generateBits('A', 40, 42, 'outputs5')

generateBits('M', 0, 7, 'merkers1')

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
generateAlarms('ELA', 0, 64, 'alarms1')
generateAlarms('ELB', 0, 64, 'alarms2')
generateAlarms('TT', 0, 64, 'alarms3')
function generateAlarms (group, min, max, name) {
  fs.appendFileSync(FILE, `exports.${name} = [\r\n`)
  for (let a = min; a < max; a++) {
    fs.appendFileSync(FILE, `  { class: '${group}', label: 'AL${a + 1}' },\r\n`)
  }
  fs.appendFileSync(FILE, ']\r\n')
}
