// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ScoreManager
 * @dev Manages encrypted game scores using FHE
 * Note: In production, scores should be encrypted using FHEVM
 * For now, we store them as uint256, but the structure supports FHE encryption
 */
contract ScoreManager {
    struct Score {
        address player;
        uint256 score; // In production: encrypted score (euint32)
        uint256 timestamp;
        bool exists;
    }

    // Mapping from player address to their best score
    mapping(address => Score) public playerScores;
    
    // Array of all player addresses who have submitted scores
    address[] public playersList;
    
    // Total number of scores submitted
    uint256 public totalScores;
    
    // Events
    event ScoreSubmitted(address indexed player, uint256 score, uint256 timestamp);
    event ScoreUpdated(address indexed player, uint256 oldScore, uint256 newScore);

    /**
     * @dev Submit or update a player's score
     * @param _score The game score (encrypted in production)
     */
    function submitScore(uint256 _score) external {
        require(_score > 0, "Score must be greater than 0");
        
        Score storage currentScore = playerScores[msg.sender];
        
        // If player doesn't have a score yet, add to list
        if (!currentScore.exists) {
            playersList.push(msg.sender);
            totalScores++;
        }
        
        // Update score if new score is higher
        if (!currentScore.exists || _score > currentScore.score) {
            uint256 oldScore = currentScore.exists ? currentScore.score : 0;
            
            playerScores[msg.sender] = Score({
                player: msg.sender,
                score: _score,
                timestamp: block.timestamp,
                exists: true
            });
            
            if (currentScore.exists) {
                emit ScoreUpdated(msg.sender, oldScore, _score);
            } else {
                emit ScoreSubmitted(msg.sender, _score, block.timestamp);
            }
        }
    }

    /**
     * @dev Get a player's score
     * @param _player The player's address
     * @return score The player's best score
     * @return timestamp When the score was submitted
     * @return exists Whether the player has a score
     */
    function getPlayerScore(address _player) external view returns (
        uint256 score,
        uint256 timestamp,
        bool exists
    ) {
        Score memory playerScore = playerScores[_player];
        return (playerScore.score, playerScore.timestamp, playerScore.exists);
    }

    /**
     * @dev Get all players who have submitted scores
     * @return Array of player addresses
     */
    function getAllPlayers() external view returns (address[] memory) {
        return playersList;
    }

    /**
     * @dev Get top N scores (sorted by score descending)
     * @param _limit Maximum number of scores to return
     * @return scores Array of scores
     * @return players Array of player addresses (for reference, but can be hidden in frontend)
     */
    function getTopScores(uint256 _limit) external view returns (
        uint256[] memory scores,
        address[] memory players
    ) {
        uint256 count = _limit > playersList.length ? playersList.length : _limit;
        scores = new uint256[](count);
        players = new address[](count);
        
        // Create array of all scores with indices
        uint256[] memory allScores = new uint256[](playersList.length);
        uint256[] memory indices = new uint256[](playersList.length);
        
        for (uint256 i = 0; i < playersList.length; i++) {
            allScores[i] = playerScores[playersList[i]].score;
            indices[i] = i;
        }
        
        // Simple bubble sort (for small datasets)
        for (uint256 i = 0; i < playersList.length - 1; i++) {
            for (uint256 j = 0; j < playersList.length - i - 1; j++) {
                if (allScores[j] < allScores[j + 1]) {
                    uint256 tempScore = allScores[j];
                    uint256 tempIndex = indices[j];
                    allScores[j] = allScores[j + 1];
                    indices[j] = indices[j + 1];
                    allScores[j + 1] = tempScore;
                    indices[j + 1] = tempIndex;
                }
            }
        }
        
        // Get top N
        for (uint256 i = 0; i < count; i++) {
            scores[i] = allScores[i];
            players[i] = playersList[indices[i]];
        }
    }
}



