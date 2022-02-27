const AggregatorV3 = artifacts.require("AggregatorV3");
const pricePrediction = artifacts.require("pricePrediction");


const Intl = require('Intl');
const nf = Intl.NumberFormat();

const BN = require('bignumber.js')

require('chai').use(require('chai-bignumber')(BN)).use(require('chai-as-promised')).should();

contract ('', async([deployer, userTest1, userTest2]) => {

    beforeEach(async ()=> {

        this.AggregatorV3Contract = await AggregatorV3.new('0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419');
        this.pricePredictionContract = await pricePrediction.new(this.AggregatorV3Contract.address, deployer, deployer, 300, 30, 1000000000000000, 300, 1000);
    })

    describe('', async () => {
        
        const betAmount = await web3.utils.toWei('1', 'ether');

        let currentEpoch;
        let epochs = [];


        it('Start Gensis' ,async ()=> {
            /* Lets Start Bet Round A */

            console.log('Lets Start Bet Round A ...')
            console.log('this.pricePredictionContract address', this.pricePredictionContract.address)

            const deployerBalanceBeforeBet = await web3.eth.getBalance(deployer);
            console.log('deployerBalanceBeforeBet : ', deployerBalanceBeforeBet)

            const userTest1BalanceBeforeBet = await web3.eth.getBalance(userTest1);
            console.log('userTest1BalanceBeforeBet : ', userTest1BalanceBeforeBet)

            //Gensis Start Round
            await this.pricePredictionContract.gensisStartPrediction().should.be.fulfilled;
            currentEpoch = await this.pricePredictionContract.currentEpoch()
            console.log('currentEpoch : ' ,currentEpoch.toNumber())

            //BetBear
            console.log('Betting Bear')
            await this.pricePredictionContract.betBearPrediction(Number(currentEpoch), {from : deployer, value : betAmount})
            .should.be.fulfilled;
            console.log('Bet Done')

            //BetBull
            console.log('Betting Bull')
            await this.pricePredictionContract.betBullPrediction(Number(currentEpoch), {from : userTest1, value : betAmount})
            .should.be.fulfilled;
            console.log('Bet Done')

            const deployerBalanceAfterBet = await web3.eth.getBalance(deployer);
            console.log('deployerBalanceAfterBet : ', deployerBalanceAfterBet)

            const userTest1BalanceAfterBet = await web3.eth.getBalance(userTest1);
            console.log('userTest1BalanceAfterBet : ', userTest1BalanceAfterBet)
            
            //Gnesis Lock Round
            console.log('locking Gensis Round ....')
            await this.pricePredictionContract.gensisLockRound().should.be.fulfilled;
            console.log('Gensis Round Locked ....')

            const oldLockedPrice = await this.pricePredictionContract.getLockPrice(Number(currentEpoch));
            console.log('oldLockedPrice : ', oldLockedPrice.toNumber());

            await this.pricePredictionContract.changeLockPrice(Number(currentEpoch), 375506000000).should.be.fulfilled;

            const newLockedPrice = await this.pricePredictionContract.getLockPrice(Number(currentEpoch));
            console.log('newLockedPrice : ', newLockedPrice.toNumber());

            //Execute Round
            console.log('Executing ....')
            await this.pricePredictionContract.executeRound().should.be.fulfilled;
            console.log('Execute Done ....')

            //Claim Reward
            console.log('Claiming ....')

            epochs = [Number(currentEpoch)]

            for (let i = 0 ; i < epochs.length; i++){
                const isClaimableA1 = await this.pricePredictionContract.isClaimable(epochs[i], deployer);
                const isRefundableA1 = await this.pricePredictionContract.isRefundable(epochs[i], deployer);

                if(isClaimableA1 || isRefundableA1){
                    await this.pricePredictionContract.claimReward(epochs, {from : deployer}).should.be.fulfilled;
                }
            }

            for (let i = 0 ; i < epochs.length; i++){
                const isClaimableA2 = await this.pricePredictionContract.isClaimable(epochs[i], userTest1);
                const isRefundableA2 = await this.pricePredictionContract.isRefundable(epochs[i], userTest1);

                if(isClaimableA2 || isRefundableA2){
                    await this.pricePredictionContract.claimReward(epochs, {from : userTest1}).should.be.fulfilled;
                }
            }

            const deployerBalanceAfterClaim = await web3.eth.getBalance(deployer);
            console.log('deployerBalanceAfterClaim : ', deployerBalanceAfterClaim)

            const userTest1BalanceAfterClaim = await web3.eth.getBalance(userTest1);
            console.log('userTest1BalanceAfterClaim : ', userTest1BalanceAfterClaim)

            console.log('Claim Done ....')

            console.log('Lets Close Bet Round A ...')

            /* ****************** */

            it('Start Next Round', async() => {

            /* Lets Start Bet Round B */

            console.log('Lets Start Bet Round B ...')

            currentEpoch = await this.pricePredictionContract.currentEpoch()
            console.log('currentEpoch : ' ,currentEpoch.toNumber())

            //BetBear
            console.log('Betting Bear')
            await this.pricePredictionContract.betBearPrediction(Number(currentEpoch), {from : deployer, value : betAmount})
            .should.be.fulfilled;
            console.log('Bet Done')

            //BetBull
            console.log('Betting Bull')
            await this.pricePredictionContract.betBullPrediction(Number(currentEpoch), {from : userTest1, value : betAmount})
            .should.be.fulfilled;
            console.log('Bet Done')

            const deployerBalanceAfterBetB = await web3.eth.getBalance(deployer);
            console.log('deployerBalanceAfterBetB : ', deployerBalanceAfterBetB)

            const userTest1BalanceAfterBetB = await web3.eth.getBalance(userTest1);
            console.log('userTest1BalanceAfterBetB : ', userTest1BalanceAfterBetB)

            await this.pricePredictionContract.changeLockPrice(Number(currentEpoch), 375506000000).should.be.fulfilled;

            const newLockedPriceB = await this.pricePredictionContract.getLockPrice(Number(currentEpoch));
            console.log('newLockedPriceB : ', newLockedPriceB.toNumber());

            //Execute Round
            console.log('Executing ....')
            await this.pricePredictionContract.executeRound().should.be.fulfilled;
            console.log('Execute Done ....')

            //Claim Reward
            console.log('Claiming ....')

            epochs = [Number(currentEpoch)]

            for (let i = 0 ; i < epochs.length; i++){
                const isClaimableB1 = await this.pricePredictionContract.isClaimable(epochs[i], deployer);
                const isRefundableB1 = await this.pricePredictionContract.isRefundable(epochs[i], deployer);

                if(isClaimableB1 || isRefundableB1){
                    await this.pricePredictionContract.claimReward(epochs, {from : deployer}).should.be.fulfilled;
                }
            }

            for (let i = 0 ; i < epochs.length; i++){
                const isClaimableB2 = await this.pricePredictionContract.isClaimable(epochs[i], userTest1);
                const isRefundableB2 = await this.pricePredictionContract.isRefundable(epochs[i], userTest1);

                if(isClaimableB2 || isRefundableB2){
                    await this.pricePredictionContract.claimReward(epochs, {from : userTest1}).should.be.fulfilled;
                }
            }

            const deployerBalanceAfterClaimB = await web3.eth.getBalance(deployer);
            console.log('deployerBalanceAfterClaimB : ', deployerBalanceAfterClaimB)

            const userTest1BalanceAfterClaimB = await web3.eth.getBalance(userTest1);
            console.log('userTest1BalanceAfterClaimB : ', userTest1BalanceAfterClaimB)

            console.log('Claim Done ....')

            console.log('Lets Close Bet Round B ...')

            })

        })

    })

})