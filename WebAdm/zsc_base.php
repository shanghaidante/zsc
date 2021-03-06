<?php
/*
Copyright (c) 2018, ZSC Dev Team
*/
?>

<?php

class ZscBase {
    public function __construct() { 
    }

    public function __destruct() {
    }

    public function readContent($file) {
        $text = '';
        $myfile = fopen($file, "r");
        if ($myfile == FALSE) {
            $tex = '';
        } else { 
            $text = fread($myfile,filesize($file));
            fclose($myfile);
        }
        return $text;
    }

    public function writeContent($file, $text) {
        $myfile = fopen($file, "wr") or die("Unable to open file!");
        fwrite($myfile, $text);
        fclose($myfile);
    }

    public function getModuleArray() { 
        return array("TestToken", "LogRecorder", "DBDatabase",  "AdmAdv", "PosAdv", "WalletManager", "SimulatorManager", "DatabaseManager", "FactoryManager", "FactoryPro", "FactoryRec", "FactoryStaker", "FactoryTmp", "FactoryAgr", "FactoryWalletEth", "FactoryWalletErc20", "ControlApisAdv");
    } 

    public function getLogedModuleArray() {
        return array("DBDatabase", "AdmAdv", "PosAdv", "WalletManager", "SimulatorManager", "FactoryManager", "FactoryPro", "FactoryRec", "FactoryStaker", "FactoryTmp", "FactoryAgr",  "FactoryWalletEth", "FactoryWalletErc20", "ControlApisAdv");
    }

    public function getFactoryModuleArray() {
        return array("FactoryPro", "FactoryRec", "FactoryStaker" , "FactoryTmp",  "FactoryAgr",  "FactoryWalletEth", "FactoryWalletErc20"); 
    }
}

?>
