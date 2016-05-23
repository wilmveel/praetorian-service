var async = require('async');
var assert = require('assert');
var Helper = require('../Helper');

var PasswordChallengeService = require('../../src/PasswordChallengeService');

describe('PasswordChallengeService', function () {

    var helper = new Helper(this);

    var service;

    before(function (done) {
        helper.init(done)
    });

    before(function (done) {
        helper.deploy(function (err, contract) {
            if (err) return done(err)
            service = new PasswordChallengeService(contract);
            done();
        });
    });

    it('should create passwordChallenge contract', function (done) {
        service.create("Willem123", function(err, contract){
            if(err) return done(err)
            passwordChallengeContract = contract
            done();
        });
    });

    it('should verify passwordChallenge contract and send success', function (done) {
        service.verify(passwordChallengeContract, "Willem123", function(err, event){
            assert.equal('success', event);
            done();
        });
    });

    it('should verify passwordChallenge contract and send success', function (done) {
        service.verify(passwordChallengeContract, "Willem456", function(err, event){
            assert.equal('error', event);
            done();
        });
    });

    it('should change password', function (done) {
        service.change(passwordChallengeContract, "Willem123", "Willem456", function(err, event){
            assert.equal('success', event);
            done();
        });
    });

    it('should verify password after change and send success', function (done) {
        service.verify(passwordChallengeContract, "Willem456", function(err, event){
            assert.equal('success', event);
            done();
        });
    });

    it('should verify wrong password after change and send error', function (done) {
        service.verify(passwordChallengeContract, "Willem123", function(err, event){
            assert.equal('error', event);
            done();
        });
    });


});