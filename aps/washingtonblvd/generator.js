const fs = require('fs')

const BYTE_LEN = 8
const FILE = './strings.js'

/**
 * PLC I/O texts
 */
generateBits('E', 0, 3, 'inputs1')
generateBits('E', 100, 109, 'inputs2')
generateBits('E', 200, 209, 'inputs3')
generateBits('E', 300, 309, 'inputs4')
generateBits('E', 400, 401, 'inputs5')
generateBits('E', 410, 413, 'inputs6')
generateBits('E', 500, 501, 'inputs7')
generateBits('E', 510, 513, 'inputs8')
generateBits('E', 600, 601, 'inputs9')
generateBits('E', 610, 613, 'inputs10')

generateBits('A', 0, 3, 'outputs1')
generateBits('A', 100, 105, 'outputs2')
generateBits('A', 200, 205, 'outputs3')
generateBits('A', 300, 305, 'outputs4')
generateBits('A', 400, 401, 'outputs5')
generateBits('A', 410, 413, 'outputs6')
generateBits('A', 500, 501, 'outputs7')
generateBits('A', 510, 513, 'outputs8')
generateBits('A', 600, 601, 'outputs9')
generateBits('A', 610, 613, 'outputs10')

generateBits('M', 0, 7, 'merkers1')

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
generateAlarms('T1', 0, 64, 'alarms1')
generateAlarms('T2', 0, 64, 'alarms2')
generateAlarms('T3', 0, 64, 'alarms3')
generateAlarms('EL1', 0, 64, 'alarms4')
generateAlarms('EL2', 0, 64, 'alarms5')
generateAlarms('EL3', 0, 64, 'alarms6')

function generateAlarms (group, min, max, name) {
  fs.appendFileSync(FILE, `exports.${name} = [\r\n`)
  for (let a = min; a < max; a++) {
    fs.appendFileSync(FILE, `  { class: '${group}', label: 'AL${a + 1}' },\r\n`)
  }
  fs.appendFileSync(FILE, ']\r\n')
}
