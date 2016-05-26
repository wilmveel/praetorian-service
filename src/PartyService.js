module.exports = function (factory) {

    return {

        list: function (callback) {
            factory.getParties(function(err, parties){
                callback(err, parties);
            });
        },

        create: function (callback) {
            factory.createParty.estimateGas(function (err, gas) {
                if (err) return callback(err);
                factory.createParty({
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