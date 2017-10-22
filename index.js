const { EventEmitter } = require('events')

module.exports = (db, key, fn) => {
  const sub = new Subscription(db, key)
  if (fn) sub.on('value', fn)
  return sub
}

class Subscription extends EventEmitter {
  constructor (db, key) {
    super()

    this._key = key
    this._db = db

    this.onput = this.onput.bind(this)
    this.ondel = this.ondel.bind(this)
    this.onbatch = this.onbatch.bind(this)

    db.on('put', this.onput)
    db.on('del', this.ondel)
    db.on('batch', this.onbatch)

    db.get(key, (_, value) => {
      this.emit('value', value)
    })
  }

  onput (key, value) {
    if (key === this._key) this.emit('value', value)
  }

  ondel (key) {
    if (key === this._key) this.emit('value', undefined)
  }

  onbatch (ops) {
    for (const op of ops) {
      if (op.key === this._key) this.emit('value', op.value)
    }
  }

  off () {
    this._db.removeListener('put', this.onput)
    this._db.removeListener('del', this.ondel)
    this._db.removeListener('batch', this.onbatch)
  }
}
