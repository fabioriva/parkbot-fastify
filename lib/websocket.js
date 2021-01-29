const WebSocket = require('ws')
// import { v4 as uuid } from 'uuid'
// import actions from 'lib/actions'

function websocket (wsPath, fastify) {
  const { log, server } = fastify
  const wss = new WebSocket.Server({
    path: wsPath,
    server: server
  })
  wss.broadcast = function broadcast (channel, data) {
    wss.clients.forEach(function each (client) {
      if (client.readyState === WebSocket.OPEN && client.channel === channel) {
        client.send(JSON.stringify(data))
      }
    })
  }
  wss.on('connection', function connection (ws, req) {
    const client = req.headers['x-forwarded-for'].split(/\s*,\s*/)[0]
    // const client = req.socket.remoteAddress
    const { searchParams } = new URL(req.url, 'http://w.w')
    ws.isAlive = true
    ws.id = {} // uuid()
    ws.channel = searchParams.get('channel') // channel
    ws.on('pong', heartbeat)
    ws.on('message', async function incoming (message) {
      log.info('%s message %s', client, message)
      // // new
      // const response = await actions(message, s7def, s7obj)
      // ws.send(JSON.stringify({ message: { response } }))
    })
    log.info(
      '%s connect %s',
      client,
      `uuid: ${ws.id} channel: ${ws.channel} clients: ${wss.clients.size}`
    )
  })
  wss.on('close', function close () {
    clearInterval(interval)
  })
  const interval = setInterval(function ping () {
    wss.clients.forEach(function each (ws) {
      if (ws.isAlive === false) {
        return ws.terminate()
      }
      ws.isAlive = false
      ws.ping(noop)
    })
  }, 3000)
  return wss
}

function heartbeat () {
  this.isAlive = true
}

function noop () {}

module.exports = websocket
