/*
 * ET200MP
 */
class S7_521_1BL00_0AB0 {
  constructor (nr, bytes = []) {
    this.nr = nr
    this.type = '6ES7 521-1BL00-0AB0'
    this.bytes = bytes
  }
}

class S7_521_1BH00_0AB0 {
  constructor (nr, bytes = []) {
    this.nr = nr
    this.type = '6ES7 521-1BH00-0AB0'
    this.bytes = bytes
  }
}

class S7_522_1BL01_0AB0 {
  constructor (nr, bytes = []) {
    this.nr = nr
    this.type = '6ES7 522-1BL01-0AB0'
    this.bytes = bytes
  }
}

class S7_522_1BH01_0AB0 {
  constructor (nr, bytes = []) {
    this.nr = nr
    this.type = '6ES7 522-1BH01-0AB0'
    this.bytes = bytes
  }
}

/*
 * ET200SP
 */
class S7_131_6BF00_0BA0 {
  constructor (nr, bytes = []) {
    this.nr = nr
    this.type = '131-6BF00-0BA0'
    this.bytes = bytes
  }
}

class S7_132_6BF00_0BA0 {
  constructor (nr, bytes = []) {
    this.nr = nr
    this.type = '132-6BF00-0BA0'
    this.bytes = bytes
  }
}

module.exports = {
  S7_521_1BL00_0AB0,
  S7_521_1BH00_0AB0,
  S7_522_1BL01_0AB0,
  S7_522_1BH01_0AB0,
  S7_131_6BF00_0BA0,
  S7_132_6BF00_0BA0
}
