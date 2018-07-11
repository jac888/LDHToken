pragma solidity ^0.4.19;

contract LDHToken {
	string public name = "LDHToken";
	string public symbol = "LDH";
	string public standard = "ERC20 LDH Token V1.0";
	uint256 public totalSupply; 
	mapping (address => uint256) public balanceOf; 
	
	constructor(uint256 _initialSupply) public {
		balanceOf[msg.sender] = _initialSupply;
		totalSupply = _initialSupply;
	}	

	function transfer(address _to, uint256 _value) public returns(bool result) {
		//check if balance is enough to send.
		require(balanceOf[msg.sender] >= _value);
		//return a boolean

		//trnsfer event
	}
	
}


