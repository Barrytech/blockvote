pragma solidity ^0.6.3;

contract Election{
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
    //hello world
    function Election(string memory _name) public{
    owner= msg.sender;
    electionName = _name;
    }

    //add a new candidate 
    function addCandidate(String _name) public {
        candidates.push(Candidate(_name, 0));
    }

    function getNumberOfCandidate() public view returns(uni) {
        return candidates.length;
    }

    function authorize(address _person) ownerOnly public {
        voters[_person].autorized = true;
    }

    function vote(uni  _voteIndex) public {
        require(!voters[msg.sender].voted);
        require(voters[msg.sender].autorized);

        voters[msg.sender].vote = voteIndex;
        voters[msg.sender].voted = true;

        candidates[_voteIndex].voteCount +=  1;
        totalVotes += 1;
    }

//destroy the contract and wont be reusable 
    // function end() ownerOnly public {
    //     selfdestruct(owner);
    // }

}