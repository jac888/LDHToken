var LDHToken = artifacts.require("./LDHToken.sol"); //migration files goes to this directory

module.exports = function(deployer) {
  deployer.deploy(LDHToken, 1000000);
};
