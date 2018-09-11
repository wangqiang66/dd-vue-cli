/**
 * author: wangqiang
 * function: 验证项目名称
 */
const blackList = [
  'node_modules',
  'static',
  'dist',
  'config',
  'build',
  'src'
]
module.exports = function (name) {
  const errors = []
  const warnings = []

  if (name === null) {
    errors.push('name cannot be null')
    return done(warnings, errors)
  }

  if (name === undefined) {
    errors.push('name cannot be undefined')
    return done(warnings, errors)
  }

  if (typeof name !== 'string') {
    errors.push('name must be a string')
    return done(warnings, errors)
  }

  if (!name.length) {
    errors.push('项目名的长度不能为空')
  }

  if (name.match(/^\./)) {
    errors.push('项目名的不能包含.')
  }

  if (name.match(/^_/)) {
    errors.push('项目名的不能以_开头')
  }
  if (name.trim() !== name) {
    errors.push('项目名的不能包含空格')
  }

  if (name.toLocaleLowerCase() !== name) {
    warnings.push('项目名最好是小写字母')
  }

  if (/[~'!()*]/.test(name.split('/').slice(-1)[0])) {
    warnings.push('项目名最后字母不要包含特殊字符~\'!()*')
  }

  if (name.length > 50) {
    warnings.push('项目名不要太长')
  }

  if (encodeURIComponent(name) !== name) {
    warnings.push('项目名包含不友好的字符')
  }

  blackList.forEach(function (blacklistedName) {
    if (name.toLowerCase() === blacklistedName) {
      errors.push(blacklistedName + '这个项目名被加入黑名单，请换一个')
    }
  })
  return done(warnings, errors)
}

var done = function (warnings, errors) {
  var result = {
    validForNewPackages: errors.length === 0 && warnings.length === 0,
    validForOldPackages: errors.length === 0,
    warnings: warnings,
    errors: errors
  }
  if (!result.warnings.length) delete result.warnings
  if (!result.errors.length) delete result.errors
  return result
}
