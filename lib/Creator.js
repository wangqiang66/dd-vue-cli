/**
 * 创建文件
 */
const home = require('user-home')
const logger = require('./utils/logger')
const generate = require('./generate')
const path = require('path')
const ora = require('ora')
const download = require('download-git-repo')

module.exports = class Creator {
  constructor (projectName, targetDir) {
    this.options = {}
    this.projectName = projectName
    this.targetDir = targetDir
  }

  create (options) {
    this.options = options
    this.run()
  }
  run () {
    const template = this.options.template
    this.downloadAndGenerate(template)
  }

  downloadAndGenerate(template) {
  const tmp = path.join(home, '.vue-templates', template.replace(/^(?:.*):([^:#$]+)(?:#.*|$)$/, '$1'))
    const projectName = this.projectName
    const spinner = ora("downloading template");
    spinner.start();
    download(template, tmp, {clone: false}, err => {
        if (err) {
            logger.fatal("download template [" + template + "] error ", err);
        }
        const to = this.targetDir
        // logger.success('Generated "%s".', name);
        generate(projectName, tmp, to, err => {
          if (err) {
              logger.fatal(err);
          } else {
              logger.success('Generated "%s".', projectName)
          }
        }, this.options)
    })
  }
}