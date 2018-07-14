var LDHToken = artifacts.require('./LDHToken.sol');

contract('LDHToken', function(accounts){ //can use one var using @ mutiple tests for contract
	var LDHTokenTotalSupply = 1000000;
	var testTransferAmount  = 25000;
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
			assert.equal(totalSupply.toNumber(),LDHTokenTotalSupply,`total supply is matching? ${totalSupply}`);
			console.log(totalSupply.toNumber());
		});
	});

	it('check admin token balance when contract is deployed', function() {
		return LDHToken.deployed().then(function (instance) {
			TokenInstance = instance;
			return TokenInstance.balanceOf(accounts[0]);
		}).then(function (adminBalance){
			assert.equal(adminBalance.toNumber(),LDHTokenTotalSupply,`total admin balance is : ${adminBalance.toNumber()}`);
			console.log(adminBalance.toNumber());
		});
	});

	it ('transfer token ownership', function(){
		return LDHToken.deployed().then(function(instance){
			tokenInstance = instance;
			return tokenInstance.transfer.call(accounts[1],999999999999);
		}).then(assert.fail).catch(function (error){
			console.log(`error msg is : ${error.message}`);
			assert(error.message.indexOf("revert") >= 0,'error message must contain revert!');
			return TokenInstance.transfer(accounts[1], testTransferAmount, { from: accounts[0]});
		}).then(receipt => {
			assert.equal(receipt.logs.length,1,'got event length!');
			assert.equal(receipt.logs[0].event,'Transfer','should be the "Transfer" event');
			assert.equal(receipt.logs[0].args._from, accounts[0], 'should be the "Transfer" event');
			assert.equal(receipt.logs[0].args._to, accounts[1], 'should be the "Transfer" event');
			assert.equal(receipt.logs[0].args._value, testTransferAmount, `transfer amount not matching ${testTransferAmount}`);
			return TokenInstance.balanceOf(accounts[1]);		
		}).then(balance => {
			assert(balance.toNumber(),testTransferAmount,'add the amount to the address one');
			console.log(`deduct balance from accounts zero (sender) to accounts one (receipt) is : ${balance}`);
			return TokenInstance.balanceOf(accounts[0]);
		}).then(balance => {
			console.log(`accounts zero (sender) balance is : ${balance}`);
			assert(balance.toNumber(),(LDHTokenTotalSupply - testTransferAmount ),'add the amount to the address one');
		}); 
	})

});