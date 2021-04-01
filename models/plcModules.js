/*
 * ET200MP
 */

// DI 32
class S7_521_1BL00_0AB0 {
  constructor (nr, bytes = []) {
    this.nr = nr
    this.type = '6ES7 521-1BL00-0AB0'
    // this.bytes = bytes
    this.bytes = bytes.map(byte => ({ bits: byte }))
  }
}
// DI 16
class S7_521_1BH00_0AB0 {
  constructor (nr, bytes = []) {
    this.nr = nr
    this.type = '6ES7 521-1BH00-0AB0'
    // this.bytes = bytes
    this.bytes = bytes.map(byte => ({ bits: byte }))
  }
}
// DO 32
class S7_522_1BL01_0AB0 {
  constructor (nr, bytes = []) {
    this.nr = nr
    this.type = '6ES7 522-1BL01-0AB0'
    // this.bytes = bytes
    this.bytes = bytes.map(byte => ({ bits: byte }))
  }
}
// DO 16
class S7_522_1BH01_0AB0 {
  constructor (nr, bytes = []) {
    this.nr = nr
    this.type = '6ES7 522-1BH01-0AB0'
    // this.bytes = bytes
    this.bytes = bytes.map(byte => ({ bits: byte }))
  }
}
// DI 16 / DO 16
class S7_523_1BL00_0AA0 {
  constructor (nr, bytes = []) {
    this.nr = nr
    this.type = '6ES7 523-1BL00-0AA0'
    // this.bytes = bytes
    this.bytes = bytes.map(byte => ({ bits: byte }))
  }
}

/*
 * ET200SP
 */

// DI 8
class S7_131_6BF00_0BA0 {
  constructor (nr, bytes = []) {
    this.nr = nr
    this.type = '131-6BF00-0BA0'
    // this.bytes = bytes
    this.bytes = [{ bits: bytes }]
  }
}
// DO 8
class S7_132_6BF00_0BA0 {
  constructor (nr, bytes = []) {
    this.nr = nr
    this.type = '132-6BF00-0BA0'
    // this.bytes = bytes
    this.bytes = [{ bits: bytes }]
  }
}
// DI 16
class S7_131_6BH01_0BA0 {
  constructor (nr, bytes = []) {
    this.nr = nr
    this.type = '131-6BH01-0BA0'
    // this.bytes = bytes
    this.bytes = [{ bits: bytes }]
  }
}
// DO 16
class S7_132_6BH01_0BA0 {
  constructor (nr, bytes = []) {
    this.nr = nr
    this.type = '132-6BH01-0BA0'
    // this.bytes = bytes
    this.bytes = [{ bits: bytes }]
  }
}

module.exports = {
  S7_521_1BL00_0AB0,
  S7_521_1BH00_0AB0,
  S7_522_1BL01_0AB0,
  S7_522_1BH01_0AB0,
  S7_523_1BL00_0AA0,
  S7_131_6BF00_0BA0,
  S7_132_6BF00_0BA0,
  S7_131_6BH01_0BA0,
  S7_132_6BH01_0BA0
}
