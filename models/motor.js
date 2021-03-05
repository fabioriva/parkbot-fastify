const EventEmitter = require('events')
const format = require('date-fns/format')

class Motor extends EventEmitter {
  constructor (name, p1, p2, m1, m2, enb, bwd, fwd, ...args) {
    super()
    this.name = name
    this.p1 = p1
    this.p2 = p2
    this.m1 = m1
    this.m2 = m2
    this.enb = enb
    this.bwd = bwd
    this.fwd = fwd
    this.args = args
    this.active = []
  }

  diagnostic (mesg) {
    const message = { date: format(Date.now(), 'yyyy-MM-dd HH:mm:ss'), mesg }
    this.active.push(message)
    this.emit('diagnostic', message)
  }

  // info () {
  //   return {
  //     name: this.name,
  //     io: [this.p1, this.p2, this.m1, this.m2],
  //     motion: this.motion,
  //     position: this.position,
  //     diagnostic: this.active
  //   }
  // }

  diagnostic_ () {
    const { enb, bwd, fwd } = this

    this.args.forEach(arg => {
      if (!arg.status && !arg.flag) {
        if (!enb.status && bwd.status ^ fwd.status) {
          arg.flag = true
          this.diagnostic('diag-02:' + arg.addr)
        }
      } else if (arg.status || enb.status) {
        arg.flag = false
      }
    })

    if (enb.status) {
      this.active = []
    }

    // this.args.forEach(arg => {
    //   if (arg.status && !arg.flag) {
    //     arg.flag = true
    //     console.log('SET', arg.addr)
    //   } else if (!arg.status && arg.flag) {
    //     arg.flag = false
    //     console.log('RST', arg.addr)
    //   }
    // })

    /**
     * The OR || operator does the following:
     * Evaluates operands from left to right.
     * For each operand, converts it to boolean.
     * If the result is true, stops and returns the original value of that operand.
     * If all operands have been evaluated (i.e. all were false), returns the last operand.
     */

    // if ((bwd.status || fwd.status) && !enb.status) {
    //   this.args.forEach(arg => {
    //     if (!arg.status && !arg.flag) {
    //       arg.flag = true
    //       this.diagnostic('diag-02:' + arg.addr)
    //     }
    //   })
    // }
    // this.args.forEach(arg => {
    //   if (arg.status || enb.status) {
    //     arg.flag = false
    //   }
    // })
  }

  motion_ (mesg0, mesg1, mesg2) {
    const { m1, m2 } = this

    if (!m1.status && !m2.status) {
      this.motion = mesg0
    } else if (m1.status && !m2.status) {
      this.motion = mesg1
    } else if (m2.status && !m1.status) {
      this.motion = mesg2
    } else {
      this.motion = 'motion-err'
      if (m1.status !== m1.flag || m2.status !== m2.flag) {
        this.diagnostic('diag-01')
      }
    }

    if (m1.flag !== m1.status) {
      m1.flag = m1.status
    }
    if (m2.flag !== m2.status) {
      m2.flag = m2.status
    }
  }

  position_ (mesg0, mesg1, mesg2) {
    const { p1, p2 } = this

    if (!p1.status && !p2.status) {
      this.position = mesg0
    } else if (p1.status && !p2.status) {
      this.position = mesg1
    } else if (p2.status && !p1.status) {
      this.position = mesg2
    } else {
      this.position = 'position-err'
      if (p1.status !== p1.flag || p2.status !== p2.flag) {
        this.diagnostic('diag-03')
      }
    }

    if (p1.flag !== p1.status) {
      p1.flag = p1.status
    }
    if (p2.flag !== p2.status) {
      p2.flag = p2.status
    }
  }
}

class Door extends Motor {
  // constructor () {
  //   super()
  //   this.name = 'motor-flap'
  // }

  motion_ () {
    const { m1, m2 } = this

    this.closing = Boolean(m1.status && !m2.status)
    this.opening = Boolean(m2.status && !m1.status)

    super.motion_('motion-no', 'motion-close', 'motion-open')
  }

  position_ () {
    const { p1, p2 } = this

    this.closed = Boolean(p1.status && !p2.status)
    this.opened = Boolean(p2.status && !p1.status)

    super.position_('position-no', 'position-closed', 'position-opened')
  }
}

class Flap extends Motor {
  // constructor () {
  //   super()
  //   this.name = 'motor-flap'
  // }

  motion_ () {
    const { m1, m2 } = this

    this.up = Boolean(m1.status && !m2.status)
    this.down = Boolean(m2.status && !m1.status)

    super.motion_('motion-no', 'motion-up', 'motion-down')
  }

  position_ () {
    const { p1, p2 } = this

    this.high = Boolean(p1.status && !p2.status)
    this.low = Boolean(p2.status && !p1.status)

    super.position_('position-no', 'position-high', 'position-low')
  }
}

class Lock extends Motor {
  // constructor (name, p1, p2, m1, m2, enb, bwd, fwd) {
  //   super(name, p1, p2, m1, m2, enb, bwd, fwd)
  //   this.name = 'motor-flap'
  //   this.locked = Boolean(0)
  //   this.unlocked = Boolean(0)
  // }

  motion_ () {
    const { m1, m2 } = this

    this.lock = Boolean(m1.status && !m2.status)
    this.unlock = Boolean(m2.status && !m1.status)

    super.motion_('motion-no', 'motion-lock', 'motion-unlock')
  }

  position_ () {
    const { p1, p2 } = this

    this.locked = Boolean(p1.status && !p2.status)
    this.unlocked = Boolean(p2.status && !p1.status)

    super.position_('position-no', 'position-locked', 'position-unlocked')
  }
}

module.exports = {
  Door,
  Flap,
  Lock
}
