/**
 * @file structure of output
 * @author Henry Yang
 */

module.exports = [
  {
    name: 'bin',
    children: [
      {
        name: 'index.js',
        tpl: require('./templates/bin')
      }
    ]
  },
  {
    name: 'lib',
    children: [
      {
        name: 'index.js',
        tpl: require('./templates/lib')
      }
    ]
  },
  {
    name: 'index.js',
    tpl: require('./templates/index')
  },
  {
    name: 'commitlint.config.js',
    tpl: require('./templates/commitlint.config')
  },
  {
    name: '.gitignore',
    tpl: require('./templates/gitignore')
  },
  {
    name: '.eslintrc',
    tpl: require('./templates/eslintrc')
  },
  {
    name: '.eslintignore',
    tpl: require('./templates/eslintignore')
  },
  {
    name: 'README.md',
    tpl: require('./templates/readme')
  }
]
