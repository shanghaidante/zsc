/*
Copyright (c) 2018 ZSC Dev.
*/

pragma solidity ^0.4.18;

import "./object.sol";

contract PosBlockPool is Object {
    enum BlockStatus {NULL, PENDING, MINED}

    struct Transaction {
        bytes32 txhash_;
        address sender_;
        address receiver_;
        uint gasUsage_;
        uint reigsterTime_;
    }
    
    struct Block {
        BlockStatus status_;
        uint blockLimit_;
        uint nosTransaction_;
        uint currentSize_;
    }

    struct BlockPool {
        uint nosBlocks_;
        uint minedGasUsage_;
        uint remaingGasUsage_;
        mapping(uint => Block) blocks_;
    }

    BlockPool private blockPool_;
    Block private currentBlock_;
    uint private blockUnitLimit_;
    uint private lastPendingBlockIndex_;

    // Constructor
    function PosBlockPool() {
        blockPool_.nosBlocks_ = 0;
        currentBlock_.blockLimit_ = 0;
        currentBlock_.nosTransaction_ = 0;
        currentBlock_.currentBlock_ = 0;
        lastPendingIndex_ = 0;
        blockUnitLimit_ = 0;

        //The first block is empty
        blockPool_[blockPool_.nosBlocks_] = currentBlock_;
        blockPool_.nosBlocks_ = 1;
    } 
    
    function setBlockUnitLimit(uint _limit /*in terms of gas usage*/) public only_delegate {
        blockUnitLimit_ = _limit;
        resetCurrentBlock();
    }

    function resetCurrentBlock() internal {
        currentBlock_.status_ = BlockStatus.PENDING;
        currentBlock_.blockLimit_ = blockUnitLimit_;
        currentBlock_.nosTransaction_ = 0;
        ucurrentBlock_.currentSize_ = 0;
    }

    function registerTransaction(bytes32 _tx, bytes32 _sender, bytes32 _receiver, uint _gasUsage) public constant only_delegate {
        uint currentSize = currentBlock_.currentBlock_ + _gasUsage;
        uint index;
        if (currentSize > blockUnitLimit_) {
            blockPool_[blockPool_.nosBlocks_] = currentBlock_;
            blockPool_.nosBlocks_++;
            blockPool_.remaingGasUsage_ += currentBlock_.currentBlock_;

            resetCurrentBlock();

            currentSize = _gasUsage;
        }
        currentBlock_(currentBlock_.nosTransaction_) = Transaction(_tx, _sender, _receiver, _gasUsage, now);
        currentBlock_.nosTransaction_++;
        currentBlock_.currentSize_ = currentSize;
    }

    function getLastPendingBlockIndex() internal constant returns (uint) { 
        if (lastPendingBlockIndex_ == blockPool_.nosBlocks_) return 0;
        return lastPendingBlockIndex_; 
    }

    function getBlockNos() internal constant returns (uint) { 
        return blockPool_.nosBlocks_ ; 
    }

    function getBlockSizeByIndex(uint _index) internal constant returns (uint) { 
        return blockPool_.blocks_[_index].currentSize_; 
    }

    function getUnminedGas() internal constant returns (uint) { 
        return blockPool_.remaingGasUsage_;
    }

    function setBlockMinedByIndex(uint _index) internal constant {
        if (_index < blockPool_.nosBlocks_) {
            blockPool_.blocks_[_index].status_ = BlockStatus.PENDING;
            blockPool_.remaingGasUsage_ -= blockPool_.blocks_[_index].currentSize_;
        }
    }

}