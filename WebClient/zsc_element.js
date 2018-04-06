/*
Copyright (c) 2018 ZSC Dev Team
*/

//class zscElement
function ZSCElement(nm, abi, adr) {
    this.name = nm;
    this.parameNos = 0;
    this.ethBalance = 0;
    this.nodeAddress = 0;
    this.parameterNames = [];
    this.parameterValues = [];
    this.binedElements = [];
    this.myControlApi = web3.eth.contract(abi).at(adr);
}
ZSCElement.prototype.getName = function() { return this.name;}

ZSCElement.prototype.activeTid = function(index, func, time) { this.tid[index] = setInterval(func, time);}

ZSCElement.prototype.deactiveTid = function(index) { clearInterval(this.tid[index]);}

ZSCElement.prototype.getEthBalance = function() { return this.ethBalance;}

ZSCElement.prototype.getAddress = function() { return this.nodeAddress;}

ZSCElement.prototype.getParameterName = function(index) { return this.parameterNames[index]; }

ZSCElement.prototype.getParameterValue = function(index) { return this.parameterValues[index]; }

ZSCElement.prototype.numBindedElements = function() { return this.binedElements.length; }

ZSCElement.prototype.getBindedElementName = function() { return this.binedElements[index]; }



ZSCElement.prototype.doesElementExisit = function(func) {
    this.myControlApi.doesElementExist(this.name,
        function(error, ret){ 
            if(!error) func(ret);  
            else  console.log("error: " + error);
        });
}


ZSCElement.prototype.loadEthBalance = function(func) {
    this.myControlApi.getElementEthBalance(this.name, function(error, balance){ 
        if(!error) {
            this.ethBalance = balance;  
            myControlApi.getElementAddress(this.name, function(error, address){ 
                if(!error) { 
                    this.nodeAddress = address; 
                    func(); 
                } else {
                    console.log("error: " + error);
                }
            });
        }
    });
}

ZSCElement.prototype.loadParameterNamesAndvalues = function(func) {
    this.numParameters(function() {
        this.loadParameterNames(function() {
            this.loadParameterValues(function(index){
                if (index == this.parameNos - 1) {
                    func();
                }
            });
        }); 
    });
}

ZSCElement.prototype.numParameters = function(func) {
    this.myControlApi.numElementParameters(this.name, 
        {from: bF_getEthAccount()},
        function(error, num){ 
            if(!error) { 
                this.parameNos = num.toString(10); 
                func();
            } else {
                console.log("error: " + error);
            }
         });
}

ZSCElement.prototype.loadParameterNames = function(func) {
    for (var i = 0; i < this.parameNos; ++i) {
        loadParameterNameByIndex(i, function(index, para) {
            uF_parameters[index] = para;
            if (index == this.parameNos - 1) {
                func();
            }
        });
    } 
} 

ZSCElement.prototype.loadParameterNameByIndex = function(index, func) {
    this.myControlApi.getElementParameterNameByIndex(this.name, index, 
        {from: bF_getEthAccount()},
        function(error, para){ 
            if(!error) {
                var ret = web3.toUtf8(para);
                func(index, ret);  
            } else { 
                console.log("error: " + error);
            }
        });
}

ZSCElement.prototype.loadParameterValues = function(func) {
    for (var i = 0; i < this.parameNos; ++i) {
        loadParameterValueByIndex(i, function(index, value) {
            if (index == this.parameNos - 1) {
                func(index);
            }
        });
    } 
} 

ZSCElement.prototype.loadParameterValueByIndex = function(index, func){ 
    this.myControlApi.getElementParameter(this.name, this.getParameterName(index), 
        {from: bF_getEthAccount()},
        function(error, value){ 
            if(!error) {
                this.parameterValues[index] = value;
                func(index, value);
            } else { 
                console.log("error: " + error);
            }
        });
}


ZSCElement.prototype.transferEth = function(destAddressID, amountID, logID){  
    var destAddress = document.getElementById(destAddressID).value;
    var amount = document.getElementById(amountID).value;

    if (destAddress != 0 && amount > 0) {
        this.myControlApi.elementwithDrawEth(this.name, destAddress, web3.toWei(amount, 'ether') , 
            {from: bF_getEthAccount(), gasPrice: bF_getGasPrice(1), gas : bF_getGasLimit(55000)}, 
            function(error, result){ 
            if(!error) bF_showHashResult(logID, result);
            else console.log("error: " + error);
        });
    }
}


