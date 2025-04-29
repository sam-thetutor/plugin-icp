import {
    type Action,
    type HandlerCallback,
    type IAgentRuntime,
    type Memory,
    type State,
  } from "@elizaos/core";
  
  import { icpWalletProvider } from "../providers/wallet";
  import { idlFactory as icrcIdlFactory } from "../canisters/icrc/index.did";
  import { Principal } from "@dfinity/principal";
  
  interface TokenInfo {
    canisterId: string;
    name: string;
    symbol: string;
    decimals: number;
  }
  
  interface TokenBalance extends TokenInfo {
    balance: number;
    raw: bigint;
    error?: boolean;  // Make error optional
  }
  
  const fetchTop10Tokens = async (): Promise<TokenInfo[]> => {
    // Hardcoded list of popular ICP tokens
    return [
      {
        canisterId: "ryjl3-tyaaa-aaaaa-aaaba-cai",
        name: "Internet Computer",
        symbol: "ICP",
        decimals: 8
      },
      {
        canisterId: "mxzaz-hqaaa-aaaar-qaada-cai",
        name: "ckBTC",
        symbol: "ckBTC",
        decimals: 8
      },
      {
        canisterId: "2ouva-viaaa-aaaaq-aaamq-cai",
        name: "OpenChat",
        symbol: "CHAT",
        decimals: 8
      },
      {
        canisterId: "cngnf-vqaaa-aaaar-qag4q-cai",
        name: "ckUSDT",
        symbol: "ckUSDT",
        decimals: 8
      }
    ];
  };
  
  const getTokenBalance = async (
    creator: any,
    canisterId: string,
    principal: Principal,
    decimals: number
  ): Promise<{ balance: number; raw: bigint }> => {
    const tokenActor: any = await creator(icrcIdlFactory, canisterId);
    
    const balance = await tokenActor.icrc1_balance_of({
      owner: principal,
      subaccount: []
    });
  
    return {
      balance: Number(balance) / Math.pow(10, decimals),
      raw: balance
    };
  };
  
  export const checkBalancesAction: Action = {
    name: "CHECK_BALANCE",
    description: "Check balances of top 10 tokens on KongSwap",
    similes: ["CHECK_BALANCE", "BALANCE", "BALANCES", "CHECK_BALANCES", "SHOW_BALANCE", "SHOW_BALANCES"],
  
    validate: async (runtime: IAgentRuntime, message: Memory) => {
      const messageText = (
        typeof message.content === "string"
          ? message.content
          : message.content.text || ""
      ).toLowerCase();
  
      const balancePatterns = [
        /check.*balance/i,
        /show.*balance/i,
        /my.*balance/i,
        /balance.*(check|show)/i,
        /what.*balance/i
      ];
  
      return balancePatterns.some(pattern => pattern.test(messageText));
    },
  
    handler: async (
      runtime: IAgentRuntime,
      message: Memory,
      state: State | undefined,
      _options: { [key: string]: unknown } | undefined,
      callback?: HandlerCallback
    ): Promise<void> => {
      try {
        console.log("Starting balance check...");
        
        if (!state) {
          state = await runtime.composeState(message);
        }
  
        // Initial feedback
        callback?.({
          text: "🔍 Checking your ICP balances...",
          action: "CHECK_BALANCE",
          type: "processing"
        });
  
        const walletResponse = await icpWalletProvider.get(runtime, message, state);
  
        if (!walletResponse.wallet || !walletResponse.isAuthenticated) {
          throw new Error(`Wallet initialization failed: ${walletResponse.error || 'Unknown error'}`);
        }
  
        // Get user's principal
        const principal = await walletResponse.wallet.getPrincipal();
  
        // Fetch top 10 tokens
        callback?.({
          text: "📊 Getting top token list from KongSwap...",
          action: "CHECK_BALANCE",
          type: "processing"
        });
  
        const tokens = await fetchTop10Tokens();
  
        // Get balances for each token
        callback?.({
          text: "💰 Checking balances for each token...",
          action: "CHECK_BALANCE",
          type: "processing"
        });
  
        const balances = await Promise.all(
          tokens.map(async (token): Promise<TokenBalance> => {
            try {
              const balance = await getTokenBalance(
                walletResponse.createActor,
                token.canisterId,
                principal,
                token.decimals
              );
              return {
                ...token,
                ...balance
              };
            } catch (error) {
              console.error(`Error fetching balance for ${token.symbol}:`, error);
              return {
                ...token,
                balance: 0,
                raw: BigInt(0),
                error: true
              };
            }
          })
        );
  
        // Format response
        const balanceText = balances
          .map(token => {
            
            const balanceStr = token.error 
              ? "Error fetching balance"
              : `${token.balance.toFixed(4)} ${token.symbol}`;
            return `${token.name} (${token.symbol}): ${balanceStr}`;
          })
          .join('\n');
  
        callback?.({
          text:  `Principal address: ${principal.toText()}` +
          `\n✅ Your token balances:\n${balanceText}`,
          action: "CHECK_BALANCE",
          type: "success"
        });
  
      } catch (error) {
        console.error("Balance check error:", error);
        callback?.({
          text: `❌ Failed to check balances: ${error instanceof Error ? error.message : "Unknown error"}`,
          action: "CHECK_BALANCE",
          type: "error"
        });
      }
    },
  
    examples: [
      [
        {
          user: "{{user1}}",
          content: {
            text: "What are my token balances?",
            action: "CHECK_BALANCE",
          },
        },
        {
          user: "{{user2}}",
          content: {
            text: "🔍 Fetching your token balances...",
            action: "CHECK_BALANCE",
          },
        },
      ],
      [
        {
          user: "{{user1}}",
          content: {
            text: "Show me my balances",
            action: "CHECK_BALANCE",
          },
        },
        {
          user: "{{user2}}",
          content: {
            text: "🔍 Fetching your token balances...",
            action: "CHECK_BALANCE",
          },
        },
      ],
    ],
  };