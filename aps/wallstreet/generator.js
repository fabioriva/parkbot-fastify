const fs = require('fs')

const BYTE_LEN = 8
const FILE = './strings.js'

generateBits('PN', 0, 7, 'nodes')

generateBits('MT', 0, 16, 'motors')

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
generateAlarms('EVT1', 0, 64, 'alarms1')
generateAlarms('EVT2', 0, 64, 'alarms2')
generateAlarms('EVT3', 0, 64, 'alarms3')
generateAlarms('IVT1', 0, 64, 'alarms4')
generateAlarms('IVT2', 0, 64, 'alarms5')
generateAlarms('IVT3', 0, 64, 'alarms6')

function generateAlarms (group, min, max, name) {
  fs.appendFileSync(FILE, `exports.${name} = [\r\n`)
  for (let a = min; a < max; a++) {
    fs.appendFileSync(
      FILE,
      `  { class: '${group}', label: 'AL${a + 1}', info: '' },\r\n`
    )
  }
  fs.appendFileSync(FILE, ']\r\n')
}
