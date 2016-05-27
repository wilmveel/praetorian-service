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
    
    var walletAddress;

    before(function (done) {
        helper.init(done)
    });

    before(function (done) {
        helper.deploy(function (err, services) {
            if (err) return done(err);
            accessService = services.accessService;
            passwordService = services.passwordChallengeService;
            done();
        });
    });
    
    
    xit('should create an access contract', function(done){
        accessService.find(walletAddress, function(err, address){
            if(err) return done(err);
            accessAddress = address;
            done();
        })
    });
    
    xit('should create passwordChallenge contract', function (done) {
        passwordService.create("Willem123", function(err, contract){
            if(err) return done(err)
            passwordChallengeContract = contract;
            done();
        });
    });
    
    
    xit('should validate a wallet with a passwordChallenge in an Access contract', function(done){
        passwordService.authorize(passwordChallengeContract, "Willem123", accessAddress, function(err, success){
            if(err) return (done(err))
            done();
        })
    });
    
})