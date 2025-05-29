import {
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
import { CANISTER_IDS } from "../constants/canisters";
import { increaseDissolveDelayTemplate } from "./prompts/token";
import { composeContext } from "@elizaos/core";
import { generateObjectDeprecated } from "@elizaos/core";
import { ModelClass } from "@elizaos/core";

const HOST = "https://icp-api.io"; // You may want to make this configurable

function extractNeuronIdAndDelayFromPrompt(prompt: string): { neuronId: bigint; delayDays: number } | null {
  const match = prompt.match(/neuron\s*id\s*:\s*(\d+).*delay\s*:\s*(\d+)/i);
  if (!match) return null;
  return { neuronId: BigInt(match[1]), delayDays: parseInt(match[2], 10) };
}

export const increaseDissolveDelayAction: Action = {
  name: "INCREASE_DISSOLVE_DELAY",
  description: "Increase the dissolve delay of a specific NNS neuron by ID.",
  similes: [
    "INCREASE_DISSOLVE_DELAY",
    "EXTEND_DISSOLVE_DELAY",
    "INCREASE DELAY",
    "EXTEND DELAY",
  ],

  validate: async (_runtime: IAgentRuntime, message: Memory) => {
    const text =
      typeof message.content === "string"
        ? message.content
        : message.content.text || "";
    return typeof message.content === "string"
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
        text: "🔍 Preparing to increase the dissolve delay of the neuron...",
        action: "INCREASE_DISSOLVE_DELAY",
        type: "processing",
      });

      if (!state) {
        state = await runtime.composeState(message);
      }

      //create a new updated state
      state = await runtime.composeState(message);

      // Get wallet/identity
      const walletResponse = await icpWalletProvider.get(runtime, message, state);
      if (!walletResponse.wallet || !walletResponse.identity) {
        throw new Error("Failed to initialize wallet/identity");
      }


      let increaseDissolveDelayContext = composeContext({
        state,
        template: increaseDissolveDelayTemplate,
      });

      const response = await generateObjectDeprecated({
        runtime,
        context: increaseDissolveDelayContext,
        modelClass: ModelClass.LARGE,
      });


      console.log("increase dissolve delay response", response);
     


      if (!response.neuronId || !response.delayDays) {
        callback?.({
          text: "❌ Please specify the neuron ID and delay in days, e.g. 'increase dissolve delay for neuron id: 123456 by 30 days'.",
          action: "INCREASE_DISSOLVE_DELAY",
          type: "error",
        });
        return;
      }

      const { neuronId, delayDays } = response;
      const additionalDissolveDelaySeconds = delayDays * 24 * 60 * 60;

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

      // Increase dissolve delay
      await governance.increaseDissolveDelay({
        neuronId: BigInt(neuronId),
        additionalDissolveDelaySeconds: Number(additionalDissolveDelaySeconds),
      });

      callback?.({
        text: `✅ Neuron ${neuronId} dissolve delay increased by ${delayDays} days.`,
        action: "INCREASE_DISSOLVE_DELAY",
        type: "success",
      });
    } catch (error) {
      console.error("Increase dissolve delay error:", error);
      callback?.({
        text: `❌ Failed to increase dissolve delay: ${error instanceof Error ? error.message : "Unknown error"}`,
        action: "INCREASE_DISSOLVE_DELAY",
        type: "error",
      });
    }
  },

  examples: [
    [
      {
        user: "{{user1}}",
        content: {
          text: "Increase dissolve delay for neuron id: 123456 by 30 days",
          action: "INCREASE_DISSOLVE_DELAY",
        },
      },
      {
        user: "{{user2}}",
        content: {
          text: "🔍 Preparing to increase the dissolve delay of the neuron...",
          action: "INCREASE_DISSOLVE_DELAY",
        },
      },
    ],
  ],
};