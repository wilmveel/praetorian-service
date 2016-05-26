var Web3 = require('web3');
var TestRPC = require("ethereumjs-testrpc");

var web3 = new Web3();

if(!process.env.PROVIDER) process.env.PROVIDER = 'TEST';

if(process.env.PROVIDER == 'LIVE'){
    var httpProvider = new web3.providers.HttpProvider("http://128.199.53.68:8545");
    web3.setProvider(httpProvider);
}

if(process.env.PROVIDER == 'TEST'){
    var testProvider = TestRPC.provider();
    web3.setProvider(testProvider);
}

var compiled = require('praetorian-contracts');

module.exports = function (suite) {
    suite.timeout(1000000);

    return {
        init: function (callback) {
            web3.eth.getCoinbase(function (err, coinbase) {
                web3.eth.defaultAccount = coinbase
                callback();
            });
        },
        deploy: function (callback) {

            var abi = JSON.parse(compiled.Factory.interface);
            var code = compiled.Factory.bytecode;
            var gas = compiled.Factory.gasEstimates.creation[1];

            web3.eth.contract(abi).new({
                gas: gas * 2,
                data: code
            }, function (err, contract) {
                if (err) callback(err);
                else if (contract.address) {
                    callback(null, contract, compiled);
                }
            });

        },
        web3: web3
    };
};