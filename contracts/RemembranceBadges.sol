// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

contract RemembranceBadges is ERC1155, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    mapping(address => mapping(uint256 => bool)) public claimed;
    mapping(uint256 => uint256) public totalHolders;        // badgeId -> unique holders
    mapping(uint256 => uint256) public candlesForMemorial;  // memorialId -> unique candles (per account/year)

    event CandleLit(address indexed account, uint256 indexed memorialId, uint16 indexed year, uint256 badgeId);

    constructor(string memory baseURI, address admin) ERC1155(baseURI) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MINTER_ROLE, admin);
    }

    function badgeIdFor(uint256 memorialId, uint16 year) public pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked("REMEMBRANCE_BADGE", memorialId, year)));
    }

    function lightCandle(address to, uint256 memorialId, uint16 year) external onlyRole(MINTER_ROLE) {
        require(to != address(0), "Bad recipient");
        uint256 id = badgeIdFor(memorialId, year);
        require(!claimed[to][id], "Already claimed");

        claimed[to][id] = true;
        _mint(to, id, 1, "");

        totalHolders[id] += 1;
        candlesForMemorial[memorialId] += 1;

        emit CandleLit(to, memorialId, year, id);
    }

    /* =========================
       Soulbound: block transfers
       ========================= */

    function safeTransferFrom(
        address, /*from*/
        address, /*to*/
        uint256, /*id*/
        uint256, /*amount*/
        bytes memory /*data*/
    ) public virtual override {
        revert("Soulbound: non-transferable");
    }

    function safeBatchTransferFrom(
        address, /*from*/
        address, /*to*/
        uint256[] memory, /*ids*/
        uint256[] memory, /*amounts*/
        bytes memory /*data*/
    ) public virtual override {
        revert("Soulbound: non-transferable");
    }

    // Optional: also block approvals to avoid confusion
    function setApprovalForAll(address, bool) public virtual override {
        revert("Soulbound: approvals disabled");
    }

    /* ============== */

    // Multiple inheritance override
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC1155, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    // Optional admin burn
    function adminBurn(address from, uint256 memorialId, uint16 year) external onlyRole(DEFAULT_ADMIN_ROLE) {
        uint256 id = badgeIdFor(memorialId, year);
        require(balanceOf(from, id) == 1, "No badge");
        _burn(from, id, 1);
    }

    function setURI(string calldata newUri) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _setURI(newUri);
    }
}
