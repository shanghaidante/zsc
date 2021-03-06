/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./object.sol";

contract ControlApis is Object {
    function createElement(uint _typeInUint, bytes32 _enName, bytes32 _extraInfo, address _extraAdr) public returns (address);
    function enableElementWallet(uint _typeInUint/*5: eth; 6: erc20*/, bytes32 _enName, bytes32 _tokeSymbol, address _extraAdr) public returns (address);
    function setUserActiveStatus(bytes32 _user, bool _tag) public returns (bool);
}

contract AdmBase is Object {
    struct TestUserInfo {
        bytes32 name_ ;
        bytes32 status_ ; //0: not exist; 1: added; 2: applied; 3: approved;  4: locked
        bytes32 type_;    //1: provider; 2: receiver; 3: staker
        address id_   ;
        address node_ ;
    }
    TestUserInfo[] testUsers_;
    mapping(bytes32 => uint) private userIndex_;
    mapping(bytes32 => address) private systemAdrs_;

    address private zscTestTokenAddress_;
    string private controlApisFullAib_;

    modifier only_added(bytes32 _hexx) {require(testUsers_[userIndex_[_hexx]].status_ == 1); _;}
    
    constructor(bytes32 _name) public Object(_name) {}

    function toHexx(bytes32 _value) internal constant returns (bytes32);

    function getUserIndex(bytes32 _hexx) internal constant returns (uint) { 
        return userIndex_[_hexx]; 
    }

    function setZSCTestTokenAddress(address _adr) public { 
        checkDelegate(msg.sender, 1);
        zscTestTokenAddress_ = _adr; 
    }

    function setControlApisFullAbi(string _fullAbi) public { 
        checkDelegate(msg.sender, 1);
        controlApisFullAib_ = _fullAbi; 
    }

    function getControlApisFullAbi() public constant returns (string) { 
        return controlApisFullAib_; 
    }

    function setAdrs(address _controlApis,
                     address _dbDatabase,
                     address _factoryPro,
                     address _factoryRec,
                     address _factoryTmp,
                     address _factoryAgr) 
        public {
        checkDelegate(msg.sender, 1);

        if (_controlApis != 0) systemAdrs_["ControlApis"] = _controlApis;
        if (_dbDatabase != 0)  systemAdrs_["DBDatabase"]  = _dbDatabase;
        if (_factoryPro != 0)  systemAdrs_["FactoryPro"]  = _factoryPro;
        if (_factoryRec != 0)  systemAdrs_["FactoryRec"]  = _factoryRec;
        if (_factoryTmp != 0)  systemAdrs_["FactoryTmp"]  = _factoryTmp;
        if (_factoryAgr != 0)  systemAdrs_["FactoryAgr"]  = _factoryAgr;
    }

    function getControlApisAdr() public constant returns (address){ return systemAdrs_["ControlApis"]; }
    function getDBDatabaseAdr()  public constant returns (address) { checkDelegate(msg.sender, 1); return systemAdrs_["DBDatabase"]; }
    function getFactoryProAdr()  public constant returns (address) { checkDelegate(msg.sender, 1); return systemAdrs_["FactoryPro"] ; }
    function getFactoryRecAdr()  public constant returns (address) { checkDelegate(msg.sender, 1); return systemAdrs_["FactoryRec"] ; }
    function getFactoryTmpAdr()  public constant returns (address) { checkDelegate(msg.sender, 1); return systemAdrs_["FactoryTmp"] ; }
    function getFactoryAgrAdr()  public constant returns (address) { checkDelegate(msg.sender, 1); return systemAdrs_["FactoryAgr"] ; }
    
    function addUser(bytes32 _user) public {
        checkOwner(msg.sender);

        bytes32 ret = toHexx(_user);
        require(testUsers_[userIndex_[ret]].status_ ==0);

        userIndex_[ret] = testUsers_.length;
        testUsers_.push(TestUserInfo(_user, "added", 0, 0x0, 0x0));

        addLog("add a User - ", true);
        addLog(PlatString.bytes32ToString(_user), false);
    }

    function applyForUser(bytes32 _hexx, bytes32 _type) public only_added(_hexx)  {
        uint index = getUserIndex(_hexx);
        testUsers_[index].status_ = "applied";
        testUsers_[index].type_ = _type;
        testUsers_[index].id_ = msg.sender;
    }

    function approveUser(bytes32 _name) public {
        checkDelegate(msg.sender, 1);

        bytes32 hexx = toHexx(_name);
        uint index = getUserIndex(hexx);
        require (testUsers_[index].status_ == "applied");

        bytes32 userType = testUsers_[index].type_; 
        require(userType == "provider" || userType == "receiver" || userType == "staker");

        uint typeUint;
        if (userType == "provider") typeUint = 1;
        else if (userType == "provider") typeUint = 2;
        else if (userType == "staker") typeUint = 3;

        address adr = ControlApis(systemAdrs_["controlApis"]).createElement(typeUint, testUsers_[index].name_, "", testUsers_[index].id_);
        require (adr != 0x0);
        ControlApis(systemAdrs_["controlApis"]).setUserActiveStatus(_name, true);

        testUsers_[index].node_ = adr;
        testUsers_[index].status_ = "approved";

        approveWallet(systemAdrs_["controlApis"], userType, _name, testUsers_[index].id_);
        ///transferAnyERC20Token(zscTestTokenAddress_, _ZSCTAmount);
    }

    function setUserStatus(bytes32 _name, bool _tag) public {
        checkDelegate(msg.sender, 1);

        ControlApis(systemAdrs_["controlApis"]).setUserActiveStatus(_name, _tag);
    }

    function numUsers() public constant returns (uint) {
        checkDelegate(msg.sender, 1);
        return testUsers_.length;
    }

    function getUserInfoByIndex(uint _index) public constant returns (string) {
        checkDelegate(msg.sender, 1);

        require(_index < testUsers_.length);
        string memory str ="";
        str = PlatString.append(str, "info?name=", PlatString.bytes32ToString(testUsers_[_index].name_),   "&");
        str = PlatString.append(str, "status=",    PlatString.bytes32ToString(testUsers_[_index].status_), "&");
        str = PlatString.append(str, "type=",      PlatString.bytes32ToString(testUsers_[_index].type_),   "&");
        str = PlatString.append(str, "id=",        PlatString.addressToString(testUsers_[_index].id_),     "&");
        str = PlatString.append(str, "node=",      PlatString.addressToString(testUsers_[_index].node_),   "&");
        return str;
    }

    function tryLogin(bytes32 _user) public constant returns (bytes32) {
        bytes32 hexx = toHexx(_user);
        if (testUsers_[userIndex_[hexx]].status_ == 0) {
            return 0x0;
        } else {
            return hexx;
        }
    }

    function keepOnline(bytes32 _user, bytes32 _hexx) public only_added(_hexx) constant returns (bool) {
        if (testUsers_[userIndex_[_hexx]].name_ == _user)
            return true;
        else 
            return false;
    }

    function getUserStatus(bytes32 _hexx) public only_added(_hexx) constant returns (bytes32) {
        return testUsers_[userIndex_[_hexx]].status_;
    }

    function getUserType(bytes32 _hexx) public only_added(_hexx) constant returns (bytes32) {
        return testUsers_[userIndex_[_hexx]].type_;
    }

    function approveWallet(address _controlApisAdr, bytes32 _userType, bytes32 _userName, address _creator) internal {
        if (_userType == "provider" || _userType == "receiver") {
            ControlApis(_controlApisAdr).enableElementWallet(4 /* wallet-eth */, _userName, "ETH", _creator);
        } else if (_userType == "staker") {
            ControlApis(_controlApisAdr).enableElementWallet(5 /* wallet-erc20 */, _userName, "ZSC", _creator);
        } else {

        }
    }

}
