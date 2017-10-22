const { test } = require('tap')
const level = require('level-mem')
const subscribe = require('.')

test('no initial value', t => {
  const db = level()
  const sub = subscribe(db, 'key')
  sub.once('value', value => {
    t.equal(value, undefined)
    sub.once('value', value => {
      t.equal(value, 'value')
      t.end()
    })
    db.put('key', 'value')
  })
})

test('initial value', t => {
  const db = level()
  db.put('key', 'value', err => {
    t.error(err)

    const sub = subscribe(db, 'key')
    sub.once('value', value => {
      t.equal(value, 'value')
      sub.once('value', value => {
        t.equal(value, 'value 2')
        t.end()
      })
      db.put('key', 'value 2')
    })
  })
})

test('del', t => {
  const db = level()
  db.put('key', 'value', err => {
    t.error(err)

    const sub = subscribe(db, 'key')
    sub.once('value', value => {
      t.equal(value, 'value')
      sub.once('value', value => {
        t.equal(value, undefined)
        t.end()
      })
      db.del('key')
    })
  })
})

test('batch put', t => {
  const db = level()
  const sub = subscribe(db, 'key')
  sub.once('value', value => {
    t.equal(value, undefined)
    sub.once('value', value => {
      t.equal(value, 'value')
      t.end()
    })
    db
      .batch()
      .put('key', 'value')
      .write()
  })
})

test('batch del', t => {
  const db = level()
  db.put('key', 'value', err => {
    t.error(err)

    const sub = subscribe(db, 'key')
    sub.once('value', value => {
      t.equal(value, 'value')
      sub.once('value', value => {
        t.equal(value, undefined)
        t.end()
      })
      db
        .batch()
        .del('key')
        .write()
    })
  })
})

test('shorthand api', t => {
  const db = level()
  subscribe(db, 'key', value => {
    t.equal(value, undefined)
    t.end()
  })
})

test('unsubscribe', t => {
  const db = level()
  const sub = subscribe(db, 'key')
  sub.once('value', value => {
    sub.off()
    sub.on('value', () => t.fail())
    db.put('key', 'value', err => {
      t.error(err)
      t.end()
    })
  })
})

test('RegExp', t => {
  const db = level()
  const sub = subscribe(db, /^k/)
  sub.once('value', value => {
    t.equal(value, 'value')
    t.end()
  })
  db.put('key', 'value')
})
