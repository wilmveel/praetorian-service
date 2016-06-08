var sha3 = require('crypto-js/sha3');

module.exports = function (factory) {

    return {

        list: function (callback) {
            factory.getLevels(function(err, levels){
                callback(err, levels);
            });
        },

        create: function (name, challenges, callback) {

            name = '0x' + sha3('0x5298bf0475bcab8a3be7026b4584857c8d776aa3', {outputLength: 256}).toString();
            challenges = challenges.map(function(x){
                return '0x' + sha3('0x5298bf0475bcab8a3be7026b4584857c8d776aa3', {outputLength: 256}).toString();
            });

            factory.createLevel.estimateGas(name, challenges, function (err, gas) {
                if (err) return callback(err);
                factory.createLevel(name, challenges, {
                    gas: (gas * 2)
                }, function (err, transactionHash) {
                    if (err) return callback(err);
                    var events = factory.allEvents();
                    events.watch(function (err, event) {
                        if (err) return callback(err);
                        if (event && event.transactionHash == transactionHash) {
                            events.stopWatching();
                            callback(null, event.args.addr)
                        }
                    });
                })
            });
        }
    }
};