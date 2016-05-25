module.exports = function(contract){

    return {
        
        find:function(callback){
            contract.getAccess(function(err, access){
                callback(err, access);
            })
        },
        
        // create:function(callback){
        //     contract.createAccess.estimateGas(function(err, gas){
        //         if(err) return callback(err);
        //         contract.createAccess({
        //             gas: (gas * 2)
        //         }, function(err, transactionHash) {
        //             if(err) return callback(err);
        //             var events = contract.allEvents();
        //             events.watch(function (err, event){
        //                 if(err) return callback(err);
        //                 if(event && event.transactionHash == transactionHash){
        //                     events.stopWatching();
        //                     callback(null, event.args.addr);
        //                 }
        //             })
        //         })
        //     })
        // },
        
        // getAuthorization:function(address, callback){
        //     contract._eth.contract(abi).at(address, function (err, contract) {
        //         if (err) callback(err)
        //         else if  (contract.address) {

        //             console.log("contract", contract.address)
                    
        //         }
        //     })

            
        // }
    }
}