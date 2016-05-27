module.exports = function(factory){

    return {

        find: function (address, callback) {
            factory.findAccess.estimateGas(function (err, gas) {
                if (err) return callback(err);

                factory.findAccess(address, {
                    gas: (gas * 2)
                }, function (err, transactionHash) {
                    if (err) return callback(err);
                    console.log(transactionHash)
                    var events = factory.allEvents();
                    events.watch(function (err, event) {
                        console.log(transactionHash)
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