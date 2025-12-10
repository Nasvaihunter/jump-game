"use client";

import { useAccount, useDisconnect } from "wagmi";
import { ConnectKitButton } from "connectkit";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Trophy, Play, Lock } from "lucide-react";
import { useScoreManager } from "@/hooks/useScoreManager";

interface LeaderboardEntry {
  score: bigint;
  rank: number;
}

export default function LeaderboardPage() {
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { topScores, isLoading, playerScore } = useScoreManager();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    if (topScores && topScores.scores) {
      const entries: LeaderboardEntry[] = topScores.scores.map((score, index) => ({
        score,
        rank: index + 1,
      }));
      setLeaderboard(entries);
    }
  }, [topScores]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 via-sky-300 to-green-300 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-orange-100 hover:text-orange-200"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Home
          </Link>
          <div className="flex items-center space-x-4">
            {isConnected && (
              <>
                <Link
                  href="/play"
                  className="inline-flex items-center text-orange-100 hover:text-orange-200"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Play
                </Link>
                <ConnectKitButton />
                <button
                  onClick={() => disconnect()}
                  className="px-4 py-2 bg-orange-500/80 hover:bg-orange-600 rounded-lg transition text-white font-semibold"
                >
                  Disconnect
                </button>
              </>
            )}
            {!isConnected && <ConnectKitButton />}
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Trophy className="h-12 w-12 text-orange-100 mr-3" />
              <h1 className="text-4xl font-bold text-orange-100">Leaderboard</h1>
            </div>
            <div className="flex items-center justify-center text-white/80 text-sm">
              <Lock className="h-4 w-4 mr-2" />
              <span>Scores are encrypted - wallet addresses are hidden for privacy</span>
            </div>
          </div>

          {isConnected && playerScore && playerScore.exists && (
            <div className="bg-white/20 backdrop-blur-sm border-2 border-orange-400/50 rounded-lg p-6 mb-8 shadow-xl">
              <h2 className="text-xl font-bold text-orange-100 mb-2">Your Best Score</h2>
              <p className="text-3xl font-bold text-white">{playerScore.score.toString()}</p>
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400"></div>
              <p className="mt-4 text-white/80">Loading leaderboard...</p>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="bg-white/20 backdrop-blur-sm border-2 border-orange-400/50 rounded-lg p-8 text-center shadow-xl">
              <Trophy className="h-16 w-16 mx-auto mb-4 text-orange-200" />
              <p className="text-white/90 text-xl">No scores yet</p>
              <p className="text-white/70 mt-2">Be the first to submit a score!</p>
              {isConnected && (
                <Link
                  href="/play"
                  className="inline-block mt-6 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-lg font-semibold transition text-white"
                >
                  Play Now
                </Link>
              )}
            </div>
          ) : (
            <div className="bg-white/20 backdrop-blur-sm border-2 border-orange-400/50 rounded-lg overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-orange-500/30">
                    <tr>
                      <th className="px-6 py-4 text-left text-white font-semibold">Rank</th>
                      <th className="px-6 py-4 text-left text-white font-semibold">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((entry, index) => (
                      <tr
                        key={index}
                        className={`border-t border-orange-400/30 ${
                          index < 3 ? "bg-orange-500/20" : ""
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            {index === 0 && <Trophy className="h-5 w-5 text-yellow-300 mr-2" />}
                            {index === 1 && <Trophy className="h-5 w-5 text-gray-300 mr-2" />}
                            {index === 2 && <Trophy className="h-5 w-5 text-orange-300 mr-2" />}
                            <span className={`font-bold ${index < 3 ? "text-orange-100" : "text-white"}`}>
                              #{entry.rank}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xl font-bold text-white">
                            {entry.score.toString()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


