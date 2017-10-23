
# level-value

Subscribe to a [leveldb](http://leveldb.org/) value.

- exposes `put`, `batch` and `del` changes through one unified interface
- accepts RegExps
- performs an initial `get` for the value (except with RegExp)

## Usage

```js
const subscribe = require('level-value')

subscribe(db, 'key', value => {
  console.log(value)  
}).off()

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
