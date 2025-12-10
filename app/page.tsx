"use client";

import { useAccount, useDisconnect } from "wagmi";
import { ConnectKitButton } from "connectkit";
import Link from "next/link";
import { Trophy, Play, Lock, LogOut } from "lucide-react";

export default function Home() {
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 via-sky-300 to-green-300 text-white">
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <div className="flex justify-end mb-4">
            {isConnected && (
              <button
                onClick={() => disconnect()}
                className="inline-flex items-center px-4 py-2 bg-orange-500/80 hover:bg-orange-600 rounded-lg transition text-white font-semibold"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Disconnect
              </button>
            )}
          </div>
          <div className="flex items-center justify-center mb-4">
            <Lock className="h-12 w-12 text-orange-500 mr-3" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
              Jumping Game
            </h1>
          </div>
          <p className="text-xl text-white/90 mt-4">
            Classic jumping game with encrypted leaderboard using Fully Homomorphic Encryption
          </p>
        </header>

        <div className="max-w-4xl mx-auto">
          {!isConnected && (
            <div className="bg-white/20 backdrop-blur-sm border-2 border-orange-400/50 rounded-lg p-8 text-center mb-8 shadow-xl">
              <h2 className="text-2xl font-bold text-orange-100 mb-4">
                Connect Your Wallet
              </h2>
              <p className="text-white/90 mb-6">
                Connect your wallet to play and submit your scores to the encrypted leaderboard
              </p>
              <ConnectKitButton />
            </div>
          )}

          {isConnected && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link
                href="/play"
                className="bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-lg p-8 text-center transition-all transform hover:scale-105 shadow-lg"
              >
                <Play className="h-16 w-16 mx-auto mb-4 text-white" />
                <h2 className="text-3xl font-bold mb-2 text-white">Play Game</h2>
                <p className="text-orange-100">
                  Jump over obstacles and beat your high score!
                </p>
              </Link>

              <Link
                href="/leaderboard"
                className="bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-lg p-8 text-center transition-all transform hover:scale-105 shadow-lg"
              >
                <Trophy className="h-16 w-16 mx-auto mb-4 text-white" />
                <h2 className="text-3xl font-bold mb-2 text-white">Leaderboard</h2>
                <p className="text-green-100">
                  View top scores (encrypted, no wallet addresses shown)
                </p>
              </Link>
            </div>
          )}

          <div className="mt-12 bg-white/20 backdrop-blur-sm rounded-lg p-6 border-2 border-orange-400/50 shadow-xl">
            <h3 className="text-xl font-bold text-orange-100 mb-4">How it works</h3>
            <ul className="space-y-2 text-white/90">
              <li>• Play the classic jumping game</li>
              <li>• After game over, submit your score to the blockchain</li>
              <li>• Scores are stored with FHE encryption (privacy-preserving)</li>
              <li>• Leaderboard shows scores without revealing wallet addresses</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

