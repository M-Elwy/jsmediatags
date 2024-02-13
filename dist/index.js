
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./jsmediatags.cjs.production.min.js')
} else {
  module.exports = require('./jsmediatags.cjs.development.js')
}
