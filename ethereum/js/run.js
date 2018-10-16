const assert = require('assert')
const compile = require('./compile')
const deploy = require('./deploy')
const path = require('path')
const Web3 = require('web3')
const sendTransaction = require('./send-transaction')

async function run() {
  if (process.argv.length !== 4) {
    console.log('Need exactly 2 arguments (path to vk, path to proof)')
    process.exit(1)
  }

  const tmpDir = process.env.TMP_DIR || '/tmp'

  // Initialise web3
  const web3 = new Web3(process.env.ETHEREUM_JSONRPC_ENDPOINT || 'http://localhost:8545/')
  const chainId = await web3.eth.net.getId()
  const addresses = await web3.eth.getAccounts()

  // Compile the contract
  const contractArtefacts = await compile(
    path.join(path.parse(module.filename).dir, '..', 'sol', 'Test.sol'),
    'Test'
  )

  // Deploy the contract
  const contractAddress = await deploy(
    web3,
    chainId,
    contractArtefacts.abi,
    contractArtefacts.bytecode
  )

  // Verify proof on chain
  const contract = new web3.eth.Contract(contractArtefacts.abi, contractAddress)
  const vk = require(process.argv[2])
  const { A, B, C, input } = require(process.argv[3])
  const proofTxObj = contract.methods.verify(vk, { A, B, C }, input)
  const data = proofTxObj.encodeABI()
  const receipt = await sendTransaction(web3, chainId, contractAddress, data)
  assert(receipt.status)
  assert(receipt.logs[0].topics[0] === web3.utils.keccak256('Verified()'))
  return receipt.gasUsed
}

run().then(gas => console.log(`Proof verified. Cost of verification: ${gas} gas.`))
