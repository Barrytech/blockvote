pragma solidity ^0.6.3;

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
address public owner;
string public electionName;

mapping(address => voter) public voters;
Candidate[] public candidates;
uint public totalVotes;
    
    
modifier ownerOnly(){
    require(msg.sender == owner);
    _;
    // _; represent the the rest of the function below
}

function elect(string memory _name) public{
owner= msg.sender;
electionName = _name;
}
}