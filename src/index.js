const config = require('./paths')
const dev = require('./dev')
const prod = require('./prod')

const ENV = process.env.NODE_ENV || process.env.ENV || 'PRO'

module.exports = {
  set: config.set,
  get: config.get,
  dev: dev,
  prod: prod,
  config: ENV === 'DEV' ? dev : prod
}