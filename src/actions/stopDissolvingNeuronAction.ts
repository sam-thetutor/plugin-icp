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
import { stopDissolveNeuronTemplate } from "./prompts/token";

const HOST = "https://icp-api.io"; // You may want to make this configurable


export const stopDissolvingNeuronAction: Action = {
  name: "STOP_DISSOLVING_NEURON",
  description: "Stop dissolving a specific NNS neuron by ID.",
  similes: [
    "STOP_DISSOLVING_NEURON",
    "STOP_DISSOLVE",
    "STOP_DISSOLVING",
    "STOP DISSOLVING",
  ],

  validate: async (_runtime: IAgentRuntime, message: Memory) => {
    // const text =
    //   typeof message.content === "string"
    //     ? message.content
    //     : message.content.text || "";
    // return /stop.*dissolve.*neuron.*id/i.test(text);
    return true
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
        text: "🔍 Preparing to stop dissolving the neuron...",
        action: "STOP_DISSOLVING_NEURON",
        type: "processing",
      });

      if (!state) {
        state = await runtime.composeState(message);
      }

      const dissolveNeuronContext = composeContext({
        state,
        template: stopDissolveNeuronTemplate,
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

    
      if (!response.neuronId) {
        callback?.({
          text: "❌ Please specify the neuron ID to stop dissolving, e.g. 'stop dissolving neuron id: 123456'.",
          action: "STOP_DISSOLVING_NEURON",
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
      await governance.stopDissolving(BigInt(response.neuronId));
      console.log("neuron stopped dissolving", response.neuronId);

      callback?.({
        text: `✅ Neuron ${response.neuronId} is now stopped from dissolving.`,
        action: "STOP_DISSOLVING_NEURON",
        type: "success",
      });
    } catch (error) {
      console.error("Start dissolving neuron error:", error);
      callback?.({
        text: `❌ Failed to stop dissolving neuron: The neuron id may not be valid. Or the neuron is not dissolving.`,
        action: "STOP_DISSOLVING_NEURON",
        type: "error",
      });
    }
  },

  examples: [
    [
      {
        user: "{{user1}}",
        content: {
          text: "Stop dissolving neuron id: 123456",
          action: "STOP_DISSOLVING_NEURON",
        },
      },
      {
        user: "{{user2}}",
        content: {
          text: "🔍 Preparing to stop dissolving the neuron...",
          action: "STOP_DISSOLVING_NEURON",
        },
      },
    ],
  ],
};
