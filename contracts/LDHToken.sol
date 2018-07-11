pragma solidity ^0.4.19;

contract LDHToken {
	uint256 public totalSupply; 
	mapping (address => uint256) public balanceOf; 
	
	function LDHToken (uint256 _initialSupply) public {
		balanceOf[msg.sender] = _initialSupply;
		totalSupply = _initialSupply;
	}	
	
	
}


