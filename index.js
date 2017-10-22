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

    if (typeof key === 'string') {
      db.get(key, (_, value) => {
        this.emit('value', value)
      })
    }
  }

  test (key) {
    return typeof this._key === 'string'
      ? this._key === key
      : this._key.test(key)
  }

  onput (key, value) {
    if (this.test(key)) this.emit('value', value)
  }

  ondel (key) {
    if (this.test(key)) this.emit('value', undefined)
  }

  onbatch (ops) {
    for (const op of ops) {
      if (this.test(op.key)) this.emit('value', op.value)
    }
  }

  off () {
    this._db.removeListener('put', this.onput)
    this._db.removeListener('del', this.ondel)
    this._db.removeListener('batch', this.onbatch)
  }
}
