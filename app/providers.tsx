"use client";

import { WagmiProvider, createConfig, http } from "wagmi";
import { sepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { useMemo } from "react";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const appUrl = useMemo(() => {
    if (typeof window !== "undefined") {
      return window.location.origin;
    }
    return process.env.NEXT_PUBLIC_APP_URL || "https://dino-game-fhe.vercel.app";
  }, []);

  const wagmiConfig = useMemo(
    () =>
      createConfig(
        getDefaultConfig({
          appName: "Jump Game FHE",
          appDescription: "Classic jump game with encrypted leaderboard",
          appUrl: appUrl,
          appIcon: `${appUrl}/icon.png`,
          walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "dino-game-default",
          chains: [sepolia],
          transports: {
            [sepolia.id]: http(),
          },
        })
      ),
    [appUrl]
  );

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

