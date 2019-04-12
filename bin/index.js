#!/usr/bin/env node

/**
 * @file tool entry file
 * @author Henry Yang
 */

const fs = require('fs')
const path = require('path')
const program = require('commander')
const config = require('./../package.json')
const shell = require('shelljs')
const tool = require('./../lib')

program.version(`v${config.version}`)
  .option('-o, --output [path]', 'Directory of output')

// Initialize project
program.command('init')
  .description('Initialize Project')
  .action(() => {
    const resolvedPath = path.resolve(process.cwd(), program.output || './')
    const filename = `${resolvedPath}/package.json`
    const pkg = require(filename)
    const shellScript = `
      ${ pkg ? '' : 'npm init -y' }
      
    `

    shell.exec(
      shellScript,
      error => {
        if (error) {
          console.error(`exec error: ${error}`)
          return
        }

        tool(resolvedPath)

        /**
         * write config to package.json
         */
        pkg.scripts.release = "standard-version"
        pkg.scripts.lint = "eslint ."

        pkg.husky = {
          "hooks": {
            "pre-commit": "lint-staged",
            "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
          }
        }

        pkg['lint-staged'] = {
          "linters": {
            "src/**/*.js": [
              "npm run lint",
              "git add ."
            ]
          }
        }

        fs.writeFile(filename, JSON.stringify(pkg, null, 2), function (err) {
          if (err) return console.log(`write package.json error. ${err}`)
        })
      }
    )
  })

program.parse(process.argv)
