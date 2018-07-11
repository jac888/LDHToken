var LDHToken = artifacts.require('./LDHToken.sol');

contract('LDHToken', function(accounts){ //can use one var using @ mutiple tests for contract
	var TokenInstance;

	it('Checking contact name with correct value', function () {
		return LDHToken.deployed().then(function(instance){
			TokenInstance = instance;
			return TokenInstance.name();
		}).then(function(name){
			assert.equal(name,'LDHToken','has correct name');
			console.log(`Token name : ${name}`);
			return TokenInstance.symbol();
		}).then(function(symbol){
			assert.equal(symbol,'LDH','has correct symbol');
			console.log(`symbol : ${symbol}`);
			return TokenInstance.standard();
		}).then(function(standard){
			assert.equal(standard,'ERC20 LDH Token V1.0','has correct standard');
			console.log(`standard : ${standard}`);		
		});
	});

	it('Total supply is set upon contract deployed', function() {
		return LDHToken.deployed().then(function (instance) {
			TokenInstance = instance;
			return TokenInstance.totalSupply();
		}).then(function (totalSupply){
			assert.equal(totalSupply.toNumber(),1000000,`total supply is matching? ${totalSupply}`);
			console.log(totalSupply.toNumber());
		});
	});

	it('check admin token balance when contract is deployed', function() {
		return LDHToken.deployed().then(function (instance) {
			TokenInstance = instance;
			return TokenInstance.balanceOf(accounts[0]);
		}).then(function (adminBalance){
			assert.equal(adminBalance.toNumber(),1000000,`total admin balance is : ${adminBalance.toNumber()}`);
			console.log(adminBalance.toNumber());
		});
	});

	it ('transfer token ownership', function(){
		return LDHToken.deployed().then(function(instance){
			tokenInstance = instance;
			return tokenInstance.transfer.call(accounts[1],999999999999);
		}).then(assert.fail).catch(function (error){
			console.log(`error msg is : ${error.message}`);
			assert(error.message.indexOf("Exception") >= 0,'error message must contain revert!');
		}); 
	})

});