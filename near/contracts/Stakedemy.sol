// SPDX-License-Identifier: MIT
pragma solidity 0.8.5;

import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract Stakedemy is ERC721Enumerable, Ownable {  
    using Address for address;
    
    // Starting and stopping sale, presale and whitelist
    bool public saleActive = false;
    bool public whitelistActive = false;
    bool public presaleActive = false;

    // Price of each token
    uint256 public initial_price = 0.001 ether;
    uint256 public price;

    // Maximum limit of tokens that can ever exist
    uint256 public constant MAX_SUPPLY = 100;
    uint256 public constant MAX_PRESALE_SUPPLY = 1;
    uint256 public constant MAX_MINT_PER_TX = 1;

    // The base link that leads to the image / video of the token
    string public baseTokenURI = "https://raw.githubusercontent.com/Davitcoin/OpenWeb-CryptoMX/main/StakedemyNFT/";

    // Team addresses for withdrawals
    address public a1;

    // List of addresses that have a number of reserved tokens for whitelist
    mapping (address => uint256) public whitelistReserved;

    constructor () ERC721 ("Stakedemy", "SKM") {
        price = initial_price;
    }

    // Override so the openzeppelin tokenURI() method will use this method to create the full tokenURI instead
    function _baseURI() internal view virtual override returns (string memory) {
        return baseTokenURI;
    }

    // See which address owns which tokens
    function tokensOfOwner(address addr) public view returns(uint256[] memory) {
        uint256 tokenCount = balanceOf(addr);
        uint256[] memory tokensId = new uint256[](tokenCount);
        for(uint256 i; i < tokenCount; i++){
            tokensId[i] = tokenOfOwnerByIndex(addr, i);
        }
        return tokensId;
    }

    // Exclusive whitelist minting
    function mintWhitelist(uint256 _amount) public payable {
        uint256 supply = totalSupply();
        uint256 reservedAmt = whitelistReserved[msg.sender];
        require( whitelistActive,                   "Whitelist isn't active" );
        require( reservedAmt > 0,                   "No tokens reserved for your address" );
        require( _amount <= reservedAmt,            "Can't mint more than reserved" );
        require( supply + _amount <= MAX_SUPPLY,    "Can't mint more than max supply" );
        require( msg.value == price * _amount,      "Wrong amount of ETH sent" );
        whitelistReserved[msg.sender] = reservedAmt - _amount;
        for(uint256 i; i < _amount; i++){
            _safeMint( msg.sender, supply + i );
        }
    }

    // Standard mint function
    function mintToken(uint256 _amount) public payable {
        uint256 supply = totalSupply();
        require( saleActive,                                "Sale isn't active" );
        require( _amount > 0 && _amount <= MAX_MINT_PER_TX, "Can only mint between 1 and 10 tokens at once" );
        require( supply + _amount <= MAX_SUPPLY,            "Can't mint more than max supply" );
        require( msg.value == price * _amount,              "Wrong amount of ETH sent" );
        for(uint256 i; i < _amount; i++){
            _safeMint( msg.sender, supply + i );
        }
    }
    
    // Edit reserved whitelist spots
    function editWhitelistReserved(address[] memory _a, uint256[] memory _amount) public onlyOwner {
        for(uint256 i; i < _a.length; i++){
            whitelistReserved[_a[i]] = _amount[i];
        }
    }

    // Start and stop whitelist
    function setWhitelistActive(bool val) public onlyOwner {
        whitelistActive = val;
    }

    // Start and stop sale
    function setSaleActive(bool val) public onlyOwner {
        saleActive = val;
    }

    // Set new baseURI
    function setBaseURI(string memory baseURI) public onlyOwner {
        baseTokenURI = baseURI;
    }

    // Set a different price in case ETH changes drastically
    function setPrice(uint256 newPrice) public onlyOwner {
        price = newPrice;
    }

    // Set team addresses
    function setAddresses(address[] memory _a) public onlyOwner {
        a1 = _a[0];
    }

    // Withdraw funds from contract for the team
    function withdrawTeam(uint256 amount) public payable onlyOwner {
        uint256 percent = amount / 100;
        require(payable(a1).send(percent * 100));
    }
}