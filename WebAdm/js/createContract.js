/*
Copyright (c) 2018 ZSC Dev Team
*/

var cC_ModuleName = [];
var cC_ModuleAdr = [];

function cC_getContractFullName(contractName) {
    if (contractName == 'TestToken') {
        return "./zsc/db/Database/ZSCTestToken.sol:ZSCTestToken";
    } else if (contractName == 'AdmAdv') {
        return "./zsc/adm_adv.sol:AdmAdv";
    } else if (contractName == 'PosAdv') {
        return "./zsc/pos_adv.sol:PosAdv";
    } else if (contractName == 'LogRecorder') {
        return "./zsc/db/Database/log_recorder.sol:LogRecorder";
    } else if (contractName == 'WalletManager') {
        return "./zsc/db/Database/wallet_manager.sol:WalletManager";
    } else if (contractName == 'DatabaseManager') {
        return "./zsc/db/Database/database_manager.sol:DatabaseManager";
    } else if (contractName == 'SimulatorManager') {
        return "./zsc/db/Database/simulator_manager.sol:SimulatorManager";
    } else if (contractName == 'FactoryManager') {
        return "./zsc/db/Database/factory_manager.sol:FactoryManager";
    } else if (contractName == 'DBDatabase') {
        return "./zsc/db/Database/db_database.sol:DBDatabase";
    } else if (contractName == 'FactoryPro') {
        return "./zsc/factory_pro.sol:FactoryPro";
    } else if (contractName == 'FactoryRec') {
        return "./zsc/factory_pro.sol:FactoryRec";
    } else if (contractName == 'FactoryStaker') {
        return "./zsc/factory_staker.sol:FactoryStaker";
    } else if (contractName == 'FactoryTmp') {
        return "./zsc/factory_tmp.sol:FactoryTmp";
    } else if (contractName == 'FactoryAgr') {
        return "./zsc/factory_agr.sol:FactoryAgr";
    } else if (contractName == 'FactoryWalletEth') {
        return "./zsc/factory_wallet_eth.sol:FactoryWalletEth";
    } else if (contractName == 'FactoryWalletErc20') {
        return "./zsc/factory_wallet_erc20.sol:FactoryWalletErc20";
    } else if (contractName == 'ControlApisAdv') {
        return "./zsc/control_apis_adv.sol:ControlApisAdv";
    } 
}

function cC_getCompiledFile(contractName) {
    if (contractName == 'TestToken') {
        return compiledZSCTestToken;
    } else if (contractName == "AdmAdv") {
        return compiledAdmAdv;
    } else if (contractName == 'LogRecorder') {
        return compiledLogRecorder;
    } else if (contractName == 'PosAdv') {
        return compiledPosAdv;
    } else if (contractName == 'WalletManager') {
        return compiledWalletManager;
    } else if (contractName == 'SimulatorManager') {
        return compiledSimulatorManager;
    } else if (contractName == 'FactoryManager') {
        return compiledSimulatorManager;
    } else if (contractName == 'DatabaseManager') {
        return compiledDatabaseManager;
    } else if (contractName == 'DBDatabase') {
        return compiledDatabase;
    } else if (contractName == 'FactoryPro') {
        return compiledFactoryPro;
    } else if (contractName == 'FactoryRec') {
        return compiledFactoryRec;
    } else if (contractName == 'FactoryStaker') {
        return compiledFactoryStaker;
    } else if (contractName == 'FactoryTmp') {
        return compiledFactoryTmp;
    } else if (contractName == 'FactoryAgr') {
        return compiledFactoryAgr;
    } else if (contractName == 'FactoryWalletEth') {
        return compiledFactoryWalletEth;
    } else if (contractName == 'FactoryWalletErc20') {
        return compiledFactoryWalletErc20;
    } else if (contractName == 'ControlApisAdv') {
        return compiledApisAdv;
    }
}

function cC_getContractAbi(contractName) {
    var solcompiled = cC_getCompiledFile(contractName);
    var contractFullName = cC_getContractFullName(contractName);
    var abi = JSON.parse(solcompiled.contracts[contractFullName].abi)
    return abi;
}

function cC_getContractBin(contractName) {
    var solcompiled = cC_getCompiledFile(contractName);
    var contractFullName = cC_getContractFullName(contractName);
    var bin = "0x" + solcompiled.contracts[contractFullName].bin;
    return bin;
}

function cC_getContractAbiString(contractName) {
    var solcompiled = getCompiledFile(contractName);
    var contractFullName = getContractFullNme(contractName);
    var abi =  solcompiled.contracts[contractFullName].abi
    return abi;
}


function cC_showCreatingResult(type, elementID, text) {
    if (type == "text") {
        document.getElementById(elementID).innerText = text;
    } else if (type == "input") {
        var element = document.getElementById(elementID);
        if (element != null) {
            element.value = text; 
        }
    }
}

function cC_setupContract(contractName, paramId) {
    var logResult = "";
    var parameter = document.getElementById(paramId).value
    var databin = cC_getContractBin(contractName);
    var greeterContract = web3.eth.contract(cC_getContractAbi(contractName)); 
    var account = web3.eth.accounts[0];
    var greeter = greeterContract.new(parameter, {account, data: databin, gas: 7500000}, function(e, contract){
        if(!e) {
            if(!contract.address) {
                logResult += "Send transactionHash: " + contract.transactionHash + "\nwaiting to be mined... ";
                cC_showCreatingResult("text", contractName + "Log", logResult);
            } else {
                logResult += "Mined! Address: " + contract.address + "\n";
                cC_showCreatingResult("text", contractName + "Adr", contractName + ": " + contract.address);
                cC_showCreatingResult("text", contractName + "Log", logResult);
                cC_showCreatingResult("input", contractName + "AdrPara", contract.address);

                var index = cC_ModuleName.length;
                cC_ModuleName[index] = contractName;
                cC_ModuleAdr[index] = contract.address;
            }
        } else {
            logResult += ": Error!! - " + e;
            cC_showCreatingResult("text", contractName + "Log", logResult);
        }
    })
}

function cC_getUrlSuffixForControlPage() {
    var text = "?";
    for (var i = 0; i < cC_ModuleName.length; ++i) {
        text += cC_ModuleName[i] + "=";
        text += cC_ModuleAdr[i] + "&";
    }
    return text;
}



