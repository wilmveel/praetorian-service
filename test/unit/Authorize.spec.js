var assert = require('assert');
var Helper = require('../Helper');
var AccessService = require('../../src/AccessService');
var PasswordChallengeService = require('../../src/PasswordChallengeService');

describe('services', function () {

    var helper = new Helper(this);

    var accessService;
    
    var PasswordService;
    
    var accessAddress;

    before(function (done) {
        helper.init(done)
    });

    before(function (done) {
        helper.deploy(function (err, contract) {
            if (err) return done(err)
            //AccessService = new AccessService(contract);
            PasswordService = new PasswordChallengeService(contract);
            console.log('services created')
            done();
        });  
    });
        before(function (done) {
        helper.deploy(function (err, contract) {
            if (err) return done(err)
            accessService = new AccessService(contract);
            done();
        });
    });
    
    
    it('should create an access contract', function(done){
        accessService.create(function(err, address){
            if(err) return done(err);
            console.log("Address", address);
            accessAddress = address;
            done();
        })
    });
    
    it('should create passwordChallenge contract', function (done) {
        PasswordService.create("Willem123", function(err, contract){
            if(err) return done(err)
            passwordChallengeContract = contract
            done();
        });
    });
    
    
    it('should validate a wallet with a passwordChallenge in an Access contract', function(done){
        PasswordService.authorize(passwordChallengeContract, "Willem123", accessAddress, function(err, success){
            if(err) return (done(err))
            console.log(success)
            done();
        })
    })
    
    // it('should have one authorization on the access contract', function(done){
        
    // })
    
})