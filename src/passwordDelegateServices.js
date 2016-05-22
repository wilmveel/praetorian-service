var assert = require('assert');
var async = require('async');

var crypto = require('crypto');
var secp256k1 = require('secp256k1');

var solc = require("solc");
var ethereumjsUtil = require('ethereumjs-util');

module.exports = function (web3) {

    var contracts = require('praetorian-contracts');
    var compiled = solc.compile(contracts, 1).contracts;

    var abi = JSON.parse(compiled.PasswordChallenge.interface);
    var code = compiled.PasswordChallenge.bytecode;

    console.log(compiled);

    var DEFAULT_GAS = 500000;

    function createPrivateKey(password, salt) {
        return new Buffer(web3.sha3(password.toString('hex') + salt.toString('hex')).slice(2), 'hex');
    }

    function createSign(password, contract, callback) {


        async.parallel({
                salt: function (callback) {
                    contract.getSalt(function (err, salt) {
                        if (err) return callback(err);
                        salt = new Buffer(salt.slice(2), 'hex');
                        callback(null, salt);
                    });
                },
                challenge: function (callback) {
                    contract.getChallenge(function (err, challenge) {
                        if (err) return callback(err);
                        challenge = new Buffer(challenge.slice(2), 'hex');
                        callback(null, challenge);
                    });
                }
            },
            function (err, result) {

                if (err) return callback(err);

                var privateKey = createPrivateKey(password, result['salt']);
                var sign = secp256k1.sign(result['challenge'], privateKey);

                var v = sign.recovery + 27;
                var r = '0x' + sign.signature.slice(0, 32).toString('hex');
                var s = '0x' + sign.signature.slice(32, 64).toString('hex');

                callback(null, {v: v, r: r, s: s}, result['salt'], result['challenge'])
            });

    }

    return {


        create: function (password, callback) {

            var salt = crypto.randomBytes(32);
            var privateKey = createPrivateKey(password, salt);
            var response = ethereumjsUtil.privateToAddress(privateKey);

            var cont = web3.eth.contract(abi)

            cont.new('0x' + response.toString('hex'), '0x' + salt.toString('hex'), {
                gas: DEFAULT_GAS,
                data: code
            }, function (err, contract) {
                if (err) {
                    callback(err);
                } else if (contract.address) {
                    passwordDelegateContract = contract;
                    callback(null, contract);
                }
            });

        },

        verify: function (address, password, callback) {

            web3.eth.contract(abi).at(address, function (err, contract) {
                if (err) callback(err)
                else if  (contract.address) {

                    createSign(password, contract, function (err, sign) {
                        if(err) return  callback(err);

                        contract.verify(sign.v, sign.r, sign.s, {gas: DEFAULT_GAS}, function (err) {
                            if(err) return  callback(err);
                            var events = contract.allEvents();
                            events.watch(function (err, event) {
                                if (err) return callback(err);
                                events.stopWatching();
                                callback(null, event.event);
                            });
                        });
                    });

                }

            })
        },

        change: function (address, oldPassword, newPassword, callback) {

            web3.eth.contract(abi).at(address, function (err, contract) {
                if (err) callback(err)
                else if (contract.address) {

                    createSign(oldPassword, contract, function (err, sign, salt, challenge) {
                        if(err) return  callback(err);

                        var privateKey = createPrivateKey(newPassword, salt);
                        var response = ethereumjsUtil.privateToAddress(privateKey);

                        console.log("responseresponseresponse", '0x' + response.toString('hex'))

                        contract.change(sign.v, sign.r, sign.s, '0x' + response.toString('hex'), {gas: DEFAULT_GAS}, function (err) {
                            if(err) return  callback(err);
                            var events = contract.allEvents();
                            events.watch(function (err, event) {
                                if (err) return callback(err);
                                events.stopWatching();
                                callback(null, event.event);
                            });
                        });
                    });
                }
            });
        }
    }
}