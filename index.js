var compiled = require('praetorian-contracts');

var AccessService = require('./src/AccessService');
var PartyService = require('./src/PartyService');
var PasswordChallengeService = require('./src/PasswordChallengeService');

module.exports = function (web3) {

    var abi = JSON.parse(compiled.Factory.interface);
    var code = compiled.Factory.bytecode;
    var factoryContract = web3.eth.contract(abi);

    return {

        init: function (factoryAddress, callback) {

            var gas = compiled.Factory.gasEstimates.creation[1];

            if (factoryAddress) factoryContract.at(factoryAddress, cb);
            else factoryContract.new({gas: (gas * 2), data: code}, cb);

            function cb(err, contract) {
                if(err) return callback(err)
                if(contract.address){
                    var services = {
                        accessService: new AccessService(contract),
                        partyService: new PartyService(contract),
                        passwordChallengeService: new PasswordChallengeService(contract, compiled.PasswordChallenge)
                    };
                    callback(null, services)
                }

            }
        }

    }
};