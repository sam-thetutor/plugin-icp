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
import { CANISTER_IDS } from "../constants/canisters";
import { startDissolveNeuronTemplate } from "./prompts/token";

const HOST = "https://icp-api.io"; // You may want to make this configurable


export const startDissolvingNeuronAction: Action = {
  name: "START_DISSOLVING_NEURON",
  description: "Start dissolving a specific NNS neuron by ID.",
  similes: [
    "START_DISSOLVING_NEURON",
    "DISSOLVE_NEURON",
    "BEGIN_DISSOLVE",
    "START DISSOLVING",
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
        text: "🔍 Preparing to start dissolving the neuron...",
        action: "START_DISSOLVING_NEURON",
        type: "processing",
      });

      if (!state) {
        state = await runtime.composeState(message);
      }

      const dissolveNeuronContext = composeContext({
        state,
        template: startDissolveNeuronTemplate,
      });

      const response = await generateObjectDeprecated({
        runtime,
        context: dissolveNeuronContext,
        modelClass: ModelClass.LARGE,
      });

      console.log("response", response);


      // Get wallet/identity
      const walletResponse = await icpWalletProvider.get(runtime, message, state);
      if (!walletResponse.wallet || !walletResponse.identity) {
        throw new Error("Failed to initialize wallet/identity");
      }

    //   // Parse neuron ID
    //   const text =
    //     typeof message.content === "string"
    //       ? message.content
    //       : message.content.text || "";
    //   const neuronId = extractNeuronIdFromPrompt(text);

      if (!response.neuronId) {
        callback?.({
          text: "❌ Please specify the neuron ID to start dissolving, e.g. 'start dissolving neuron id: 123456'.",
          action: "START_DISSOLVING_NEURON",
          type: "error",
        });
        return;
      }



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
      // Start dissolving the neuron
      await governance.startDissolving(BigInt(response.neuronId));

      console.log("neuron started dissolving", response.neuronId);
      callback?.({
        text: `✅ Neuron ${response.neuronId} is now dissolving.`,
        action: "START_DISSOLVING_NEURON",
        type: "success",
      });
    } catch (error) {
      console.error("Start dissolving neuron error:", error);
      callback?.({
        text: `❌ Failed to start dissolving neuron: The neuron id may not be valid. Or the neuron is already dissolving.`,
        action: "START_DISSOLVING_NEURON",
        type: "error",
      });
    }
  },

  examples: [
    [
      {
        user: "{{user1}}",
        content: {
          text: "Start dissolving neuron id: 123456",
          action: "START_DISSOLVING_NEURON",
        },
      },
      {
        user: "{{user2}}",
        content: {
          text: "🔍 Preparing to start dissolving the neuron...",
          action: "START_DISSOLVING_NEURON",
        },
      },
    ],
  ],
};
