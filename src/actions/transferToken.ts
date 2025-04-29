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
  generateObject
} from "@elizaos/core";

import { transferTemplate } from "./prompts/token";
import { icpWalletProvider } from "../providers/wallet";
import { idlFactory as icrcIdlFactory } from "../canisters/icrc/index.did";
import { ActorCreator, TransferICRCParams } from "../types";
import { Principal } from "@dfinity/principal";
import { unwrapRustResultMap } from "../utils/common/types/results";
import { validateInternetComputerConfig } from "../utils/environment";
import { formatTransferError } from "../utils/ic";



const validateTransferParams = (response: any) => {
  if (response.error) {
    throw new Error(response.error);
  }
  
  // Check for canister ID first
  if (!response.canisterId) {
    throw new Error("Please provide the canister ID for the token you want to transfer");
  }

  // Validate canister ID format
  if (response.canisterId.length !== 27) {
    throw new Error("Invalid canister ID format. Please provide a valid 27-character canister ID");
  }

  if (!response.to) {
    throw new Error("Please provide a recipient address");
  }

  if (!response.amount || isNaN(Number(response.amount))) {
    throw new Error("Please specify a valid amount to transfer");
  }
};
//function to transfer icrc tokens
const transferTokenTransaction = async (
  creator: ActorCreator,
  params: TransferICRCParams
) => {
  //create the actor for the icrc canister
  const actor: any = await creator(icrcIdlFactory, params.canisterId);

  try {
    // Convert string to Principal if it's a string
    const toPrincipal = typeof params.to === 'string' 
      ? Principal.fromText(params.to)
      : params.to;

    // Convert decimal amount to proper token units (8 decimals for ICP)
    console.log("Amount to transfer:", params.amount, "->", params.amount.toString());

    //transfer the tokens
    console.log("transfers params", params);
    const result = await actor.icrc1_transfer({
      to: {
        owner: toPrincipal,
        subaccount: [],
      },
      fee: [],
      memo: [],
      from_subaccount: [],
      created_at_time: [],
      amount:  Number(params.amount),
    });
    console.log("transfer result", result);
    

    return unwrapRustResultMap(result,
      (ok) => ({
        Ok: `Transfer successful! Transaction block height: ${ok}. You can view more details about your transaction on the ICP dashboard.`
      }),
      (err) => {
        throw new Error(formatTransferError(err));
      }
    );
  } catch (error) {
    console.error("Transfer error:", error);
     throw error;
  }
};




  
export const transferTokenAction: Action = {
  name: "TRANSFER_TOKEN",
  description: "Transfer an icrc1 token to a specific principal address",
  similes: ["SEND_TOKENS", "SEND_TOKEN", "TRANSFER"],

  validate: async (runtime: IAgentRuntime, message: Memory) => {
    const messageText = (
      typeof message.content === "string"
        ? message.content
        : message.content.text || ""
    ).toLowerCase();

    // Must have both a transfer keyword AND an address pattern
    const transferKeywords = ["send", "transfer", "send to", "transfer to"];
    const addressPatterns = [
      /to\s+[a-zA-Z0-9-]{10,}/i,
      /address[:\s]+[a-zA-Z0-9-]{10,}/i,
      /recipient[:\s]+[a-zA-Z0-9-]{10,}/i,
      /principal[:\s]+[a-zA-Z0-9-]{10,}/i
    ];

    // Must have both a transfer keyword and an address pattern
    return transferKeywords.some(keyword => messageText.includes(keyword)) &&
           addressPatterns.some(pattern => pattern.test(messageText));
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

      const transferTokenContext = composeContext({
        state,
        template: transferTemplate,
      });

      const response = await generateObjectDeprecated({
        runtime,
        context: transferTokenContext,
        modelClass: ModelClass.LARGE,
      });

      await validateTransferParams(response);

      // Ask for confirmation before proceeding
      callback?.({
        text: `🔍 Please confirm this transfer:\n\nAmount: ${response.amount} tokens\nTo: ${response.to}\nCanister ID: ${response.canisterId}\n\nType 'yes' to confirm or 'no' to cancel.`,
        action: "TRANSFER_TOKEN",
        type: "confirmation"
      });

      // Wait for user confirmation
      const confirmation = message.content.text;
      
      if (confirmation.toLowerCase().includes("no")) {
        callback?.({
          text: "❌ Transfer cancelled by user",
          action: "TRANSFER_TOKEN",
          type: "cancelled"
        });
        return;
      }

      callback?.({
        text: `🔄 Initiating transfer of ${response.amount} tokens to ${response.to}...`,
        action: "TRANSFER_TOKEN",
        type: "processing"
      });

      const walletResponse = await icpWalletProvider.get(runtime, message, state);
      if (!walletResponse.wallet || !walletResponse.createActor) {
        throw new Error("Failed to initialize wallet");
      }

      const result = await transferTokenTransaction(walletResponse.createActor, {
        to: response.to,
        amount: Math.floor(Number(response.amount) * 1e8),
        canisterId: response.canisterId,
      });

      callback?.({
        text: `✅ Transfer complete: ${result.Ok}`,
        action: "TRANSFER_TOKEN",
        type: "success"
      }); 
    } catch (error) {
      console.error("Transfer error:", error);
      callback?.({
        text: `❌ Transfer failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        action: "TRANSFER_TOKEN",
        type: "error"
      });
    }
  },
  //examples of the conversation
  examples: [
    [
      {
        user: "{{user1}}",
        content: "I want to sent 100 CHAT to my friend. and the recipient address: 4dcwd-5oxhq-z32kh-2prdj-uoh2h-rjfc7-6faoh-rsvbn-jypgt-t6ayq-cae",
      },
      {
        user: "{{user2}}",
        content: {
          text: "Transferring tokens to my friend.",
          action: "TRANSFER_TOKEN",
        },
      },
      {
        user: "{{user2}}",
        content: {
          text: "✨ Tokens transferred successfully!",
        },
      },
    ],
    [
      {
        user: "{{user1}}",
        content: "I want to sent some EXE to my friend",
      },

      {
        user: "{{user2}}",
        content: {
          text: "can you please specify the recipient address and the amount you want to send",
        },
      },
      {
        user: "{{user1}}",
        content: "I want to sent 100 EXE to my friend. and the recipient address: 4dcwd-5oxhq-z32kh-2prdj-uoh2h-rjfc7-6faoh-rsvbn-jypgt-t6ayq-cae",
      },
      {
        user: "{{user2}}",
        content: {
          text: "Transferring tokens to my friend.",
          action: "TRANSFER_TOKEN",
        },
      },
      {
        user: "{{user2}}",
        content: {
          text: "✨ Tokens transferred successfully!",
        },
      },
    ],
  ] as ActionExample[][],

  
};








// add another action file and call it swapAction. it allows the user to swap between two tokens. the user needs to provide the token name they want to swap from, the amount and the token they want to swap to. when the user provides the token names or symbols, we fetch their canister ids from the konswap api, and log them. we return a dummy data for now.