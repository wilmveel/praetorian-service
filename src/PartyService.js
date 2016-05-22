module.exports = function (contract) {

    return {

        list: function (callback) {
            contract.getParties(function(err, parties){
                callback(err, parties);
            });
        },

        create: function (callback) {
            contract.createParty.estimateGas(function (err, gas) {
                if (err) return callback(err);
                contract.createParty({
                    gas: (gas * 2)
                }, function (err, transactionHash) {
                    if (err) return callback(err);
                    var events = contract.allEvents();
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