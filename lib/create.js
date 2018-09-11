const path = require("path");
const validateProjectName = require('./utils/validateName')
const fs = require('fs-extra')
const {clearConsole} = require('./utils/clearConsole')
const Creator = require('./Creator')
const inquirer = require('inquirer')
const chalk = require('chalk')

async function create (projectName, option) {
  const cwd = process.cwd()
  if (!projectName || projectName === '.') {
    projectName = path.relative('../', cwd)
  }
  const targetDir = path.resolve(cwd, projectName)
  const result = validateProjectName(projectName)
  
  if (!result.validForNewPackages) {
    console.error(chalk.red(`Invalid project name: "${projectName}"`))
    result.errors && result.errors.forEach(err => {
      console.error(chalk.red(err))
    })
    console.warn(chalk.orange(`Invalid project name: "${projectName}"`))
    result.warnings && result.warnings.forEach(err => {
      console.warn(chalk.red(err))
    })
    process.exit(1)
  }
  
  if (fs.existsSync(targetDir)) {
    if (option.force) {
      await fs.remove(targetDir)
    } else {
      await clearConsole()
      
      const { action } = await inquirer.prompt([
        {
          name: 'action',
          type: 'list',
          message: `Target directory ${chalk.cyan(targetDir)} already exists. Pick an action:`,
          choices: [
            { name: 'Overwrite', value: 'overwrite' },
            { name: 'Merge', value: 'merge' },
            { name: 'Cancel', value: false }
          ]
        }
      ])
      if (!action) {
        return
      } else if (action === 'overwrite') {
        console.log(`\nRemoving ${chalk.cyan(targetDir)}...`)
        await fs.remove(targetDir)
      }
    }
  }
  const creator = new Creator(projectName, targetDir)
  creator.create(option)
}

module.exports = (...args) => {
  return create(...args).catch(err => {
    // stopSpinner(false) // do not persist
    // error(err)
    process.exit(1)
  })
}

// var error = 