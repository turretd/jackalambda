/* eslint-disable no-global-assign */
require = require('esm')(module, { mode: 'auto' })
module.exports.handler = require('./handler').handlePost
