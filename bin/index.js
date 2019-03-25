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
    shell.exec(
      `
        npm i commander -S
        npm i eslint babel-eslint husky lint-staged standard-version @commitlint/cli @commitlint/config-conventional -D
      `,
      error => {
        if (error) {
          console.error(`exec error: ${error}`)
          return
        }

        const resolvedPath = path.resolve(process.cwd(), program.output || './')

        tool(resolvedPath)

        /**
         * write config to package.json
         */
        const filename = `${resolvedPath}/package.json`
        const pkg = require(filename)

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
