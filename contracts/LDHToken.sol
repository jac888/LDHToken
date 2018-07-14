pragma solidity ^0.4.19;


contract LDHToken {
	string public name = "LDHToken";
	string public symbol = "LDH";
	string public standard = "ERC20 LDH Token V1.0";
	uint256 public totalSupply; 

	mapping (address => uint256) public balanceOf; 
	mapping (address => mapping (address => uint256)) public allowance;

	event Transfer (
		address indexed _from,
		address indexed _to,
		uint256 _value
	);

	event Approval(
		address indexed _owner,
		address indexed _spender,
		uint256 _value
	);
	
	
	constructor(uint256 _initialSupply) public {
		balanceOf[msg.sender] = _initialSupply;
		totalSupply = _initialSupply;
	}	

	function transfer(address _to, uint256 _value) public returns(bool result) {
		//check if balance is enough to send.
		require(balanceOf[msg.sender] >= _value);
		//transfer balance 
		balanceOf[msg.sender] -= _value; //must remember to deduct from sender!!!
		balanceOf[_to] += _value;
		//transfer event
		emit Transfer(msg.sender, _to, _value);
		return true;
	}

	//delegated Transfer:
	function approve (address _spender, uint256 _value) public returns(bool success) {
		//set allowance from owner to spender with desired token amount
		allowance[msg.sender][_spender] = _value;

		//fire approve event
		emit Approval(msg.sender, _spender, _value);

		//finally approved
		return true;
	}

	function transferFrom (address _from, address _to, uint256 _value) public returns(bool success) 
	{
		//balance must greater then transferring value(amount)		
		require (_value <= balanceOf[_from]);

		//transfer value must not greater then allowance
		require (_value <= allowance[_from][msg.sender]);
		
		//change balance
		balanceOf[_from] -= _value;
		balanceOf[_to] += _value;

		//update allowance
		allowance[_from][msg.sender] -= _value;
		
		//event 
		emit Transfer(_from, _to, _value);
		return true;
	}
	
}


