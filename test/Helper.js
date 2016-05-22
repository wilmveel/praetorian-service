var Web3 = require('web3');
var solc = require('solc');
var TestRPC = require("ethereumjs-testrpc");

var fs = require('fs');
require.extensions['.sol'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};

var web3 = new Web3();

var httpProvider = new web3.providers.HttpProvider("http://128.199.53.68:8545");
var testProvider = TestRPC.provider();

web3.setProvider(testProvider);

var contracts = require('praetorian-contracts');
var compiled = solc.compile(contracts, 1).contracts;

console.log(compiled)

var DEFAULT_GAS = 1000000;

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
                    callback(null, contract);
                }
            });

        },
        web3: web3
    };
};