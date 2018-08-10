var Identity = artifacts.require("./Identity.sol");

module.exports = function(deployer) {
  deployer.deploy(Identity, "0xb8918494b24862b2b9dc7cc2c3e9a41893d8d4b6");
};
