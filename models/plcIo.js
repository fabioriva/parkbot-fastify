const BYTE_LEN = 8

class Bit {
  constructor (byte, bit, status, label) {
    this.byte = byte
    this.bit = bit
    this.status = status
    this.label = label
  }

  get _info () {
    return this.info
  }

  set _info (info) {
    if (info) {
      this.info = info
    }
  }
}

class Input extends Bit {
  constructor (byte, bit, status) {
    super(byte, bit, status)
    this.addr = 'E' + byte.toString() + '.' + bit.toString()
    this.type = 'E'
  }
}

class Output extends Bit {
  constructor (byte, bit, status) {
    super(byte, bit, status)
    this.addr = 'A' + byte.toString() + '.' + bit.toString()
    this.type = 'A'
  }
}

class Merker extends Bit {
  constructor (byte, bit, status) {
    super(byte, bit, status)
    this.addr = 'M' + byte.toString() + '.' + bit.toString()
    this.type = 'M'
  }
}

// class Byte {
//   constructor (byte = []) {
//     this.byte = byte
//     this.label = byte[0].type + 'B' + byte[0].byte
//   }
// }

function generateBits (type, min, max, texts) {
  const bits = []
  for (let e = min; e <= max; e++) {
    for (let b = 0; b < BYTE_LEN; b++) {
      if (type === 'E') bits.push(new Input(e, b, 0))
      if (type === 'A') bits.push(new Output(e, b, 0))
      if (type === 'M') bits.push(new Merker(e, b, 0))
    }
  }
  bits.forEach((b, i) => {
    b.label = texts[i].label
    b._info = texts[i].info
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
  generateBytes,
  Input,
  Output,
  Merker
}
