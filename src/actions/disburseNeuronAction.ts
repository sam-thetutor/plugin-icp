import {
    composeContext,
  type Action,
  type HandlerCallback,
  type IAgentRuntime,
  type Memory,
  type State,
} from "@elizaos/core";
import { icpWalletProvider } from "../providers/wallet";
import { GovernanceCanister } from "@dfinity/nns";
import { createAgent } from "@dfinity/utils";
import { generateObjectDeprecated, ModelClass } from "@elizaos/core";
import { Principal } from "@dfinity/principal";
import { CANISTER_IDS } from "../constants/canisters";
import { disburseNeuronTemplate } from "./prompts/token";

const HOST = "https://icp-api.io"; // You may want to make this configurable

function extractDisburseDetailsFromPrompt(prompt: string): { neuronId: bigint; toAccountId?: string; amount?: bigint } | null {
  const neuronIdMatch = prompt.match(/neuron\s*id\s*:\s*(\d+)/i);
  const accountIdMatch = prompt.match(/account\s*id\s*:\s*([a-zA-Z0-9-]+)/i);
  const amountMatch = prompt.match(/amount\s*:\s*(\d+)/i);

  if (!neuronIdMatch) return null;

  return {
    neuronId: BigInt(neuronIdMatch[1]),
    toAccountId: accountIdMatch ? accountIdMatch[1] : undefined,
    amount: amountMatch ? BigInt(amountMatch[1]) : undefined,
  };
}

export const disburseNeuronAction: Action = {
  name: "DISBURSE_NEURON",
  description: "Disburse a specific NNS neuron by ID.",
  similes: [
    "DISBURSE_NEURON",
    "WITHDRAW_NEURON",
    "DISBURSE",
    "WITHDRAW",
  ],

  validate: async (_runtime: IAgentRuntime, message: Memory) => {
    const text =
      typeof message.content === "string"
        ? message.content
        : message.content.text || "";
    console.log("text :", text);

    // More flexible pattern matching for various disburse/withdraw formats
    const patterns = [
      /disburse.*neuron.*id/i,
      /withdraw.*neuron.*id/i,
      /disburse.*from.*neuron/i,
      /withdraw.*from.*neuron/i,
      /disburse.*icp.*(?:from\s+)?neuron/i,
      /withdraw.*icp.*(?:from\s+)?neuron/i
    ];

    return patterns.some(pattern => pattern.test(text));
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
        text: "🔍 Preparing to disburse the neuron...",
        action: "DISBURSE_NEURON",
        type: "processing",
      });


      let disburseNeuronContext = composeContext({
        state,
        template: disburseNeuronTemplate,
      });

      let response = await generateObjectDeprecated({
        runtime,
        context: disburseNeuronContext,
        modelClass: ModelClass.LARGE,
      });




      // Get wallet/identity
      const walletResponse = await icpWalletProvider.get(runtime, message, state);
      if (!walletResponse.wallet || !walletResponse.identity) {
        throw new Error("Failed to initialize wallet/identity");
      }

      const { neuronId, amount, toAccountId } = response;
    


      if (!neuronId || !amount || !toAccountId) {
        callback?.({
          text: "❌ Please specify the neuron ID to disburse, e.g. 'disburse neuron id: 123456'.",
          action: "DISBURSE_NEURON",
          type: "error",
        });
        return;
      }



      console.log("disburse details :",neuronId,amount,toAccountId)



      // Create agent
      const agent = await createAgent({
        identity: walletResponse.identity,
        host: HOST,
      });

      // Create governance canister instance
      const governance = GovernanceCanister.create({
        agent,
        canisterId: Principal.fromText(CANISTER_IDS.GOVERNANCE),
      });

      const formattedAmount = Number(amount) * 10 ** 18;

      // Disburse the neuron
      const result =   await governance.disburse({
        neuronId: BigInt(neuronId),
        toAccountId,
        amount: BigInt(formattedAmount),
      });

      console.log("result :",result)

      callback?.({
        text: `✅ Neuron ${neuronId} has been disbursed.`,
        action: "DISBURSE_NEURON",
        type: "success",
      });
    } catch (error) {
      console.error("Disburse neuron error:", error);
      callback?.({
        text: `❌ Failed to disburse neuron. Try again later`,
        action: "DISBURSE_NEURON",
        type: "error",
      });
    }
  },

  examples: [
    [
      {
        user: "{{user1}}",
        content: {
          text: "Disburse neuron id: 123456 to account id: abcdef-ghi",
          action: "DISBURSE_NEURON",
        },
      },
      {
        user: "{{user2}}",
        content: {
          text: "🔍 Preparing to disburse the neuron...",
          action: "DISBURSE_NEURON",
        },
      },
    ],
  ],
};

