var assert = require('assert');

var Web3 = require('web3');
var TestRPC = require("ethereumjs-testrpc");

var fs = require('fs');
require.extensions['.sol'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};

var passwordDelegateServices = require('../src/passwordDelegateServices');

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

    var service = passwordDelegateServices(web3);
    var passwordDelegateContract;

    it('should create passwordDelegate contract', function (done) {
        service.create("Willem123", function(err, contract){
            if(err) return done(err)
            passwordDelegateContract = contract
            done();
        });
    });

    it('should verify passwordDelegate contract and send success', function (done) {
        service.verify(passwordDelegateContract.address, "Willem123", function(err, event){
            assert.equal('success', event);
            done();
        });
    });

    it('should verify passwordDelegate contract and send success', function (done) {
        service.verify(passwordDelegateContract.address, "Willem456", function(err, event){
            assert.equal('error', event);
            done();
        });
    });

    it('should change password', function (done) {
        service.change(passwordDelegateContract.address, "Willem123", "Willem456", function(err, event){
            assert.equal('success', event);
            done();
        });
    });

    it('should verify passwordDelegate contract and send success', function (done) {
        service.verify(passwordDelegateContract.address, "Willem456", function(err, event){
            assert.equal('success', event);
            done();
        });
    });


});