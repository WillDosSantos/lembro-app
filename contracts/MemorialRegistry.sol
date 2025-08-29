// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract MemorialRegistry is Ownable {
    struct Record {
        bytes32 contentHash;
        string storageURI;
        address publisher;
        uint64 timestamp;
        bool locked;
    }

    mapping(uint256 => Record[]) private _versions;
    uint256 public nextMemorialId = 1;

    event MemorialPublished(
        uint256 indexed memorialId,
        uint256 indexed version,
        bytes32 contentHash,
        string storageURI,
        address indexed publisher,
        bool locked
    );
    event MemorialLocked(uint256 indexed memorialId);

    // 🔧 OZ v5 requires this
    constructor() Ownable(msg.sender) {}

    modifier memorialExists(uint256 memorialId) {
        require(_versions[memorialId].length > 0, "Memorial: not found");
        _;
    }

    function publish(
        bytes32 contentHash,
        string calldata storageURI,
        bool lockImmediately
    ) external returns (uint256 memorialId, uint256 version) {
        require(contentHash != bytes32(0), "Invalid hash");
        require(bytes(storageURI).length > 0, "Invalid URI");

        memorialId = nextMemorialId++;
        _versions[memorialId].push(
            Record({
                contentHash: contentHash,
                storageURI: storageURI,
                publisher: msg.sender,
                timestamp: uint64(block.timestamp),
                locked: lockImmediately
            })
        );

        emit MemorialPublished(memorialId, 0, contentHash, storageURI, msg.sender, lockImmediately);
        if (lockImmediately) emit MemorialLocked(memorialId);
        return (memorialId, 0);
    }

    function appendVersion(
        uint256 memorialId,
        bytes32 newContentHash,
        string calldata newStorageURI
    ) external memorialExists(memorialId) returns (uint256 version) {
        Record memory last = _versions[memorialId][_versions[memorialId].length - 1];
        require(!last.locked, "Memorial is locked");
        require(msg.sender == last.publisher || msg.sender == owner(), "Not authorized");
        require(newContentHash != bytes32(0), "Invalid hash");
        require(bytes(newStorageURI).length > 0, "Invalid URI");

        version = _versions[memorialId].length;
        _versions[memorialId].push(
            Record({
                contentHash: newContentHash,
                storageURI: newStorageURI,
                publisher: msg.sender,
                timestamp: uint64(block.timestamp),
                locked: false
            })
        );

        emit MemorialPublished(memorialId, version, newContentHash, newStorageURI, msg.sender, false);
        return version;
    }

    function lock(uint256 memorialId) external memorialExists(memorialId) {
        Record storage last = _versions[memorialId][_versions[memorialId].length - 1];
        require(!last.locked, "Already locked");
        require(msg.sender == last.publisher || msg.sender == owner(), "Not authorized");
        last.locked = true;
        emit MemorialLocked(memorialId);
    }

    // Views
    function latest(uint256 memorialId) external view memorialExists(memorialId) returns (Record memory) {
        return _versions[memorialId][_versions[memorialId].length - 1];
    }

    function versionCount(uint256 memorialId) external view memorialExists(memorialId) returns (uint256) {
        return _versions[memorialId].length;
    }

    function getVersion(uint256 memorialId, uint256 version) external view memorialExists(memorialId) returns (Record memory) {
        require(version < _versions[memorialId].length, "Bad version");
        return _versions[memorialId][version];
    }
}
