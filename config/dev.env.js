'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://10.242.9.155:7300/mock/5b18f47961e8d30b3cb41cf6/admin"'
})
