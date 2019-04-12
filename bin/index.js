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
  .option('--no-git', 'Do not initialize with git')
  .option('--no-dep', 'Do not install any dependency')
  .parse(process.argv)

// Initialize project
program.command('init')
  .description('Initialize Project')
  .action(() => {
    const resolvedPath = path.resolve(process.cwd(), program.output || './')
    const filename = `${resolvedPath}/package.json`
    const shellScript = `
      cd ${resolvedPath}
      ${ program.git ? 'git init' : '' }
      npm init -y
      ${ program.dep ? `
          npm i commander -S
          npm i eslint babel-eslint husky lint-staged standard-version @commitlint/cli @commitlint/config-conventional -D
        `  : ''
      }
    `

    shell.exec(
      shellScript,
      error => {
        if (error) {
          console.error(`exec error: ${error}`)
          return
        }

        tool(resolvedPath)

        if (!program.dep) return
        /**
         * write config to package.json
         */
        let pkg = require(filename)

        delete pkg.scripts.test

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
