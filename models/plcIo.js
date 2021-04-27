const BYTE_LEN = 8

class Bit {
  // constructor (byte, bit, status) {
  //   this.byte = byte
  //   this.bit = bit
  //   this.status = status
  //   // this.label = label
  // }
  constructor (addr, status) {
    this.addr = addr
    this.status = status
  }

  get _i18n () {
    return this.i18n
  }

  set _i18n (obj) {
    if (obj) {
      this.i18n = obj
    }
  }
}

// class Input extends Bit {
//   constructor (byte, bit, status) {
//     super(byte, bit, status)
//     this.addr = 'E' + byte.toString() + '.' + bit.toString()
//     this.type = 'E'
//   }
// }

// class Output extends Bit {
//   constructor (byte, bit, status) {
//     super(byte, bit, status)
//     this.addr = 'A' + byte.toString() + '.' + bit.toString()
//     this.type = 'A'
//   }
// }

// class Merker extends Bit {
//   constructor (byte, bit, status) {
//     super(byte, bit, status)
//     this.addr = 'M' + byte.toString() + '.' + bit.toString()
//     this.type = 'M'
//   }
// }

// class Byte {
//   constructor (byte = []) {
//     this.byte = byte
//     this.label = byte[0].type + 'B' + byte[0].byte
//   }
// }

function generateBits (type, min, max, texts) {
  const bits = []
  for (let byte = min; byte <= max; byte++) {
    for (let bit = 0; bit < BYTE_LEN; bit++) {
      // if (type === 'E') bits.push(new Input(byte, bit, 0))
      // if (type === 'A') bits.push(new Output(byte, bit, 0))
      // if (type === 'M') bits.push(new Merker(byte, bit, 0))
      bits.push(new Bit(type + byte.toString() + '.' + bit.toString(), false))
    }
  }
  bits.forEach((b, i) => {
    b.label = texts[i].label
    b._i18n = texts[i].i18n
  })
  return bits
}

function generateBytes (bits) {
  const bytes = []
  let byte = []
  bits.forEach((bit, i) => {
    if (i !== 0 && i % BYTE_LEN === 0) {
      // bytes.push(new Byte(byte))
      bytes.push(byte)
      byte = []
    }
    byte.push(bit)
  })
  bytes.push(byte)
  return bytes
}

module.exports = {
  generateBits,
  generateBytes
  // Input,
  // Output,
  // Merker
}
