/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./log_base.sol";

contract LogTransaction is LogBase {

    struct LogInfo {
        uint now_;
        string info_;
    }

    bytes32 name_;
    uint nos_;
    mapping(uint => LogInfo) log_;

    constructor() public LogBase() {}

    function initLog(bytes32 _name) public {
        checkDelegate(msg.sender, 1);

        name_ = _name;
        nos_ = 0;
    }

    function addLog(string _log, bool _newLine) public {
        if(true == _newLine && 0 < nos_) {
            nos_++;
            log_[nos_].info_ = _log;

        } else {
            log_[nos_].info_ = PlatString.append(log_[nos_].info, _log);
        }
        log_[nos_].now_ = now;
    }
    
    function printLog(uint _index) public view returns (string) {
        checkDelegate(msg.sender, 1);

        if(_index > print_log_.nos_ ) 
            return "null";

        string memory str = PlatString.bytes32ToString(name_);
        str = PlatString.append("[", str, "] ", log_[_index].info_);
        return str;
    }

    function printLogByTime(uint _startTime, uint _endTime) public view returns (string) {

        /* check param */
        require(_endTime > _startTime);

        checkDelegate(msg.sender, 1);

        string memory str = PlatString.bytes32ToString(name_);
        str = PlatString.append("[", str, "]\n");
        for(uint i=0; i<=nos_; i++) {
            if(_startTime <= log_[i].now_  && _endTime >= log_[i].now_) {
                string memory time = PlatString.uintToString(log_[i].now_);
                str = PlatString.append(str, "[", time, "} ",log_[i].info_, "\n");
            }
        }
        return str;
    }
}
