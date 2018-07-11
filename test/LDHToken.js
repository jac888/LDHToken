var LDHToken = artifacts.require('./LDHToken.sol');

contract('LDHToken', function(accounts){ //can use one var using @ mutiple tests for contract
	var TokenInstance;

	it('Total supply is set upon contract deployed', function() {
		return LDHToken.deployed().then(function (instance) {
			TokenInstance = instance;
			return TokenInstance.totalSupply();
		}).then(function (totalSupply){
			assert.equal(totalSupply.toNumber(),1000000,`total supply is matching? ${totalSupply}`);
			console.log(totalSupply.toNumber());
		});
	})

	it('check admin token balance when contract is deployed', function() {
		return LDHToken.deployed().then(function (instance) {
			TokenInstance = instance;
			return TokenInstance.balanceOf(accounts[0]);
		}).then(function (adminBalance){
			assert.equal(adminBalance.toNumber(),1000000,`total admin balance is : ${adminBalance.toNumber()}`);
			console.log(adminBalance.toNumber());
		});
	})
})