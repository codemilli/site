const compression = require('compression')

module.exports = {
  server: {
    middleware: {
      0: compression()
    }
  }
}
