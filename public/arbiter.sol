pragma solidity ^0.6.1;

contract election{
    struct Candidate{
        string name;
        uint voteCount;
    }
    struct voter{
        bool authorized;
        bool voted;
        uint vote;
    }
//deploys contract so every node in blockchain is connected to it. Those are state variables
    addres public owner {
string public electionName;

mapping(address =>) public voters;
Candidate[] public candidates;
uint public totalVotes;
    }
modifier ownerOnly(){
    require(msg.sender == owner);
    _;
    // _; represent the the rest of the function below
}

function election(String, _name) public{
owner= msg.sender;
electionName = _name;
}