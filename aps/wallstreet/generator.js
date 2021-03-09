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
