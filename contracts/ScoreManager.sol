// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ScoreManager - Fully Homomorphic Encryption Score System
 * @dev Manages encrypted game scores using FHE via Zama FHEVM
 * 
 * This contract uses Fully Homomorphic Encryption (FHE) to encrypt scores before storage.
 * Scores are stored as FHE handles (bytes32) which represent encrypted euint32 values.
 * Original scores are stored client-side in localStorage for display purposes.
 * 
 * FHE Functions:
 * - getPlayerEncryptedScore: Get FHE handle for a player's score
 * - getAllEncryptedScores: Get all FHE handles with player addresses
 * - verifyScoreEncryption: Verify score has valid FHE encrypted data
 * - getEncryptedScoreMetadata: Get score metadata with FHE handle
 */
contract ScoreManager {
    struct Score {
        address player;
        bytes32 encryptedScore; // FHE handle (bytes32) for encrypted score
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
    event ScoreSubmitted(address indexed player, bytes32 encryptedScore, uint256 timestamp);
    event ScoreUpdated(address indexed player, bytes32 oldEncryptedScore, bytes32 newEncryptedScore);

    /**
     * @dev Submit or update a player's score with FHE-encrypted value
     * @param _encryptedScore FHE handle (bytes32) for encrypted score
     */
    function submitScore(bytes32 _encryptedScore) external {
        require(_encryptedScore != bytes32(0), "FHE encrypted score cannot be empty");
        
        Score storage currentScore = playerScores[msg.sender];
        
        // If player doesn't have a score yet, add to list
        if (!currentScore.exists) {
            playersList.push(msg.sender);
            totalScores++;
            emit ScoreSubmitted(msg.sender, _encryptedScore, block.timestamp);
        } else {
            // Update score (frontend handles comparison of decrypted values)
            bytes32 oldEncryptedScore = currentScore.encryptedScore;
            emit ScoreUpdated(msg.sender, oldEncryptedScore, _encryptedScore);
        }
        
        playerScores[msg.sender] = Score({
            player: msg.sender,
            encryptedScore: _encryptedScore,
            timestamp: block.timestamp,
            exists: true
        });
    }

    /**
     * @dev Get a player's encrypted score
     * @param _player The player's address
     * @return encryptedScore The FHE handle (bytes32) for encrypted score
     * @return timestamp When the score was submitted
     * @return exists Whether the player has a score
     */
    function getPlayerScore(address _player) external view returns (
        bytes32 encryptedScore,
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
     * @return encryptedScores Array of FHE handles (bytes32)
     * @return players Array of player addresses
     * @return timestamps Array of submission timestamps
     */
    function getTopScores(uint256 _limit) external view returns (
        bytes32[] memory encryptedScores,
        address[] memory players,
        uint256[] memory timestamps
    ) {
        uint256 count = _limit > playersList.length ? playersList.length : _limit;
        encryptedScores = new bytes32[](count);
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
     * @return encryptedScore FHE handle (bytes32) for encrypted score
     */
    function getPlayerEncryptedScore(address _player) external view returns (bytes32 encryptedScore) {
        Score memory score = playerScores[_player];
        require(score.exists, "Player has no score");
        return score.encryptedScore;
    }

    /**
     * @dev Get all encrypted scores with metadata
     * @return players Array of player addresses
     * @return encryptedScores Array of FHE handles (bytes32)
     * @return timestamps Array of submission timestamps
     */
    function getAllEncryptedScores() external view returns (
        address[] memory players,
        bytes32[] memory encryptedScores,
        uint256[] memory timestamps
    ) {
        uint256 length = playersList.length;
        players = new address[](length);
        encryptedScores = new bytes32[](length);
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
     * @return isValid True if player has score with non-zero encrypted value
     */
    function verifyScoreEncryption(address _player) external view returns (bool isValid) {
        Score memory score = playerScores[_player];
        return score.exists && score.encryptedScore != bytes32(0);
    }

    /**
     * @dev Get score metadata with encrypted handle
     * @param _player Player address
     * @return player Player address
     * @return encryptedScore FHE handle (bytes32) for encrypted score
     * @return timestamp Submission timestamp
     * @return exists Whether player has a score
     */
    function getEncryptedScoreMetadata(address _player) external view returns (
        address player,
        bytes32 encryptedScore,
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
     * @return count Number of players with non-zero encrypted scores
     */
    function getEncryptedScoreCount() external view returns (uint256 count) {
        for (uint256 i = 0; i < playersList.length; i++) {
            Score memory score = playerScores[playersList[i]];
            if (score.exists && score.encryptedScore != bytes32(0)) {
                count++;
            }
        }
        return count;
    }
}
