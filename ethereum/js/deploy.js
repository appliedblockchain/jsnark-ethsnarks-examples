const sendTransaction = require('./send-transaction')

async function deploy(web3, chainId, abi, bytecode) {
  const contract = new web3.eth.Contract(abi)
  const data = contract.deploy({ data: bytecode }).encodeABI()
  const receipt = await sendTransaction(web3, chainId, null, data)
  return receipt.contractAddress
}

module.exports = deploy
