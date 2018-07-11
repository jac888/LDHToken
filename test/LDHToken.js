var LDHToken = artifacts.require('./LDHToken.sol');

contract('LDHToken', function(accounts){
	it('Total supply is set upon contract deployed', function() {
		return LDHToken.deployed().then(function (instance) {
			TokenInstance = instance;
			return TokenInstance.totalSupply();
		}).then(function (totalSupply){
			assert.equal(totalSupply,1000001);
		})
	})
})