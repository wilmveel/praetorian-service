var assert = require('assert');
var Helper = require('../Helper');
var AccessService = require('../../src/AccessService');
var PasswordChallengeService = require('../../src/PasswordChallengeService');

describe('AuthorizeByPasswordChallenge', function () {

    var helper = new Helper(this);

    var accessService;
    
    var passwordService;
    var accessAddress;

    var passwordChallengeContract;

    before(function (done) {
        helper.init(done)
    });

    before(function (done) {
        helper.deploy(function (err, contract, compiled) {
            if (err) return done(err)
            accessService = new AccessService(contract);

            var PasswordChallengeAbi = JSON.parse(compiled.PasswordChallenge.interface);
            passwordService = new PasswordChallengeService(contract, PasswordChallengeAbi);
            done();
        });  
    });
    
    
    it('should create an access contract', function(done){
        accessService.create(function(err, address){
            if(err) return done(err);
            accessAddress = address;
            done();
        })
    });
    
    it('should create passwordChallenge contract', function (done) {
        passwordService.create("Willem123", function(err, contract){
            if(err) return done(err)
            passwordChallengeContract = contract;
            done();
        });
    });
    
    
    it('should validate a wallet with a passwordChallenge in an Access contract', function(done){
        passwordService.authorize(passwordChallengeContract, "Willem123", accessAddress, function(err, success){
            if(err) return (done(err))
            done();
        })
    })
    
    // it('should have one authorization on the access contract', function(done){
        
    // })
    
})