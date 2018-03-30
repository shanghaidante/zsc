/*
Copyright (c) 2018 ZSC Dev Team
*/


function bF_getEthAccount() {
    //console.log(web3.eth.accounts[0])
    var account = web3.eth.accounts[0];
    //if (account == undefined) alert("Need to login in MetaMask!!");
    return account;
}

function bF_getGasPrice(limit) {
    return limit * 1000000000; //limits * gwei
}

function bF_getGasLimit(limit) {
    return limit * 1000 * 1000; //limits * 1 million
}


function bF_showHashResult(elementID, hash) {
    web3.eth.getTransactionReceipt(hash, 
    function(error, result){ 
        if(!error) {
            var show;
            if (result == null) {
                show =  "(pending)" + hash ;
                uF_showHashResult(elementID, hash);
            } else {
                if (result.status == 0) {
                    show = "(failure)" + hash;
                } else {
                    show = "(succeeded)" + hash ;
                }
            }
            document.getElementById(elementID).innerText = show;
        } else {
            console.log("error: " + error);
        }
    });
}
