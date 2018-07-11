var Migrations = artifacts.require("./Migrations.sol"); //migration files goes to this directory

module.exports = function(deployer) {
  deployer.deploy(Migrations);
};
