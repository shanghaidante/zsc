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
            $tex = 'null';
        } else { 
            $text = fread($myfile,filesize($file));
            fclose($myfile);
        }
        return $text;
    }

    public function writeContent($file, $text) {
                print_r($file);
                print_r($text);

        $myfile = fopen($file, "wr") or die("Unable to open file!");
        fwrite($myfile, $text);
        fclose($myfile);
    }

    public function getModuleArray() { 
        return array("LogRecorder", "AdmAdv", "DBDatabase", "FactoryPro", "FactoryTmp", "FactoryAgr", "ControlApisAdv");
    } 

    public function getLogedModuleArray() {
        return array("AdmAdv", "DBDatabase", "FactoryPro", "FactoryTmp", "FactoryAgr", "ControlApisAdv");
    }
    
    public function getLogedModuleNameArrayInString() {
        return "['AdmAdv', 'DBDatabase', 'FactoryPro', 'FactoryTmp', 'FactoryAgr', 'ControlApisAdv']";
    }
}
?>