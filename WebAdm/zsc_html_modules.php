<?php
/*
Copyright (c) 2018, ZSC Dev Team
*/
?>

<?php

include("zsc_system_modules.php");

class ZscHtmlModules extends ZscSystemModules {
    public function __construct(){
        parent::__construct();
    }

    public  function __destruct() {
    }

    public function loadHeader() {
        $databaseAdr = "dddd";
        $text='<br><br>
        <div align="center">
        <table align="center" style="width:400px;min-height:30px">
           <tr>
            <td align="center"><a href="adm_create_contract.php">Create contract</a></td>
            <td align="center"><a href="adm_configure_logrecorder.php">Configure LogRecorder</a></td>
            <td align="center"><a href="adm_control_apis_adv.php">Control system</a></td>
            <td align="center"><a href="adm_manage_users.php">Users</a></td>
            <td align="center"><a href="adm_show_userdetails.php">User Details</a></td>
            <td align="center"><a href="adm_manage_token_contracts.php">Manage Tokens</a></td>
            <td align="center"><a href="adm_show_log.php">Show Log</a></td>
          </tr>
        </table>
        </div>';
        return $text;
    }
    
    public function loadScriptFiles() {
        $text = '
        <meta http-equiv="content-type" content="text/html; charset=utf-8">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
    
        <script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
        <script type="text/javascript" src="../WebClient/web3.js/dist/web3.js"></script>
        <script type="text/javascript" src="../WebClient/web3js.js"></script>
        <script type="text/javascript" src="./js/createContract.js"></script>
        <script type="text/javascript" src="./js/setupFunctions.js"></script>
        <script type="text/javascript" src="./js/zsc_js_base.js"></script>
        <script type="text/javascript" src="./js/zsc_printlog.js"></script>
        <script type="text/javascript" src="./js/zsc_setup.js"></script>
        <script type="text/javascript" src="./js/zsc_show_user_element.js"></script>
        <script type="text/javascript" src="./js/zsc_show_user_agrs.js"></script>
        <script type="text/javascript" src="./js/zsc_show_user_tmps.js"></script>
        <script type="text/javascript" src="./js/zsc_show_user_transactions.js"></script>
        <script type="text/javascript" src="./js/zsc_show_user_wallets.js"></script>
        <script type="text/javascript" src="./js/zsc_user_management.js"></script>
        <script type="text/javascript" src="./js/zsc_wallet_managerment.js"></script>
        <script type="text/javascript" src="./js/compiled_zsc_test_token.js"></script>
        <script type="text/javascript" src="./js/compiled_database.js"></script>
        <script type="text/javascript" src="./js/compiled_factory_pro.js"></script>
        <script type="text/javascript" src="./js/compiled_factory_rec.js"></script>
        <script type="text/javascript" src="./js/compiled_factory_tmp.js"></script>
        <script type="text/javascript" src="./js/compiled_factory_agr.js"></script>
        <script type="text/javascript" src="./js/compiled_factory_wallet_eth.js"></script>
        <script type="text/javascript" src="./js/compiled_factory_wallet_erc20.js"></script>
        <script type="text/javascript" src="./js/compiled_apis_adv.js"></script>
        <script type="text/javascript" src="./js/compiled_adm_adv.js"></script>
        <script type="text/javascript" src="./js/compiled_wallet_manager.js"></script>
        <script type="text/javascript" src="./js/compiled_simulator_manager.js"></script>
        <script type="text/javascript" src="./js/compiled_pos.js"></script>
        <script type="text/javascript" src="./js/compiled_loger.js"></script>';
        return $text;
    }
    
    public function loadAllAdrs() {
        $modules = ZscBase::getModuleArray();
        $num = count($modules);

        $text  = '<div class="well">';
        for ($x = 0; $x < $num; $x++) {
            $name = $modules[$x];
            $text .=    '<text id = "'.$name.'Adr">'.$name.' address: '.parent::readModuleAddress($name).'</text> <br>';
        }
        $text .= '</div>';

        /*
        $text = '<div class="well">
            <text id = "LogRecorderAdr">LogRecorder address: '.parent::readModuleAddress("LogRecorder").'</text> <br>   
            <text id = "AdmAdvAdr">LogRecorder address: '.parent::readModuleAddress("LogRecorder").'</text> <br>                                   
            <text id = "DBDatabaseAdr">DBDatabase address: '.parent::readModuleAddress('DBDatabase').'</text> <br>                   
            <text id = "FactoryProAdr">FactoryPro address: '.parent::readModuleAddress('FactoryPro').'</text> <br>               
            <text id = "FactoryTmpAdr">FactoryTmpAdr address: '.parent::readModuleAddress('FactoryTmp').'</text> <br>               
            <text id = "FactoryAgrAdr">FactoryAgrAdr address: '.parent::readModuleAddress('FactoryAgr').'</text> <br>               
            <text id = "ControlApisAdvAdr">ControlApis address:'.parent::readModuleAddress('ControlApisAdv').'</text>               
        </div>';
        */
        return $text;
    }

    public function loadCreateContract($func) {
        $modules = ZscBase::getModuleArray();
        $num = count($modules);

        $text = '';
        for($x = 0; $x < $num; $x++) {
            $name = $modules[$x];
            $text .= '<text>Step - '.$x.': Create '.$name.'</text>';
            $text .= '<div class="well">';
            $text .= '   <text> Name: </text>';
            $text .= '   <input type="text" id="'.$name.'Name" value = "test_'.$name.'"></input>';
            $text .= '   <button type="button" onClick="'.$func.'(\''.$name.'\',\''.$name.'Name\')">Create</button> <br>';
            $text .= '   <text id="'.$name.'Log"></text> <br>';
            $text .= '</div>';
        }
        return $text;
    }
    
    public function loadRegisterLogRecorderHtml($func) {
        $logedModules = ZscBase::getLogedModuleArray();
        $num = count($logedModules);
    
        $text = '<div class="well">';
    
        for($x = 0; $x < $num; $x++) {
            $name = $logedModules[$x];
            //<button type="button" onClick="registerToLogRecorder('AdmAdv','RegisterAdmAdvHash')">Register AdmAdv</button> 
            $text .= '<button type="button" onClick="'.$func.'(\''.$name.'\',\'Register'.$name.'Hash\')">Register '.$name.'</button>';
            //<text id="SetLogAdmAdvHash"></text><br> <br>
            $text .= '<text id="Register'.$name.'Hash"></text> <br> <br>';
        }
    
        $text .= '</div>';
    
        return $text;
    }

    public function loadSetLogRecorderHtml($func) {
        $logedModules = ZscBase::getLogedModuleArray();
        $num = count($logedModules);
    
        $text = '<div class="well">';
    
        for($x = 0; $x < $num; $x++) {
            $name = $logedModules[$x];
            //<button type="button" onClick="setLogRecorderToListener('AdmAdv','SetLogAdmAdvHash')">Set Loger to DBDatabase</button> 
            $text .= '<button type="button" onClick="'.$func.'(\''.$name.'\',\'SetLog'.$name.'Hash\')">SetLog '.$name.'</button>';
            //<text id="SetLogAdmAdvHash"></text><br> <br>
            $text .= '<text id="SetLog'.$name.'Hash"></text> <br> <br>';
        }
    
        $text .= '</div>';
    
        return $text;
    }

    public function loadInitModules($func) {
        $modules = ZscBase::getInitedModuleArray(); 
        $num = count($modules);
        $text = '';
    
        for($x = 0; $x < $num; $x++) {
            $name = $modules[$x];
            $hashId = $name.'Hash'.$x;
            $action = '';
            $object = '';
            $action = "Init ".$name;
            
            /*
            <text>Step - 1 </text>
            <button type="button" onClick="initSystemModule('DBDatabase', 'null','DBDatabaseHash')">Init DBDatabase</button> 
            <text id="DBDatabaseHash"></text><br>
            */
            $text .= '<text>Step - '.($x+1).' </text>';
            $text .= '<button type="button" onClick="'.initSystemModule.'(\''.$name.'\', \''.$hashId.'\')">'.$action.'</button>';
            $text .= '<text id="'.$hashId.'"></text><br><br>';
        }
    
        return $text;
    }

    public function loadAddFactoryModules($func) {
        $modules = ZscBase::getFactoryModuleArray(); 
        $num = count($modules);
        $text = '';
    
        for($x = 0; $x < $num; $x++) {
            $name = $modules[$x];
            $hashId = $name.'Hash'.$x;
            $action = '';
            $object = '';
            $action = "Set ".$name;
            
            $text .= '<text>Step - '.($x+1).' </text>';
            $text .= '<button type="button" onClick="'.addFactoryModule.'(\''.$name.'\', \''.$hashId.'\')">'.$action.'</button>';
            $text .= '<text id="'.$hashId.'"></text><br><br>';
        }
    
        return $text;
    }

    public function loadWalletManager($names, $symbols, $address) {
        $text = '<div class="well">';    
        
        $text .= '</div>';
    
        return $text;
    }
}
?>

