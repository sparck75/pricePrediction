const pricePredictionABI = require('../build/contracts/pricePrediction.json')["abi"];
const pricePredictionAddress = require('../build/contracts/pricePrediction.json')["networks"]["1"]["address"];
const pricePredictionContract = new web3.eth.Contract(pricePredictionABI, pricePredictionAddress);

const BN = require('bignumber.js')

require('chai').use(require('chai-bignumber')(BN)).use(require('chai-as-promised')).should();

contract ('', async([deployer, userTest1, userTest2, userTest3, userTest4, userTest5]) => {

    beforeEach(async ()=> {
        this.betAmount = await web3.utils.toWei('1', 'ether');
    })

    describe('', async () => {
        
        let currentEpoch;

        let userTest1Balance;
        let userTest2Balance;

        let isClaimable;
        let isRefundable;

        let genesisLockOnce;
        let genesisStartOnce;

        let getUserRoundsLength;
        let getOracleCalled;


        it('Start Gensis' ,async ()=> {

            userTest1Balance = await web3.eth.getBalance(userTest1);
            console.log('userTest1Balance : ', userTest1Balance);

            userTest2Balance = await web3.eth.getBalance(userTest2);
            console.log('userTest2Balance : ', userTest2Balance);

            //Gensis Start Round
            console.log('Start Gensis Round ....');
            await pricePredictionContract.methods.gensisStartPrediction().send({from : deployer , gas: 5000000}).should.be.fulfilled;
            currentEpoch = await pricePredictionContract.methods.currentEpoch().call();
            console.log('currentEpoch : ' ,currentEpoch);
            console.log('Gensis Round Started ....');

            //BetBear
            console.log(`Bet for epoch ${currentEpoch}`)
            await pricePredictionContract.methods.betBearPrediction(Number(currentEpoch)).send({from : userTest1 , value: this.betAmount , gas: 5000000});
            console.log(`Bet done for epoch ${currentEpoch}`)

            userTest1Balance = await web3.eth.getBalance(userTest1);
            console.log('userTest1Balance after BET : ', userTest1Balance);

            //BetBull
            console.log(`Bet for epoch ${currentEpoch}`)
            await pricePredictionContract.methods.betBullPrediction(Number(currentEpoch)).send({from : userTest2 , value: this.betAmount , gas: 5000000});
            console.log(`Bet done for epoch ${currentEpoch}`)

            //Gnesis Lock Round
            console.log('locking Gensis Round ....');
            await pricePredictionContract.methods.gensisLockRound().send({from : deployer , gas: 500000}).should.be.fulfilled;;
            currentEpoch = await pricePredictionContract.methods.currentEpoch().call();
            console.log('currentEpoch : ' ,currentEpoch);
            console.log('Gensis Round Locked ....');

            //Execute Round
            console.log(`Executing for ${currentEpoch}`)
            await pricePredictionContract.methods.executeRound().send({from : deployer , gas: 500000});
            currentEpoch = await pricePredictionContract.methods.currentEpoch().call();
            console.log(`Executing done for ${currentEpoch}`)

            //Claim Reward for userTest1
            console.log('Claiming ....');
            let finalEpochsForuserTest1 = [];

            getUserRoundsLength = await pricePredictionContract.methods.getUserRoundsLength(userTest1).call();
            console.log('getUserRoundsLength userTest1 : ', getUserRoundsLength);

            for(let i = 0; i < getUserRoundsLength ; i++){

                let selectEpoch =  await pricePredictionContract.methods.userRounds(userTest1, i).call();

                getOracleCalled = await pricePredictionContract.methods.getOracleCalled(selectEpoch).call();
                console.log(`getOracleCalled for ${selectEpoch}`, getOracleCalled);

                isClaimable = await pricePredictionContract.methods.isClaimable(selectEpoch, userTest1).call();

                isRefundable = await pricePredictionContract.methods.isRefundable(selectEpoch, userTest1).call();

                if(isClaimable || isRefundable){
                    finalEpochsForuserTest1.push(selectEpoch);
                }
            }

            console.log('finalEpochs userTest1 : ', finalEpochsForuserTest1);

            await pricePredictionContract.methods.claimReward(finalEpochsForuserTest1).send({from : userTest1 , gas: 500000});

            userTest1Balance = await web3.eth.getBalance(userTest1);
            console.log('userTest1Balance : ', userTest1Balance);

        })

    })

})