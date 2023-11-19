// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;


interface IVerifier {


     function verifyProof(
            uint[2] memory a,
            uint[2][2] memory b,
            uint[2] memory c,
            uint[1] memory input
        )external view returns (bool);

}

contract Treasury {
    address public owner;
    mapping(address => uint) public balances;
        address public verifierAddress;


    event Deposit(address indexed account, uint amount);
    event Withdrawal(address indexed account, uint amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }


     constructor (address _verifierAddress) {
      verifierAddress = _verifierAddress;
        owner = msg.sender;

    }


    
        function verifyProof(
        uint[2] memory a,
            uint[2][2] memory b,
            uint[2] memory c,
            uint[1] memory input
    ) public view returns (bool) {
        return IVerifier(verifierAddress).verifyProof(a, b, c, input);
    }


        function verifyTx(
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[1] memory input
    ) public view returns (bool) {
        // require(verifyProof(a, b, c, input), "Failed proof check");
        require(verifyProof(a, b, c, input), "Failed proof check");
        return true;
    }



    function withdraw(uint amount,uint[2] memory a,uint[2][2] memory b, uint[2] memory c,uint[1] memory input) public {
        require(amount > 0, "Withdrawal amount must be greater than 0");
        require(amount <= balances[msg.sender], "Insufficient funds");
        require(verifyTx(a, b, c, input), "Invalid proof");
        balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
        emit Withdrawal(msg.sender, amount);
    }

    function getBalance() public view returns (uint) {
        return balances[msg.sender];
    }


}
