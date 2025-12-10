"use client";

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { getScoreManagerAddress } from "@/utils/address";
import { useState, useEffect } from "react";

const SCORE_MANAGER_ABI = [
  {
    inputs: [{ name: "_score", type: "uint256" }],
    name: "submitScore",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "_player", type: "address" }],
    name: "getPlayerScore",
    outputs: [
      { name: "score", type: "uint256" },
      { name: "timestamp", type: "uint256" },
      { name: "exists", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllPlayers",
    outputs: [{ name: "", type: "address[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "_limit", type: "uint256" }],
    name: "getTopScores",
    outputs: [
      { name: "scores", type: "uint256[]" },
      { name: "players", type: "address[]" },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export function useScoreManager() {
  const { address } = useAccount();
  const [transactionHash, setTransactionHash] = useState<`0x${string}` | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Always get contract address (with fallback)
  let contractAddress: `0x${string}` | undefined;
  try {
    contractAddress = getScoreManagerAddress();
  } catch (error) {
    console.error("Failed to get contract address:", error);
    contractAddress = "0x589E07ff84eD654D40F80d2B352cC15EBDa223B7" as `0x${string}`;
  }

  // Get player's score
  const { data: playerScoreData, isLoading: loadingPlayerScore } = useReadContract({
    address: contractAddress !== "0x0000000000000000000000000000000000000000" ? contractAddress : undefined,
    abi: SCORE_MANAGER_ABI,
    functionName: "getPlayerScore",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!contractAddress && contractAddress !== "0x0000000000000000000000000000000000000000",
    },
  });

  // Get top scores
  const { data: topScoresData, isLoading: loadingTopScores } = useReadContract({
    address: contractAddress !== "0x0000000000000000000000000000000000000000" ? contractAddress : undefined,
    abi: SCORE_MANAGER_ABI,
    functionName: "getTopScores",
    args: [BigInt(10)],
    query: {
      enabled: !!contractAddress && contractAddress !== "0x0000000000000000000000000000000000000000",
      refetchInterval: 5000,
    },
  });

  // Write contract
  const { writeContract, data: hash, isPending, isError, error, reset } = useWriteContract();

  // Wait for transaction
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: hash || undefined,
  });

  useEffect(() => {
    if (hash) {
      setTransactionHash(hash);
      setIsLoading(true);
    }
  }, [hash]);

  useEffect(() => {
    if (isSuccess && hash) {
      setTransactionHash(null);
      setIsLoading(false);
    }
  }, [isSuccess, hash]);

  useEffect(() => {
    if (error) {
      console.error("Write contract error:", error);
      setIsLoading(false);
    }
  }, [error]);

  const submitScore = (score: number) => {
    if (!address) {
      throw new Error("Wallet not connected");
    }
    if (!contractAddress || contractAddress === "0x0000000000000000000000000000000000000000") {
      throw new Error("Contract address not configured");
    }
    setIsLoading(true);
    reset();
    writeContract({
      address: contractAddress,
      abi: SCORE_MANAGER_ABI,
      functionName: "submitScore",
      args: [BigInt(score)],
    });
  };

  // Parse player score
  const playerScore = playerScoreData
    ? {
        score: (playerScoreData as any)[0] as bigint,
        timestamp: (playerScoreData as any)[1] as bigint,
        exists: (playerScoreData as any)[2] as boolean,
      }
    : null;

  // Parse top scores
  const topScores = topScoresData
    ? {
        scores: (topScoresData as any)[0] as bigint[],
        players: (topScoresData as any)[1] as `0x${string}`[],
      }
    : null;

  return {
    submitScore,
    playerScore,
    topScores,
    isLoading: isLoading || isPending || isConfirming || loadingPlayerScore || loadingTopScores,
    isSuccess,
    isError,
    error,
    transactionHash,
    contractAddress,
  };
}

