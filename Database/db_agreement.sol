/*
Copyright (c) 2018, ZSC Dev Team
2017-12-18: v0.01
2018-02-08: v0.01
*/

pragma solidity ^0.4.17;
import "./db_entity.sol";
import "./db_idmanager.sol";

contract DBAgreement is DBEntity {
    enum AgreementStatus { UNDEFINED, ONGOING, CANCLED, PAID, NOTPAID}
    DBIDManager receiverIDs_;
    DBIDManager providerIDs_;
    DBIDManager templateIDs_;

    AgreementStatus agreementStatus_;

    // Constructor
    function DBAgreement(bytes32 _name) public DBEntity(_name) {
        setEntityType("agreement");
        initParameters();
    }

    function initParameters() internal {
        addParameter("startDate");
        addParameter("endDate");
        addParameter("signDate");
        addParameter("insuredAmount");
        addParameter("paymentAmount");
    }

    function setProvider(address _id, bool _status) public only_delegate returns (bool) {
        if (_status == true) {
            return providerIDs_.addID(_id);
        } else {
            return providerIDs_.removeID(_id);
        }
    }

    function setReceiver(address _id, bool _status) public only_delegate returns (bool) {
        if (_status == true) {
            return providerIDs_.addID(_id);
        } else {
            return providerIDs_.removeID(_id);
        }
    }

    function setTemplate(address _id, bool _status) public only_delegate returns (bool) {
        if (_status == true) {
            //current version only allows single template for each agreement
            require(templateIDs_.numIDs() < 1);
            return templateIDs_.addID(_id);
        } else {
            return templateIDs_.removeID(_id);
        }
    }

    function getParticipantsNos() public only_delegate constant returns (uint, uint, uint) {
        return (providerIDs_.numIDs(), receiverIDs_.numIDs(), templateIDs_.numIDs());
    }
}


