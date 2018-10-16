'use strict'
const { exec } = require('child_process')

async function shAsync(cmd) {
  return new Promise(function (resolve, reject) {
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        reject(err)
      } else {
        resolve({ stdout, stderr })
      }
    })
  })
}

async function compile(path, contractName) {
  const { stdout, stderr } = await shAsync(`solc --combined-json abi,bin ${path}`)
  if (stderr) {
    console.log(stderr)
  }
  const result = JSON.parse(stdout)
  const contractInfo = result.contracts[`${path}:${contractName}`]
  return {
    abi: JSON.parse(contractInfo.abi),
    bytecode: '0x' + contractInfo.bin
  }
}

module.exports = compile
