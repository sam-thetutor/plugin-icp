import {
  type ActionExample,
  type HandlerCallback,
  type IAgentRuntime,
  type Memory,
  ModelClass,
  type State,
  type Action,
  composeContext,
  generateObjectDeprecated,
} from "@elizaos/core";

import { swapTemplate } from "./prompts/token";
import { getTokenByNameOrSymbol } from "../utils/ic";
import { idlFactory as kongswapIdlFactory } from "../canisters/kongswap/index.did";
import { Principal } from "@dfinity/principal";
import { icpWalletProvider } from "../providers/wallet";
import { unwrapRustResultMap } from "../utils/common/types/results";
import {
  ApproveArgs,
  idlFactory as icrcIdlFactory,
  Result_2 as ApproveResult,
} from "../canisters/icrc/index.did";
import { CANISTER_IDS } from "../constants/canisters";
import { idlFactory as icpswapIdlFactory } from "../canisters/icpswap/swapFactory.did";
import { idlFactory as swapFactoryIdlFactory } from "../canisters/icpswap/swapFactory.did";
import {
  Result,
  idlFactory as swapCanisterIdlFactory,
} from "../canisters/icpswap/swapCanister.did";

const validateSwapParams = async (response: any) => {
  if (response.error) {
    throw new Error(response.error);
  }

  if (!response.fromToken) {
    throw new Error("Please specify which token you want to swap from");
  }

  if (!response.toToken) {
    throw new Error("Please specify which token you want to swap to");
  }

  if (!response.amount || isNaN(Number(response.amount))) {
    throw new Error("Please specify a valid amount to swap");
  }

  // Get canister IDs for both tokens
  const fromTokenInfo = await getTokenByNameOrSymbol(response.fromToken);
  const toTokenInfo = await getTokenByNameOrSymbol(response.toToken);

  if (!fromTokenInfo) {
    throw new Error(`Could not find token "${response.fromToken}"`);
  }

  if (!toTokenInfo) {
    throw new Error(`Could not find token "${response.toToken}"`);
  }

  return {
    ...response,
    fromCanisterId: fromTokenInfo.canisterId,
    toCanisterId: toTokenInfo.canisterId,
    fromSymbol: fromTokenInfo.symbol,
    toSymbol: toTokenInfo.symbol,
  };
};

const executeKongSwap = async (
  walletResponse: any,
  params: {
    fromToken: string;
    toToken: string;
    amount: bigint;
    fromCanisterId: string;
    toCanisterId: string;
  }
) => {
  try {
    // Create ICRC token actor for approval
    const tokenActor: any = await walletResponse.createActor(
      icrcIdlFactory,
      params.fromCanisterId
    );
    //get the token decimals and fee
    const tokenDecimals = await tokenActor.icrc1_decimals();
    const tokenFee = await tokenActor.icrc1_fee();

    console.log("Token decimals:", tokenDecimals);
    console.log("Token fee:", tokenFee);

    let swapAmount =
      BigInt(Math.floor(Number(params.amount) * 10 ** tokenDecimals)) +
      BigInt(tokenFee);
    // Approve KongSwap to spend tokens
    const approveArgs = {
      spender: {
        owner: Principal.fromText("2ipq2-uqaaa-aaaar-qailq-cai"), // KongSwap canister ID
        subaccount: [], // No subaccount
      },
      amount: swapAmount,
      expires_at: [], // No expiration
      memo: [], // No memo
      fee: [], // Default fee
      created_at_time: [], // Current time
      expected_allowance: [], // No expected allowance
      from_subaccount: [], // No subaccount
    };

    console.log("Approving KongSwap to spend tokens...");
    const approveResult = await tokenActor.icrc2_approve(approveArgs);

    if ("Err" in approveResult) {
      throw new Error(`Approval failed: ${JSON.stringify(approveResult.Err)}`);
    }

    // Create KongSwap actor
    const kongswapActor: any = await walletResponse.createActor(
      kongswapIdlFactory,
      "2ipq2-uqaaa-aaaar-qailq-cai"
    );

    // Prepare swap arguments
    const swapArgs = {
      pay_token: "IC." + params.fromCanisterId,
      receive_token: "IC." + params.toCanisterId,
      pay_amount: params.amount,
      receive_amount: [], // Let KongSwap calculate optimal amount
      max_slippage: [], // 0.5% slippage tolerance
      receive_address: [], // Empty means send to caller's address
      referred_by: [], // No referral
      pay_tx_id: [], // Let KongSwap generate tx id
    };

    console.log("Executing swap...");
    const result = await kongswapActor.swap(swapArgs);
    console.log("Swap result:", result);

    return unwrapRustResultMap(
      result,
      (ok: any) => ({
        Ok: {
          txId: ok.tx_id.toString(),
          fromAmount: ok.pay_amount.toString(),
          toAmount: ok.receive_amount.toString(),
          price: ok.price,
          slippage: ok.slippage,
        },
      }),
      (err) => {
        throw new Error(`Swap failed: ${err}`);
      }
    );
  } catch (error) {
    console.error("Swap execution error:", error);
    throw error;
  }
};

const executeICPSwap = async (
  walletResponse: any,
  params: {
    fromToken: string;
    toToken: string;
    amount: bigint;
    fromCanisterId: string;
    toCanisterId: string;
  }
) => {
  try {
    // Create ICPSwap Factory actor
    const factoryActor: any = await walletResponse.createActor(
      swapFactoryIdlFactory,
      CANISTER_IDS.ICPSWAP_FACTORY
    );

    // Get all pools
    const poolsResult = await factoryActor.getPools();
    if ("err" in poolsResult) {
      throw new Error(`Failed to get pools: ${poolsResult.err}`);
    }

    // Find matching pool
    const pool = poolsResult.ok.find(
      (p) =>
        (p.token0.address === params.fromCanisterId &&
          p.token1.address === params.toCanisterId) ||
        (p.token0.address === params.toCanisterId &&
          p.token1.address === params.fromCanisterId)
    );
    console.log("Pool:", pool);
    if (!pool) {
      throw new Error("No liquidity pool found for these tokens");
    }

    // Create swap canister actor for the pool
    const swapActor: any = await walletResponse.createActor(
      swapCanisterIdlFactory,
      pool.canisterId?.toString()
    );

    // Create ICRC token actor for approval
    const [tokenFromActor, tokenToActor] = await Promise.all([
      walletResponse.createActor(icrcIdlFactory, params.fromCanisterId),
      walletResponse.createActor(icrcIdlFactory, params.toCanisterId),
    ]);

    const zeroForOne = pool.token0.address === params.fromCanisterId;

    const [tokenFromDecimals, tokenToDecimals, tokenFromFee, tokenToFee] =
      await Promise.all([
        tokenFromActor.icrc1_decimals(),
        tokenToActor.icrc1_decimals(),
        tokenFromActor.icrc1_fee(),
        tokenToActor.icrc1_fee(),
      ]);

    console.log(
      "Pool canister id:",
      pool.canisterId.toString(),
      "from canister id:",
      params.fromCanisterId,
      "to canister id:",
      params.toCanisterId
    );

    // //give the permission to the swap canister to spend the tokens
    const approveArgs: ApproveArgs = {
      spender: {
        owner: pool.canisterId,
        subaccount: [], // No subaccount
      },
      amount:
        params.amount +
        BigInt(pool.fee) +
        (params.amount * BigInt(3)) / BigInt(100) +
        BigInt(tokenFromFee), //approve the amount of tokens to the swap canister + fee +  6 %
      expires_at: [], // No expiration
      memo: [], // No memo
      fee: [], // Default fee
      created_at_time: [], // Current time
      expected_allowance: [], // No expected allowance
      from_subaccount: [], // No subaccount
    };

    const approveResult: ApproveResult = await tokenFromActor.icrc2_approve(
      approveArgs
    );

    console.log("Approval result for icpswap:", approveResult);
    if ("Err" in approveResult) {
      throw new Error(`Approval failed: ${JSON.stringify(approveResult.Err)}`);
    }
    // //deposit the tokens to the swap canister
    const depositResult: Result = await swapActor.depositFrom({
      fee: tokenFromFee,
      amount:
        params.amount +
        BigInt(pool.fee) +
        (tokenFromFee * BigInt(3)) / BigInt(100),
      token: params.fromCanisterId,
    });
    console.log("Deposit result:", depositResult);

    if ("err" in depositResult) {
      throw new Error(`Error in depositing tokens: ${depositResult.err}`);
    }

    // Prepare swap arguments
    const swapArgs = {
      amountIn: params.amount.toString(),
      zeroForOne: zeroForOne,
      amountOutMinimum: "0", // Consider adding slippage protection
    };

    // // Execute swap
    const result = await swapActor.swap(swapArgs);
    console.log("Swap result:", result);
    if ("err" in result) {
      throw new Error(`Swap failed: ${result.err}`);
    }
    const principalAddress = walletResponse.wallet.getPrincipal();

    //if the swap succeeds, get the balance of the tokens in the pool
    const balanceResult = await swapActor.getUserUnusedBalance(
      principalAddress
    );
    console.log("Balance result:", balanceResult);

    const withdrawAmount = zeroForOne
      ? balanceResult.ok.balance1
      : balanceResult.ok.balance0;

    const withdrawToken = zeroForOne
      ? pool.token1.address
      : pool.token0.address;
      
      //ger the token fee for the withdraw token
      const tokenWithdrawActor = await walletResponse.createActor(icrcIdlFactory, withdrawToken);
      const tokenWithdrawFee = await tokenWithdrawActor.icrc1_fee();
    // //if ok, withdraw the swapped tokens from the swap canister
    const withdrawAmountWithoutFee = Number(withdrawAmount - BigInt(tokenWithdrawFee));
    const withdrawResult: Result = await swapActor.withdraw({
      fee: Number(tokenWithdrawFee),
      amount: withdrawAmountWithoutFee,
      token: withdrawToken,
    });


    if ("err" in withdrawResult) {
      throw new Error(
        `Error withdrawing funds from ICPSwap: ${withdrawResult.err}`
      );
    }
    return {
      Ok: {
        toAmount: withdrawAmount,
      },
    };
  } catch (error) {
    console.error("ICPSwap execution error:", error);
    throw error;
  }
};

export const swapAction: Action = {
  name: "SWAP_TOKENS",
  description: "Swap between two tokens on KongSwap or ICPSwap",
  similes: ["SWAP", "SWAP_TOKENS", "EXCHANGE", "CONVERT", "TRADE"],

  validate: async (runtime: IAgentRuntime, message: Memory) => {
    const messageText = (
      typeof message.content === "string"
        ? message.content
        : message.content.text || ""
    ).toLowerCase();

    // Must specify platform
    const hasPlatform =
      /(kongswap|icpswap|via\s+kong|via\s+icp|using\s+kong|using\s+icp|on\s+kong|on\s+icp|through\s+kong|through\s+icp)/i.test(
        messageText
      );

    if (!hasPlatform) {
      return false;
    }

    // Token-to-token patterns (no addresses)
    const swapPatterns = [
      /swap\s+(\d+)\s+(\w+)\s+(to|for|into)\s+(\w+)/i,
      /exchange\s+(\d+)\s+(\w+)\s+(to|for|into)\s+(\w+)/i,
      /convert\s+(\d+)\s+(\w+)\s+(to|for|into)\s+(\w+)/i,
      /trade\s+(\d+)\s+(\w+)\s+(to|for|into)\s+(\w+)/i,
    ];
    return swapPatterns.some((pattern) => pattern.test(messageText));
  },

  handler: async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State | undefined,
    _options: { [key: string]: unknown } | undefined,
    callback?: HandlerCallback
  ): Promise<void> => {
    try {
      if (!state) {
        state = await runtime.composeState(message);
      } else {
        state = await runtime.updateRecentMessageState(state);
      }

      console.log("Processing swap with message:", message);

      const swapContext = composeContext({
        state,
        template: swapTemplate,
      });

      // console.log("Generated swap context:", swapContext);

      const response = await generateObjectDeprecated({
        runtime,
        context: swapContext,
        modelClass: ModelClass.LARGE,
      });

      console.log("Generated swap response:", response);

      if (!response.platform) {
        throw new Error(
          "Please specify which platform to use (kongswap or icpswap)"
        );
      }

      const platform = response.platform.toLowerCase();
      if (platform !== "kongswap" && platform !== "icpswap") {
        throw new Error(
          "Invalid platform. Please use either kongswap or icpswap"
        );
      }

      console.log("Initial response:", response);

      // Add initial feedback
      callback?.({
        text: "🔍 Analyzing swap request...",
        action: "SWAP_TOKENS",
        type: "processing",
      });

      const fromTokenInfo = await getTokenByNameOrSymbol(response.fromToken);
      const toTokenInfo = await getTokenByNameOrSymbol(response.toToken);

      if (!fromTokenInfo || !toTokenInfo) {
        throw new Error("Could not find token information");
      }

      // Initialize wallet
      const walletResponse = await icpWalletProvider.get(
        runtime,
        message,
        state
      );
      if (!walletResponse.wallet || !walletResponse.createActor) {
        throw new Error("Failed to initialize wallet");
      }

      callback?.({
        text: `🔄 Initiating swap on ${response.platform.toUpperCase()}...`,
        action: "SWAP_TOKENS",
        type: "processing",
      });

      if (response.platform.toLowerCase() == "kongswap") {
        // Add approval feedback
        callback?.({
          text: `🔐 Approving KongSwap to spend your ${fromTokenInfo.symbol}...`,
          action: "SWAP_TOKENS",
          type: "processing",
        });

        const swapResult = await executeKongSwap(walletResponse, {
          fromToken: fromTokenInfo.symbol,
          toToken: toTokenInfo.symbol,
          amount: BigInt(Math.floor(Number(response.amount) * 1e8)), // Convert to token decimals
          fromCanisterId: fromTokenInfo.canisterId,
          toCanisterId: toTokenInfo.canisterId,
        });

        callback?.({
          text:
            `✅ Swap completed on KONGSWAP\n` +
            `Amount: ${Number(response.amount)} ${fromTokenInfo.symbol}\n` +
            `Received: ${Number(swapResult.Ok.toAmount) / 1e8} ${
              toTokenInfo.symbol
            }\n` +
            `Price: ${swapResult.Ok.price}\n` +
            `Slippage: ${swapResult.Ok.slippage}%\n` +
            `Transaction ID: ${swapResult.Ok.txId}`,
          action: "SWAP_TOKENS",
          type: "success",
        });
      } else {
        const swapResult = await executeICPSwap(walletResponse, {
          fromToken: fromTokenInfo.symbol,
          toToken: toTokenInfo.symbol,
          amount: BigInt(Math.floor(Number(response.amount) * 1e8)),
          fromCanisterId: fromTokenInfo.canisterId,
          toCanisterId: toTokenInfo.canisterId,
        });

        callback?.({
          text:
            `✅ Swap completed on ICPSWAP\n` +
            `Amount: ${response.amount} ${fromTokenInfo.symbol}\n` +
            `Received: ${Number(swapResult.Ok.toAmount) / 1e8} ${
              toTokenInfo.symbol
            }\n`,
          action: "SWAP_TOKENS",
          type: "success",
        });
      }
    } catch (error) {
      console.error("Swap error:", error);
      callback?.({
        text: `❌ Swap failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        action: "SWAP_TOKENS",
        type: "error",
      });
    }
  },

  examples: [
    [
      {
        user: "{{user1}}",
        content: "I want to swap 100 CHAT for EXE",
      },
      {
        user: "{{user2}}",
        content: {
          text: "🔄 Processing swap...",
          action: "SWAP_TOKENS",
        },
      },
    ],
    [
      {
        user: "{{user1}}",
        content: "Exchange 50 ICP to ckBTC",
      },
      {
        user: "{{user2}}",
        content: {
          text: "🔄 Processing swap...",
          action: "SWAP_TOKENS",
        },
      },
    ],
  ] as ActionExample[][],
};
