/**
 * @file lib entry
 * @author Henry Yang
 */

const fs = require('fs')
const dirMap = require('./dirMap')

function processDir(path, setting) {
  setting.forEach(item => {
    const _path = `${path}/${item.name}`

    // if children is not exist, it's a file
    if (!item.children) {
      fs.writeFileSync(_path, item.tpl || '', 'utf-8')
    } else {
      fs.mkdirSync(_path)
      processDir(_path, item.children)
    }
  })
}

module.exports = function (path) {
  try {
    // confirm whether target path is existed
    fs.accessSync(path, fs.constants.R_OK)
  } catch (e) {
    fs.mkdirSync(path)
  } finally {
    processDir(path, dirMap)
  }
}
