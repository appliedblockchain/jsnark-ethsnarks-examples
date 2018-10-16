// Source: https://github.com/JacobEberhardt/ZoKrates / https://github.com/HarryR/ethsnarks/

pragma solidity ^0.4.24;
pragma experimental ABIEncoderV2;

import "./Verifier.sol";

contract Test
{
  using Verifier for Verifier.VerifyingKey;
  using Verifier for Verifier.Proof;


	event Verified();


  function verify(Verifier.VerifyingKey vk, Verifier.Proof proof, uint256[] input) public returns (bool) {
    bool isOk = Verifier.Verify(vk, proof, input);
    if (isOk) {
      emit Verified();
    }
    return isOk;
  }
}
