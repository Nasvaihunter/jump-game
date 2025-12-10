"use client";

import { useAccount, useDisconnect } from "wagmi";
import { ConnectKitButton } from "connectkit";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trophy } from "lucide-react";
import DinoGame from "@/components/DinoGame";
import { useScoreManager } from "@/hooks/useScoreManager";

export default function PlayPage() {
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  const router = useRouter();
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [gameResetKey, setGameResetKey] = useState(0);
  const { submitScore, isLoading: isSubmitting, isSuccess: isScoreSubmitted } = useScoreManager();

  const handleGameOver = (score: number) => {
    setFinalScore(score);
    setShowSubmitDialog(true);
  };

  const handleSubmitScore = async () => {
    if (finalScore && address) {
      try {
        submitScore(finalScore);
        // Don't await - wait for isSuccess in useEffect
      } catch (error) {
        console.error("Error submitting score:", error);
        alert("Failed to submit score. Please try again.");
        setShowSubmitDialog(false);
        setFinalScore(null);
      }
    }
  };

  // Handle successful score submission
  useEffect(() => {
    if (isScoreSubmitted && finalScore) {
      setShowSubmitDialog(false);
      setFinalScore(null);
      setGameResetKey(prev => prev + 1); // Reset game
      // Small delay before navigation to ensure state is reset
      setTimeout(() => {
        router.push("/leaderboard");
      }, 100);
    }
  }, [isScoreSubmitted, finalScore, router]);

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-400 via-sky-300 to-green-300 text-white">
        <div className="container mx-auto px-4 py-12">
          <Link
            href="/"
            className="inline-flex items-center text-orange-100 hover:text-orange-200 mb-6"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
          <div className="bg-white/20 backdrop-blur-sm border-2 border-orange-400/50 rounded-lg p-8 text-center max-w-md mx-auto shadow-xl">
            <h2 className="text-2xl font-bold text-orange-100 mb-4">
              Connect Your Wallet
            </h2>
            <p className="text-white/90 mb-6">
              Connect your wallet to play and submit scores
            </p>
            <ConnectKitButton />
          </div>
        </div>
      </div>
    );
  }

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
            <Link
              href="/leaderboard"
              className="inline-flex items-center text-green-100 hover:text-green-200"
            >
              <Trophy className="h-5 w-5 mr-2" />
              Leaderboard
            </Link>
            <ConnectKitButton />
            <button
              onClick={() => disconnect()}
              className="px-4 py-2 bg-orange-500/80 hover:bg-orange-600 rounded-lg transition text-white font-semibold"
            >
              Disconnect
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-bold text-orange-100 mb-8">Jumping Game</h1>
          <DinoGame key={gameResetKey} resetKey={gameResetKey} onGameOver={handleGameOver} />
        </div>

        {showSubmitDialog && finalScore && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/20 backdrop-blur-sm border-2 border-orange-400/50 rounded-lg p-8 max-w-md w-full mx-4 shadow-xl">
              <h2 className="text-2xl font-bold text-orange-100 mb-4">
                Game Over!
              </h2>
              <p className="text-white/90 mb-6">
                Your score: <span className="text-orange-200 font-bold text-xl">{finalScore}</span>
              </p>
              <p className="text-white/80 text-sm mb-6">
                Submit your score to the encrypted leaderboard?
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={handleSubmitScore}
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-lg font-semibold transition disabled:opacity-50 text-white"
                >
                  {isSubmitting ? "Submitting..." : "Submit Score"}
                </button>
                <button
                  onClick={() => {
                    setShowSubmitDialog(false);
                    setFinalScore(null);
                    setGameResetKey(prev => prev + 1); // Reset game to allow playing again
                  }}
                  className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg transition text-white"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

