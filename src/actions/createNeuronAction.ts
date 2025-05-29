import {
    composeContext,
  generateObjectDeprecated,
  ModelClass,
  type Action,
  type HandlerCallback,
  type IAgentRuntime,
  type Memory,
  type State,
} from "@elizaos/core";
import { icpWalletProvider } from "../providers/wallet";
import { GovernanceCanister } from "@dfinity/nns";
import { createAgent } from "@dfinity/utils";
import { Principal } from "@dfinity/principal";
import { AccountIdentifier, LedgerCanister,SubAccount } from "@dfinity/ledger-icp";
import { CANISTER_IDS } from "../constants/canisters";
import { idlFactory as icrcIdlFactory } from "../canisters/icrc/index.did";
import { stakeNeuronTemplate } from "./prompts/token"; // Adjust path as needed

import { createHash } from 'crypto';


const GOVERNANCE_CANISTER_ID = "rrkah-fqaaa-aaaaa-aaaaq-cai";
const LEDGER_CANISTER_ID = "ryjl3-tyaaa-aaaaa-aaaba-cai";
const HOST = "https://icp-api.io";
const DEFAULT_FEE = BigInt(10000); // 0.0001 ICP in e8s

function extractAmountFromPrompt(prompt: string): number | null {
  const match = prompt.match(/with\s+([\d.]+)\s*icp/i);
  if (!match) return null;
  const icp = parseFloat(match[1]);
  if (isNaN(icp) || icp <= 0) return null;
  return icp;
}


  function subaccountFromPrincipalAndNonce(principal, nonce) {
    const subaccountPrefix = Buffer.from('\x0Asubaccount', 'latin1'); // length 10, then string
    const principalBytes = principal.toUint8Array(); // Buffer or Uint8Array
    const nonceBuffer = Buffer.alloc(8);
    nonceBuffer.writeBigUInt64BE(BigInt(nonce));
    // Compose: [prefix][principal][nonce]
    const data = Buffer.concat([subaccountPrefix, Buffer.from(principalBytes), nonceBuffer]);
    // Hash it
    const hash = createHash('sha256').update(data).digest();
    // Return as Uint8Array (32 bytes)
    return new Uint8Array(hash);
  }

export const createNeuronAction: Action = {
  name: "CREATE_NEURON",
  description: "Create a new NNS neuron with a specified amount of ICP.",
  similes: [
    "CREATE_NEURON",
    "NEW_NEURON",
    "STAKE_NEURON",
    "CREATE NNS NEURON",
    "CREATE A NEURON",
    "STAKE ICP FOR NEURON",
  ],

  validate: async (_runtime: IAgentRuntime, message: Memory) => {
    const text =
      typeof message.content === "string"
        ? message.content
        : message.content.text || "";
    return /create.*neuron.*with.*icp/i.test(text) || /stake.*neuron/i.test(text);
  },

  handler: async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State | undefined,
    _options: { [key: string]: unknown } | undefined,
    callback?: HandlerCallback
  ): Promise<void> => {
    try {
      callback?.({
        text: "🧠 Preparing to create a new neuron...",
        action: "CREATE_NEURON",
        type: "processing",
      });

      if (!state) {
        state = await runtime.composeState(message);
      }


      // Get staking details using the template
      const stakeNeuronContext = composeContext({
        state,
        template: stakeNeuronTemplate,
      });

      const stakeNeuronResponse = await generateObjectDeprecated({
        runtime,
        context: stakeNeuronContext,
        modelClass: ModelClass.LARGE,
      });
      const icpAmount = Number(stakeNeuronResponse.amount);
      const neuronId = stakeNeuronResponse.neuronId;


      console.log("stakeNeuronResponse", stakeNeuronResponse);

      if (!icpAmount) {
        callback?.({
          text: "❌ Please specify the amount of ICP to stake, e.g. 'create a new neuron with 1 icp'.",
          action: "CREATE_NEURON",
          type: "error",
        });
        return;
      }

      const stake = BigInt(Math.floor(icpAmount * 1e8));

      //if the stake is less than 1 icp, throw an error
      if (stake < BigInt(1 * 1e8)) {
        throw new Error("Stake must be at least 1 ICP");
      }

      // Get wallet/identity
      const walletResponse = await icpWalletProvider.get(runtime, message, state);
      if (!walletResponse.wallet || !walletResponse.identity) {
        throw new Error("Failed to initialize wallet/identity");
      }

      // Create agent
      const agent = await createAgent({
        identity: walletResponse.identity,
        host: HOST,
      });

      // Prepare canisters
      const governance = GovernanceCanister.create({
        agent,
        canisterId: Principal.fromText(GOVERNANCE_CANISTER_ID),
      });

      // Use LedgerCanister instead of ICRC actor
      const ledger = LedgerCanister.create({
        agent,
        canisterId: Principal.fromText(LEDGER_CANISTER_ID),
      });
     
      // Get principal and subaccount
      const principal = walletResponse.identity.getPrincipal();
      
      callback?.({
        text: "🔑 Transfering ICP to governance canister...",
        action: "CREATE_NEURON",
        type: "processing",
      });

      try {

        //call the stakeNeuron function on the governance canister
        const stakeNeuronResult = await governance.stakeNeuron({
          stake: stake + BigInt(20000),
          principal: principal,
          ledgerCanister: ledger,
          createdAt: undefined,
          fee: DEFAULT_FEE,
        });


        console.log("stakeNeuronResult", stakeNeuronResult);


        // Modify the success message based on whether it's a new neuron or existing one
        const successMessage = neuronId 
          ? `✅ Successfully staked ${icpAmount} ICP in neuron ${Number(stakeNeuronResult)}!`
          : `✅ New neuron created successfully with ${icpAmount} ICP!`;

        callback?.({
          text: successMessage,
          action: "CREATE_NEURON",
          type: "success",
        });
      } catch (error) {
        console.error("Stake neuron error:", error);
        throw error; // Re-throw to be caught by outer try-catch
      }
    } catch (error) {
        //destructure the error
        const { message, stack } = error;
      console.error("Create neuron error:", error,message,stack);
      callback?.({
        text: `❌ Failed to create neuron: ${error instanceof Error ? error.message : "Unknown error"}`,
        action: "CREATE_NEURON",
        type: "error",
      });
    }
  },

  examples: [
    [
      {
        user: "{{user1}}",
        content: {
          text: "Create a new neuron with 1 icp",
          action: "CREATE_NEURON",
        },
      },
      {
        user: "{{user2}}",
        content: {
          text: "🧠 Preparing to create a new neuron...",
          action: "CREATE_NEURON",
        },
      },
    ],
    [
      {
        user: "{{user1}}",
        content: {
          text: "Stake 2.5 ICP to create a neuron",
          action: "CREATE_NEURON",
        },
      },
      {
        user: "{{user2}}",
        content: {
          text: "⏳ Staking ICP to create neuron...",
          action: "CREATE_NEURON",
        },
      },
    ],
  ],
}; 