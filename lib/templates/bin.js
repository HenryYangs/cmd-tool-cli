/**
 * @file template of bin/index.js
 * @author Henry Yang
 */

module.exports = 
`
#!/usr/bin/env node

const program = require('commander')
const config = require('./../package.json')
const tool = require('./../lib')

program.version('v' + config.version)
  .parse(process.argv)

tool(program.output || './')
`
