var LDHToken = artifacts.require('./LDHToken.sol');

contract('LDHToken', function(accounts){ //can use one var using @ mutiple tests for contract
	var LDHTokenTotalSupply = 1000000;
	var testTransferAmount  = 25000;
	var delegateAmount = 200;
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

	it('approve tokens for delegated transfer on account one for ' + delegateAmount.toString() + ' tokens', () => {
		return LDHToken.deployed().then((instance) => {
			TokenInstance = instance;
			return TokenInstance.approve.call(accounts[1],delegateAmount);
		}).then((res)=>{
			assert.equal(res,true,'approved!');
			return TokenInstance.approve(accounts[1],delegateAmount, {from: accounts[0]});
		}).then(receipt => {
			assert.equal(receipt.logs.length,1,'got event length!');
			assert.equal(receipt.logs[0].event,'Approval','should be the "Approval" event');
			assert.equal(receipt.logs[0].args._owner, accounts[0], 'should be the "Approval" event authorized by');
			assert.equal(receipt.logs[0].args._spender, accounts[1], 'should be the "Approval" event authorized to');
			assert.equal(receipt.logs[0].args._value, delegateAmount, `transfer amount not matching ${delegateAmount}`);
			return TokenInstance.allowance(accounts[0],accounts[1]);
		}).then(allowance => {
			assert.equal(allowance.toNumber(),delegateAmount,'not matching allowance because value is : ' + allowance.toString());
		});
	})

	it('handles delegated transfer', () => {
		return LDHToken.deployed().then(instance => {
			TokenInstance = instance;
			fromAccount = accounts[2];
			toAccount = accounts[3];
			spendingAccount = accounts[4];
			//transfer some token to fromAccount
			return TokenInstance.transfer(fromAccount,100, { from: accounts[0]});
		}).then(receipt => {		
			return TokenInstance.approve(spendingAccount, 10, { from: fromAccount})
		}).then(receipt => {
			return TokenInstance.transferFrom(fromAccount, toAccount, 9999 ,{ from: spendingAccount});
		}).then(assert.fail).catch(error => {
			//console.log(`error msg is : ${error.message}`);
			assert(error.message.indexOf("revert") >= 0, 'exceeding acount balances!');
			return TokenInstance.transferFrom(fromAccount, toAccount, 20, { from : spendingAccount})
		}).then(assert.fail).catch(error => {
			//console.log(`error msg is : ${error.message}`);
			assert(error.message.indexOf("revert") >= 0, 'exceeding acount approved balances!');
			return TokenInstance.allowance(fromAccount,spendingAccount);
		}).then(allowance => {
			console.log("allowance one is : " + allowance.toNumber());
			return TokenInstance.allowance(spendingAccount,fromAccount);
		}).then(allowance => {
			//console.log("allowance two is : " + allowance.toNumber());
			return TokenInstance.transferFrom.call(fromAccount,toAccount,10,{from: spendingAccount});
		}).then(success => {
			assert(success,true);
			return TokenInstance.transferFrom(fromAccount,toAccount,10,{from: spendingAccount});
		}).then(receipt => {
			assert.equal(receipt.logs.length,1,'triggers event length!');
			assert.equal(receipt.logs[0].event,'Transfer','should be the "Transfer" event');
			assert.equal(receipt.logs[0].args._from, fromAccount, 'should be the "Transfer" event authorized by');
			assert.equal(receipt.logs[0].args._to, toAccount, 'should be the "Transfer" event authorized to');
			assert.equal(receipt.logs[0].args._value, 10, `Transfer amount not matching ${10}`);
			return TokenInstance.balanceOf(fromAccount);
		}).then(balance => {
			console.log(`fromaccount balance now : ${balance}`);
			assert.equal(balance.toNumber(),90,'deduct 10 to fromAccount');
			return TokenInstance.balanceOf(toAccount);
		}).then(balance => {
			console.log(`toaccount balance now : ${balance}`);
			assert.equal(balance.toNumber(),10,'added 10 to toAccount');
		});
	})
});