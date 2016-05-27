module.exports = function(factory){

    return {
        
        find:function(walletAddress, callback){
            factory.getAccess(walletAddress, function(err, access){
                callback(err, access);
            })
        },
        
       
    }
}