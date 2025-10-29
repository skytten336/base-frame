// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol"; // для override-списку
import "@openzeppelin/contracts/access/Ownable.sol";

error NonTransferable();

contract RandomFourNFT is ERC721URIStorage, Ownable {
    uint256 private _nextId;
    string[] private _tokenURIs;

    constructor(string[] memory uris)
        ERC721("RandomFourNFT", "RFNFT")
        Ownable(msg.sender)
    {
        require(uris.length == 4, "Need exactly 4 URIs");
        _tokenURIs = uris;
    }

    function mint() external returns (uint256) {
        uint256 id = _nextId;
        _nextId = id + 1;

        // простий рандом 0..3
        uint256 idx = uint256(
            keccak256(abi.encodePacked(block.prevrandao, block.timestamp, msg.sender, id))
        ) % _tokenURIs.length;

        _safeMint(msg.sender, id);
        _setTokenURI(id, _tokenURIs[idx]);
        return id;
    }

    function totalMinted() external view returns (uint256) {
        return _nextId;
    }

    // === SOULBOUND: блокуємо будь-який transfer (допускаємо лише mint/burn)
    function _update(address to, uint256 tokenId, address auth)
        internal
        override
        returns (address)
    {
        address from = _ownerOf(tokenId);
        if (from != address(0) && to != address(0)) {
            revert NonTransferable();
        }
        return super._update(to, tokenId, auth);
    }

    // === SOULBOUND: блокуємо апруви через public-методи (вони virtual у v5)
    function approve(address /*to*/, uint256 /*tokenId*/)
        public
        virtual
        override(ERC721, IERC721)
    {
        revert NonTransferable();
    }

    function setApprovalForAll(address /*operator*/, bool /*approved*/)
        public
        virtual
        override(ERC721, IERC721)
    {
        revert NonTransferable();
    }
}
