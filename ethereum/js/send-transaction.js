async function sendTransaction(web3, chainId, to, data, gas = '8000000') {
  const txParams = {
    nonce: '0',
    gasPrice: '0',
    to,
    gas,
    data,
    chainId
  }
  const account = web3.eth.accounts.create()
  const tx = await account.signTransaction(txParams)
  return web3.eth.sendSignedTransaction(tx.rawTransaction)
}

module.exports = sendTransaction
