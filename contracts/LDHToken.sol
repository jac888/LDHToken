pragma solidity ^0.4.19;

/**
 * The LDHToken contract does this and that...
 */

//constructor and function a same name
//set total supply of LDHToken
//read total supply of LDHToken
contract LDHToken {

	uint256 public totalSupply; //public to be visible & with pubic there will be a setter by solidity 

	function LDHToken () public {
		totalSupply = 1000000;
	}	
}


