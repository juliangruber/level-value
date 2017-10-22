
# level-value

Subscribe to a [leveldb](http://leveldb.org/) value.

Exposes `put`, `batch` and `del` changes through one unified interface.

## Usage

```js
const subscribe = require('level-value')

subscribe(db, 'key', value => {
  console.log(value)  
})
sub.off()

// Alternative EventEmitter API

const sub = subscribe(db, 'key')
sub.on('value', console.log)
sub.off()
```

## Install

```bash
$ npm install level-value
```

## API

### subscribe(db, key[, fn])
### #on('value', fn)
### #off()

## License

MIT
