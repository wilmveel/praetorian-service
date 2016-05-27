var AccessService = require('./src/AccessService');
var PartyService = require('./src/PartyService');
var PasswordChallengeService = require('./src/PasswordChallengeService');

module.exports = function (web3, factoryAddress) {

    var services = {};

    var compiled = require('praetorian-contracts');
    var abi = compiled.Factory.info.abiDefinition;
    var code = compiled.Factory.code;

    var factroyContract = web3.eth.contract(abi);

    if (factoryAddress) factroyContract.at(factoryAddress, callback)
    else factroyContract.new({gas: 2000000, data: code}, callback);
    function callback(err, contract) {
        console.log('contract', contract.address);
        services = {
            accessService: new AccessService(contract),
            partyService: new PartyService(contract),
            passwordChallengeService: new PasswordChallengeService(contract, compiled.PasswordChallenge)
        }
    }

    return services;

}