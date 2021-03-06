/*
Copyright (c) 2018 ZSC Dev Team
*/

//class zscWallet
function ZSCWallet(nm, abi, adr) {
    this.userName = nm;
    this.tokenNos = 0;
    this.tokenSymbol = [];
    this.tokenAddress = [];
    this.tokenBalance = [];
    this.tokenStatus = [];
    this.myControlApi = web3.eth.contract(abi).at(adr);
}

ZSCWallet.prototype = new ZSCClient();

ZSCWallet.prototype.getUserName = function() {return this.userName;}

ZSCWallet.prototype.submitTransferValue = function(tokenSymbol, destAddressID, amountID, logId, func) {  
    var destAddress = document.getElementById(destAddressID).value;
    var amount = document.getElementById(amountID).value;

    if (destAddress != 0 && amount > 0) {
        this.myControlApi.submitTransfer(this.userName, tokenSymbol, destAddress, web3.toWei(amount, 'ether') , 
            {from: this.getAccount(), gasPrice: this.getGasPrice(1), gas : this.getGasLimit(20)}, 
            function(error, result){ 
            if(!error) {
                if (result > 0) {
                    this.informTransfer(srcAddress, destAddress, result, func);
                } else {
                    func();
                }
            } else {
                console.log("error: " + error);
            }
        });
    }
}

ZSCWallet.prototype.confirmTransferValue = function(tokenSymbol, logId, func) {  
    this.myControlApi.confirmTransfer(this.userName, tokenSymbol, 
        {from: this.getAccount(), gasPrice: this.getGasPrice(1), gas : this.getGasLimit(20)}, 
        function(error, result){ 
        if(!error) {
            if (result > 0) {
                this.informTransfer(srcAddress, destAddress, result);
            } else {
                func();
            }
        } else {
            console.log("error: " + error);
        }
    });
}

ZSCWallet.prototype.informTransfer = function(srcAddress, destAddress, amount, func) { 
    if (amount > 0) {
        this.myControlApi.elementInformTransfer(this.userName, srcAddress, destAddress, web3.toWei(amount, 'ether') , 
            {from: this.getAccount(), gasPrice: this.getGasPrice(1), gas : this.getGasLimit(20)}, 
            function(error, result){ 
            if(!error) {
                func();
            } else {
                console.log("error: " + error);
            }
        });
    }
} 

ZSCWallet.prototype.enableWallet = function(tokenSymbol, elementId, func) {
    this.myControlApi.enableElementWallet(this.userName, tokenSymbol, 0, 
        {from: this.getAccount(), gasPrice: this.getGasPrice(1), gas : this.getGasLimit(20)}, 
        function(error, result){ 
            if(!error) {
                bF_showHashResult(elementId, result, function(){});
                func();
            } else {
                console.log("error: " + error);
            }
        });
}

ZSCWallet.prototype.loadTokenWallets = function(func) {
    this.numTokenWallets(function() {
        for (var i = 0; i < this.tokenNos; ++i) {
            this.loadTokenInfoByIndex(i, function(index){
                if (indx == this.tokenNos - 1) {
                    func();
                }
            });
        }
    });
}

ZSCWallet.prototype.numTokenWallets = function(func) {
    this.myControlApi.numRegisteredErc20Tokens(this.userName,
        {from: this.account, gas: 9000000},
        function(error, result){ 
            if(!error) {
                this.tokenNos = result.toString(10);
                func();
            } else {
                console.log("error: " + error);
            }
        });
}

ZSCWallet.prototype.loadTokenInfoByIndex = function(index, func) {
    this.myControlApi.getTokenBalanceInfoByIndex(this.userName, i,
        {from: this.getAccount(), gasPrice: this.getGasPrice(1), gas : this.getGasLimit(20)}, 
        function(error, result){ 
            if(!error) {
                this.parserTokenBalanceInfoByIndex(result, index);
                func(index);
            } else {
                console.log("error: " + error);
            }
        });
}

/*
"info?status=", "symbol=", "adr=", "balance=",    
*/
ZSCWallet.prototype.parserTokenBalanceInfoByIndex = function(urlinfo, index) {
    var found1 = urlinfo.indexOf("?");
    var found2 = urlinfo.indexOf("=");

    if (found1 == -1 || found2 == -1) return false;

    var len = urlinfo.length;
    var offset = urlinfo.indexOf("?");
    var newsidinfo = urlinfo.substr(offset,len)
    var newsids = newsidinfo.split("&");

    var statusInfo   = newsids[0];
    var symbolInfo   = newsids[1];
    var adrInfo      = newsids[2];
    var balanceInfo  = newsids[3];

    this.tokenStatus[index]  = statusInfo.split("=")[1];
    this.tokenSymbols[index] = symbolInfo.split("=")[1];
    this.tokenAdrs[index]    = adrInfo.split("=")[1];
    this.tokenBalance        = balanceInfo.split("=")[1];
    return true;
}

ZSCWallet.prototype.loadWalletsHtml = function(elementId, func1, func2, func3, func4)  {
    var transPrefix = func1 + "('"; 
    var transSuffix = "')";

    var confirmPrefix = func1 + "('"; 
    var confirmSuffix = "')";

    var showTransPrefix = func3 + "('";
    var showTransSuffix = "')";

    var enableWalletPrefix = func4 + "('";
    var enableWalletSuffix = "')";

    var symbol;
    var adr;
    var balance;
    var hashId;

    var text ="";
    text += '<div class="well">';
    text += '<table align="center" style="width:800px;min-height:30px">'
    text += '<tr>'
    text += '   <td><text>Symbol</text></td> <td><text>Balance</text></td>  <td><text>Address</text></td>  <td><text>Sent To</text></td> <td>Amount</td> <td></td> '
    text += '</tr>'

    for (var i = 0; i < this.tokenNos; ++i) {
        symbol = this.tokenSymbol[i];
        adr = this.tokenAddress[i];
        balance = this.tokenBalance[i];
        hashId = symbol + "Hash";
        sentoId = symbol + "Dest";
        amountId = symbol + "Amount";
        text += '<tr>'
        text += '   <td><text>' + symbol + '</text></td>'
        text += '   <td><text>' + balance + '</text></td>'
        text += '   <td><text>' + adr  + '</text></td>'   
        if (this.tokenStatus[i] == "false") {
            text += '   <td><button type="button" onClick="' + enableWalletPrefix + symbol + "', '" + hashId + "'" + showTransSuffix + '">Enable</button></td>'
        } else {
            text += '   <td><input id="' + sentoId + '"></input> <td>'   
            text += '   <td><input id="' + amountId + '"></input> <td>'
            text += '   <td><button type="button" onClick="' + transPrefix + symbol + "', '" + sentoId + "', '" + amountId + "', '" + hashId + "'" + transSuffix + '">Transfer</button></td>'
            text += '   <td><button type="button" onClick="' + confirmPrefix + symbol + "', '" + hashId + "'" + confirmSuffix + '">Confirm</button></td>'
            text += '   <td><button type="button" onClick="' + showTransPrefix + symbol, "', '" + hashId + "'" + showTransSuffix + '">Show</button></td>'
        }
        text += '   <td><text id="'+ hashId + '"></text></td>'
        text += '</tr>'
    }
    text += '</table></div>'

    document.getElementById(elementId).innerHTML = text;  
}


