/*
Copyright (c) 2018, ZSC Dev Team
2018-02-12: v0.01
*/

pragma solidity ^0.4.18;
import "./plat_math.sol";
import "./object.sol";

contract CallbackDatabase is Object {
    function getRootNode() public only_delegate returns (address);
    function getNode(bytes32 _name) public only_delegate constant returns (address);
    function destroyNode(address _node) public only_delegate returns (bool);
    function _addNode(address _node) only_delegate public ;
    function _recordNodeParameterValue(bytes32 _nodeName, bytes32 _paraName, string _value) only_delegate public ;
    function _getNodeParameterValue(bytes32 _nodeName, bytes32 _paraName) public only_delegate constant returns (string);
}

contract DBNode is Object {
    address database_ = address(0);
    address parent_ = address(0);
    address[] children_;
    mapping(bytes32 => address) childMap_;

    // Constructor
    function DBNode(bytes32 _name) public Object(_name) {
    }

    function setDatabase(address _database) public only_delegate {
        database_ = _database;
        CallbackDatabase(database_)._addNode(this);
    }

    function numChildren() public only_delegate constant returns(uint) {
        return children_.length;
    }
    
    function setParent(address _parent) public only_delegate {
        if (parent_ == address(0)) {
            parent_ = _parent;
            if (parent_ != address(0)) {
               setDelegate(parent_, true);
            }
        }
    }

    function getParent() public only_delegate constant returns(address) {
        return parent_; 
    }

    function removeFromParent() public only_delegate {
        if (parent_ != address(0)) {
            DBNode(parent_).removeChild(name());
        }
        parent_ = address(0);
    }

    function addChild(address _node) public only_delegate returns (address) {
        if (_node == 0) return 0;
        DBNode(_node).setParent(this);

        CallbackDatabase(database_).setDelegate(_node, true);
        DBNode(_node).setDatabase(database_);
        
        children_.push(_node);
        childMap_[DBNode(_node).name()] = _node;
        return _node;
    }

    function getChild(bytes32 _name) public only_delegate constant returns(address) {
        require(childMap_[_name] != 0);
        return childMap_[_name];
    }
    
    function getChildByIndex(uint _index) public only_delegate constant returns(address) {
        require(_index < children_.length);
        return children_[_index];
    }

    function removeChild(bytes32 _name) public only_delegate returns (address) {
        if (childMap_[_name] == 0) {
            return 0;
        }

        address nd;
        for (uint i = 0; i < children_.length; ++i) {
            if (DBNode(children_[i]).name() == _name) {
                nd = children_[i];
                children_[i] = children_[children_.length - 1];
                break;
            }
        }
        delete children_[children_.length - 1];
        children_.length --;
        delete childMap_[_name];

        DBNode(nd).setDelegate(parent_, false);
        return nd;
    }

    function removeAndDestroyAllChildren() public only_delegate {
        if (children_.length == 0) {
            return;
        }

        for (uint i = 0; i < children_.length; ++i) {
            CallbackDatabase(database_).destroyNode(children_[i]);
            delete childMap_[DBNode(children_[i]).name()];
        }
        children_.length = 0;
    }  
}


