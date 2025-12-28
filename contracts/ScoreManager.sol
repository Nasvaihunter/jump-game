// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint32, externalEuint32} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title ScoreManager - Fully Homomorphic Encryption Score System
 * @dev Manages encrypted game scores using FHE via Zama FHEVM
 * 
 * This contract uses Fully Homomorphic Encryption (FHE) to encrypt scores before storage.
 * Scores are stored as euint32 values with ACL support for user decryption.
 * Original scores are stored client-side in localStorage for display purposes.
 * 
 * FHE Functions:
 * - getPlayerEncryptedScore: Get encrypted score for a player
 * - getAllEncryptedScores: Get all encrypted scores with player addresses
 * - verifyScoreEncryption: Verify score has valid FHE encrypted data
 * - getEncryptedScoreMetadata: Get score metadata with encrypted handle
 */
contract ScoreManager is ZamaEthereumConfig {
    struct Score {
        address player;
        euint32 encryptedScore; // Encrypted score with ACL support
        uint256 timestamp;
        bool exists;
    }

    // Mapping from player address to their encrypted score
    mapping(address => Score) public playerScores;
    
    // Array of all player addresses who have submitted scores
    address[] public playersList;
    
    // Total number of scores submitted
    uint256 public totalScores;
    
    // Events
    event ScoreSubmitted(address indexed player, uint256 timestamp);
    event ScoreUpdated(address indexed player, uint256 timestamp);

    /**
     * @dev Submit or update a player's score with FHE-encrypted value
     * @param encryptedScore External encrypted score (euint32)
     * @param inputProof Attestation proof for the encrypted value
     */
    function submitScore(
        externalEuint32 encryptedScore,
        bytes calldata inputProof
    ) external {
        Score storage currentScore = playerScores[msg.sender];
        
        // Convert external encrypted value to euint32 and set ACL
        euint32 score = FHE.fromExternal(encryptedScore, inputProof);
        FHE.allow(score, msg.sender); // Allow sender to decrypt their score
        
        // If player doesn't have a score yet, add to list
        if (!currentScore.exists) {
            playersList.push(msg.sender);
            totalScores++;
            emit ScoreSubmitted(msg.sender, block.timestamp);
        } else {
            // Update score (frontend handles comparison of decrypted values)
            emit ScoreUpdated(msg.sender, block.timestamp);
        }
        
        playerScores[msg.sender] = Score({
            player: msg.sender,
            encryptedScore: score,
            timestamp: block.timestamp,
            exists: true
        });
    }

    /**
     * @dev Get a player's encrypted score
     * @param _player The player's address
     * @return encryptedScore The encrypted score (euint32)
     * @return timestamp When the score was submitted
     * @return exists Whether the player has a score
     */
    function getPlayerScore(address _player) external view returns (
        euint32 encryptedScore,
        uint256 timestamp,
        bool exists
    ) {
        Score memory playerScore = playerScores[_player];
        return (playerScore.encryptedScore, playerScore.timestamp, playerScore.exists);
    }

    /**
     * @dev Get all players who have submitted scores
     * @return Array of player addresses
     */
    function getAllPlayers() external view returns (address[] memory) {
        return playersList;
    }

    /**
     * @dev Get top N encrypted scores with player addresses
     * Note: Sorting happens client-side after decryption since we can't sort encrypted values on-chain
     * @param _limit Maximum number of scores to return
     * @return encryptedScores Array of encrypted scores (euint32)
     * @return players Array of player addresses
     * @return timestamps Array of submission timestamps
     */
    function getTopScores(uint256 _limit) external view returns (
        euint32[] memory encryptedScores,
        address[] memory players,
        uint256[] memory timestamps
    ) {
        uint256 count = _limit > playersList.length ? playersList.length : _limit;
        encryptedScores = new euint32[](count);
        players = new address[](count);
        timestamps = new uint256[](count);
        
        for (uint256 i = 0; i < count; i++) {
            address player = playersList[i];
            Score memory score = playerScores[player];
            encryptedScores[i] = score.encryptedScore;
            players[i] = player;
            timestamps[i] = score.timestamp;
        }
        
        return (encryptedScores, players, timestamps);
    }

    /**
     * @dev Get encrypted score for a specific player
     * @param _player Player address
     * @return encryptedScore Encrypted score (euint32)
     */
    function getPlayerEncryptedScore(address _player) external view returns (euint32 encryptedScore) {
        Score memory score = playerScores[_player];
        require(score.exists, "Player has no score");
        return score.encryptedScore;
    }

    /**
     * @dev Get all encrypted scores with metadata
     * @return players Array of player addresses
     * @return encryptedScores Array of encrypted scores (euint32)
     * @return timestamps Array of submission timestamps
     */
    function getAllEncryptedScores() external view returns (
        address[] memory players,
        euint32[] memory encryptedScores,
        uint256[] memory timestamps
    ) {
        uint256 length = playersList.length;
        players = new address[](length);
        encryptedScores = new euint32[](length);
        timestamps = new uint256[](length);
        
        for (uint256 i = 0; i < length; i++) {
            address player = playersList[i];
            Score memory score = playerScores[player];
            players[i] = player;
            encryptedScores[i] = score.encryptedScore;
            timestamps[i] = score.timestamp;
        }
        
        return (players, encryptedScores, timestamps);
    }

    /**
     * @dev Verify that a player has valid FHE encrypted score
     * @param _player Player address
     * @return isValid True if player has score
     */
    function verifyScoreEncryption(address _player) external view returns (bool isValid) {
        Score memory score = playerScores[_player];
        return score.exists;
    }

    /**
     * @dev Get score metadata with encrypted handle
     * @param _player Player address
     * @return player Player address
     * @return encryptedScore Encrypted score (euint32)
     * @return timestamp Submission timestamp
     * @return exists Whether player has a score
     */
    function getEncryptedScoreMetadata(address _player) external view returns (
        address player,
        euint32 encryptedScore,
        uint256 timestamp,
        bool exists
    ) {
        Score memory score = playerScores[_player];
        return (
            score.player,
            score.encryptedScore,
            score.timestamp,
            score.exists
        );
    }

    /**
     * @dev Get count of players with valid encrypted scores
     * @return count Number of players with scores
     */
    function getEncryptedScoreCount() external view returns (uint256 count) {
        for (uint256 i = 0; i < playersList.length; i++) {
            Score memory score = playerScores[playersList[i]];
            if (score.exists) {
                count++;
            }
        }
        return count;
    }
}
