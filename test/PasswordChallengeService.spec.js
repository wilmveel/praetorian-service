var assert = require('assert');

var Web3 = require('web3');
var TestRPC = require("ethereumjs-testrpc");

var fs = require('fs');
require.extensions['.sol'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};

var passwordChallengeServices = require('../src/PasswordChallengeService');

describe('services', function () {

    this.timeout(1000000);

    var web3 = new Web3();

    web3.setProvider(TestRPC.provider({
        accounts:[
            {"0x6C7e58D1F9535DF955FE1c9e09e19D266AB84Fc4": 300}
        ]
    }));

    before(function(done) {
        web3.eth.getAccounts(function (err, accs) {
            if (err) return done(err);
            console.log(accs)
            web3.eth.defaultAccount = accs[0]
            done();
        });
    });

    var service = passwordChallengeServices(web3);
    var passwordChallengeContract;

    it('should create passwordChallenge contract', function (done) {
        service.create("Willem123", function(err, contract){
            if(err) return done(err)
            passwordChallengeContract = contract
            done();
        });
    });

    it('should verify passwordChallenge contract and send success', function (done) {
        service.verify(passwordChallengeContract.address, "Willem123", function(err, event){
            assert.equal('success', event);
            done();
        });
    });

    it('should verify passwordChallenge contract and send success', function (done) {
        service.verify(passwordChallengeContract.address, "Willem456", function(err, event){
            assert.equal('error', event);
            done();
        });
    });

    it('should change password', function (done) {
        service.change(passwordChallengeContract.address, "Willem123", "Willem456", function(err, event){
            assert.equal('success', event);
            done();
        });
    });

    it('should verify password after change and send success', function (done) {
        service.verify(passwordChallengeContract.address, "Willem456", function(err, event){
            assert.equal('success', event);
            done();
        });
    });

    it('should verify wrong password after change and send error', function (done) {
        service.verify(passwordChallengeContract.address, "Willem123", function(err, event){
            assert.equal('error', event);
            done();
        });
    });


});