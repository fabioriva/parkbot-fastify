const EventEmitter = require('events')
const format = require('date-fns/format')
const { positions } = require('../aps/washingtonblvd/entities')

class Motor extends EventEmitter {
  constructor (name, enb, bwd, fwd, ...args) {
    super()
    this.name = name
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
  }
}

class Actuator extends Motor {
  constructor (name, enb, bwd, fwd, p1, p2, m1, m2, ...args) {
    super(name, enb, bwd, fwd, ...args)
    this.m1 = m1
    this.m2 = m2
    this.p1 = p1
    this.p2 = p2
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

class Flap extends Actuator {
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

class Lock extends Actuator {
  motion_ () {
    const { m1, m2 } = this

    this.up = Boolean(m1.status && !m2.status)
    this.down = Boolean(m2.status && !m1.status)

    super.motion_('motion-no', 'motion-lock', 'motion-unlock')
  }

  position_ () {
    const { p1, p2 } = this

    this.high = Boolean(p1.status && !p2.status)
    this.low = Boolean(p2.status && !p1.status)

    super.position_('position-no', 'position-locked', 'position-unlocked')
  }
}

/**
 * VFD motors
 */

class MVfd extends Motor {
  constructor (name, enb, bwd, fwd, inverter, position, ...args) {
    super(name, enb, bwd, fwd, ...args)
    this.inverter = inverter
    this.position = position
  }

  motion_ (mesg0, mesg1, mesg2) {
    const { inverter } = this
    // console.log(inverter)
    if (inverter.speed === 0) {
      this.motion = mesg0
    } else if (inverter.speed > 0) {
      this.motion = mesg1
    } else if (inverter.speed > 0) {
      this.motion = mesg2
    }
  }

  position_ () {
    const { position } = this
    // console.log(position)
  }
}

class Hoisting extends MVfd {
  motion_ () {
    super.motion_('motion-no', 'motion-up', 'motion-down')
  }

  position_ () {
    super.position_()
  }
}

module.exports = {
  Flap,
  Lock,
  Hoisting
}
