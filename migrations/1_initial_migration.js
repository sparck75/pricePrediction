const AggregatorV3 = artifacts.require("AggregatorV3");
const pricePrediction = artifacts.require("pricePrediction");

module.exports = async function (deployer) {

  const accounts = await web3.eth.getAccounts();

  await deployer.deploy(AggregatorV3, '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419');
  const _AggregatorV3 = await AggregatorV3.deployed();

  await deployer.deploy(
    pricePrediction, _AggregatorV3.address, accounts[0], accounts[0], 1000000000000000,1000);

  const _pricePrediction = await pricePrediction.deployed();

};
