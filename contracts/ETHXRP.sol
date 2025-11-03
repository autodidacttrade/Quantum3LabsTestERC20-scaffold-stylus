// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

///ETHXRP - ERC20 mintable just by owner
contract ETHXRP is ERC20, Ownable {
    constructor(uint256 initialSupply) ERC20("ETHXRP", "EXRP") Ownable(msg.sender) {
        _mint(_msgSender(), initialSupply);
    }

    /// Function mint with parameters for "Recipient address" and "Amount" in wei(including decimals)
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
