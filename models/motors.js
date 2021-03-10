const EventEmitter = require('events')
const format = require('date-fns/format')

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
      if (arg.interlock === undefined) {
        arg.interlock = Boolean(1)
      }

      if (Boolean(arg.status) !== arg.interlock && !arg.flag) {
        if (!enb.status && bwd.status ^ fwd.status) {
          arg.flag = true
          this.diagnostic('diag-01: ' + arg.label)
        }
      } else if (Boolean(arg.status) === arg.interlock || enb.status) {
        arg.flag = false
      }
    })

    // this.args.forEach(arg => {
    //   if (!arg.status && !arg.flag) {
    //     if (!enb.status && bwd.status ^ fwd.status) {
    //       arg.flag = true
    //       this.diagnostic('diag-01: ' + arg.label)
    //     }
    //   } else if (arg.status || enb.status) {
    //     arg.flag = false
    //   }
    // })

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
    this.motion = 'motion-err'
    this.position = 'position-err'
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
        this.diagnostic('diag-02: motion error')
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
        this.diagnostic('diag-03: position error')
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

class Door extends Actuator {
  constructor (name, enb, bwd, fwd, p1, p2, m1, m2, ...args) {
    super(name, enb, bwd, fwd, p1, p2, m1, m2, ...args)

    this.closed = [Object.assign({}, p1), Object.assign({}, p2)]
    this.closed[0].interlock = Boolean(1)
    this.closed[1].interlock = Boolean(0)

    this.opened = [Object.assign({}, p1), Object.assign({}, p2)]
    this.opened[0].interlock = Boolean(0)
    this.opened[1].interlock = Boolean(1)
  }

  motion_ () {
    const { m1, m2 } = this

    this.close = Boolean(m1.status && !m2.status)
    this.open = Boolean(m2.status && !m1.status)

    super.motion_('motion-no', 'motion-close', 'motion-open')
  }

  position_ () {
    const { p1, p2 } = this

    this.closed[0].status = p1.status
    this.closed[1].status = p2.status

    this.opened[0].status = p1.status
    this.opened[1].status = p2.status

    super.position_('position-no', 'position-closed', 'position-opened')
  }
}

class Flap extends Actuator {
  constructor (name, enb, bwd, fwd, p1, p2, m1, m2, ...args) {
    super(name, enb, bwd, fwd, p1, p2, m1, m2, ...args)

    this.high = [Object.assign({}, p1), Object.assign({}, p2)]
    this.high[0].interlock = Boolean(1)
    this.high[1].interlock = Boolean(0)

    this.low = [Object.assign({}, p1), Object.assign({}, p2)]
    this.low[0].interlock = Boolean(0)
    this.low[1].interlock = Boolean(1)
  }

  motion_ () {
    const { m1, m2 } = this

    this.up = Boolean(m1.status && !m2.status)
    this.down = Boolean(m2.status && !m1.status)

    super.motion_('motion-no', 'motion-up', 'motion-down')
  }

  position_ () {
    const { p1, p2 } = this

    this.high[0].status = p1.status
    this.high[1].status = p2.status

    this.low[0].status = p1.status
    this.low[1].status = p2.status

    super.position_('position-no', 'position-high', 'position-low')
  }
}

class Lock extends Actuator {
  constructor (name, enb, bwd, fwd, p1, p2, m1, m2, ...args) {
    super(name, enb, bwd, fwd, p1, p2, m1, m2, ...args)

    this.locked = [Object.assign({}, p1), Object.assign({}, p2)]
    this.locked[0].interlock = Boolean(1)
    this.locked[1].interlock = Boolean(0)

    this.unlocked = [Object.assign({}, p1), Object.assign({}, p2)]
    this.unlocked[0].interlock = Boolean(0)
    this.unlocked[1].interlock = Boolean(1)
  }

  motion_ () {
    const { m1, m2 } = this

    this.lock = Boolean(m1.status && !m2.status)
    this.unlock = Boolean(m2.status && !m1.status)

    super.motion_('motion-no', 'motion-lock', 'motion-unlock')
  }

  position_ () {
    const { p1, p2 } = this

    this.locked[0].status = p1.status
    this.locked[1].status = p2.status

    this.unlocked[0].status = p1.status
    this.unlocked[1].status = p2.status

    super.position_('position-no', 'position-locked', 'position-unlocked')
  }
}

/**
 * VFD motors
 */

class MVfd extends Motor {
  constructor (
    name,
    enb,
    bwd,
    fwd,
    inverter,
    // position,
    inputs,
    outputs,
    ...args
  ) {
    super(name, enb, bwd, fwd, ...args)
    this.inverter = inverter
    // this.position = position
    this.inputs = inputs
    this.outputs = outputs
    this.motion = 'motion-err'
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

  // position_ () {
  //   const { position } = this
  //   console.log(position)
  // }
}

class Hoisting extends MVfd {
  constructor (
    name,
    enb,
    bwd,
    fwd,
    inverter,
    position,
    inputs,
    outputs,
    ...args
  ) {
    super(name, enb, bwd, fwd, inverter, inputs, outputs, ...args)
    this.position = position
  }

  motion_ () {
    super.motion_('motion-no', 'motion-up', 'motion-down')
  }
}

class Rotation extends MVfd {
  constructor (
    name,
    enb,
    bwd,
    fwd,
    inverter,
    position,
    inputs,
    outputs,
    ...args
  ) {
    super(name, enb, bwd, fwd, inverter, inputs, outputs, ...args)
    this.position = position
  }

  motion_ () {
    super.motion_('motion-no', 'motion-forward', 'motion-backward')
  }
}

class Traveling extends MVfd {
  constructor (
    name,
    enb,
    bwd,
    fwd,
    inverter,
    position,
    inputs,
    outputs,
    ...args
  ) {
    super(name, enb, bwd, fwd, inverter, inputs, outputs, ...args)
    this.position = position
  }

  motion_ () {
    super.motion_('motion-no', 'motion-forward', 'motion-backward')
  }
}

class Silomat extends MVfd {
  constructor (name, enb, bwd, fwd, inverter, inputs, outputs, sil, ...args) {
    super(name, enb, bwd, fwd, inverter, inputs, outputs, ...args)
    this.sil = sil
  }

  motion_ () {
    const { sil } = this
    const T2 = sil[0].status
    const TRA = sil[1].status
    const TRB = sil[2].status
    const KCS = sil[3].status
    const KCV = sil[4].status
    const KCH = sil[5].status

    if (T2) {
      super.motion_('motion-no', 'motion-forward', 'motion-backward')
    } else if (TRA && KCS) {
      this.motion = 'motion-up'
    } else if (TRA && KCH ^ KCV) {
      this.motion = 'motion-centering-open'
    } else if (TRB && KCS) {
      this.motion = 'motion-down'
    } else if (TRB && KCH ^ KCV) {
      this.motion = 'motion-centering-close'
    } else {
      this.motion = 'motion-no'
    }
  }
}

module.exports = {
  Door,
  Flap,
  Lock,
  Hoisting,
  Rotation,
  Traveling,
  Silomat
}
