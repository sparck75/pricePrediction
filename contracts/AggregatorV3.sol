// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";


contract AggregatorV3 {

    AggregatorV3Interface internal priceFeed;

    constructor(address _PairAddress) {
        priceFeed = AggregatorV3Interface(_PairAddress);
    }

    function getLatestPrice() public view returns (uint80, int, uint, uint, uint80) {
        (
            uint80 roundID, 
            int price,
            uint startedAt,
            uint timeStamp,
            uint80 answeredInRound
        ) = priceFeed.latestRoundData();
        return (roundID, price, startedAt, timeStamp, answeredInRound);
    }
}
