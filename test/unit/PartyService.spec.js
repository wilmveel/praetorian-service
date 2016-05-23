var async = require('async');
var assert = require('assert');
var Helper = require('../Helper');
var PartyService = require('../../src/partyService');

describe('services', function () {

    var helper = new Helper(this);

    var service;

    before(function (done) {
        helper.init(done)
    });

    before(function (done) {
        helper.deploy(function (err, contract) {
            if (err) return done(err)
            service = new PartyService(contract);
            done();
        });
    });

    it('should create party one contract', function (done) {
        service.create(function (err, address) {
            if (err) return done(err);
            done();
        });
    });

    it('should create two party contracts', function (done) {

        async.parallel({
                one: function (callback) {
                    service.create(callback);
                },
                two: function (callback) {
                    service.create(callback);
                }
            },
            function (err, results) {
                assert.notEqual(results.one, results.two);
                done();
            });

    });

    it('should have created three parties', function (done) {

        service.list(function (err, parties) {
            done();
        });

    });

});