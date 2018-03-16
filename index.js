#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const program = require('commander')
const currentPackageJSON = require(path.join(process.cwd(), '/package.json'))
const speedBumpVersion = require('./package.json').version

const currentProjectVersion = currentPackageJSON.version

program
    .version(speedBumpVersion, '-v, --version')
    .option('-M, --major', 'Bump major version.')
    .option('-m, --minor', 'Bump minor version.')
    .option('-p, --patch', 'Bump patch version.')
    .parse(process.argv)
if (program.patch) {
  bump(currentProjectVersion, 2)
} else if (program.minor) {
  bump(currentProjectVersion, 1)
} else if (program.major) {
  bump(currentProjectVersion, 0)
} else {
  bump(currentProjectVersion, 2)
}

function splitVersion (versionString) {
  let versionArray = versionString.split('.').map(stringy => stringy * 1)
  return versionArray
}

function newPackageJSON (version) {
  let newVersionJSON = currentPackageJSON
  newVersionJSON.version = version
  let newVersionJSONString = JSON.stringify(newVersionJSON, null, 2)
  fs.writeFile('package.json', newVersionJSONString, (err) => {
    if (err) throw err
  })
}

function bump (versionString, index) {
  let version = splitVersion(versionString)
  version[index] += 1
  if (index === 0) {
    version[1] = 0
    version[2] = 0
  } else if (index === 1) {
    version[2] = 0
  }
  newPackageJSON(version.join('.'))
}
