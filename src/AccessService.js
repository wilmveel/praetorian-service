module.exports = function(factory){

    return {

        find: function (callback) {
            factory.findAccess.estimateGas(function (err, gas) {
                if (err) return callback(err);
                factory.findAccess({
                    gas: (gas * 2)
                }, function (err, transactionHash) {
                    console.log(transactionHash)
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