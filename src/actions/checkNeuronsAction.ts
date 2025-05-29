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

const HOST = "https://icp-api.io"; // You may want to make this configurable

export const checkNeuronsAction: Action = {
  name: "CHECK_NEURONS",
  description: "Check all available NNS neurons for the user",
  similes: ["CHECK_NEURONS", "MY_NEURONS", "LIST_NEURONS", "SHOW_NEURONS"],

  validate: async (_runtime: IAgentRuntime, message: Memory) => {
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
        text: "🔍 Fetching your NNS neurons...",
        action: "CHECK_NEURONS",
        type: "processing",
      });

      if (!state) {
        state = await runtime.composeState(message);
      }

      // Get wallet/identity
      const walletResponse = await icpWalletProvider.get(
        runtime,
        message,
        state
      );
      if (!walletResponse.wallet || !walletResponse.identity) {
        throw new Error("Failed to initialize wallet/identity");
      }

      // Create agent
      const agent = await createAgent({
        identity: walletResponse.identity,
        host: HOST,
      });

      // Create governance canister instance
      const { listNeurons } = GovernanceCanister.create({
        agent,
        canisterId: Principal.fromText(CANISTER_IDS.GOVERNANCE),
      });

      // Fetch neurons
      const myNeurons = await listNeurons({ certified: false });

      if (myNeurons.length === 0) {
        callback?.({
          text: "You have no NNS neurons.",
          action: "CHECK_NEURONS",
          type: "success",
        });
        return;
      }
      // console.log("myNeurons :", myNeurons);

      // Format neuron info
      const neuronList = myNeurons
        .map((n, i) => {
          const id = n.neuronId?.toString() || "Unknown";
          const createdDate = new Date(
            Number(n.createdTimestampSeconds) * 1000
          ).toLocaleDateString();
          const icpStake = (
            Number(n.fullNeuron.cachedNeuronStake) / 100000000
          ).toFixed(2);
          const ageInDays = Math.floor(Number(n.ageSeconds) / (24 * 60 * 60));
          const votingPower = (Number(n.votingPower) / 100000000).toFixed(2);
          const dissolveDelay = Math.floor(
            Number(n.dissolveDelaySeconds) / (24 * 60 * 60)
          );
          const maturityRewards = (Number(n.fullNeuron.maturityE8sEquivalent) / 100000000).toFixed(5);
          return `Neuron #${i + 1}:
              - ID: ${id}
              - Created: ${createdDate}
              - Stake: ${icpStake} ICP
              - Age: ${ageInDays} days
              - Voting Power: ${votingPower}
              - Dissolve Delay: ${dissolveDelay} days
              - Maturity Rewards: ${maturityRewards} ICP
              `;
        })
        .join("\n\n");

      callback?.({
        text: `🧠 Your NNS Neurons:\n\n${neuronList}`,
        action: "CHECK_NEURONS",
        type: "success",
      });
    } catch (error) {
      console.error("Neuron check error:", error);
      callback?.({
        text: `❌ Failed to fetch neurons: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        action: "CHECK_NEURONS",
        type: "error",
      });
    }
  },

  examples: [
    [
      {
        user: "{{user1}}",
        content: {
          text: "Show me my neurons",
          action: "CHECK_NEURONS",
        },
      },
      {
        user: "{{user2}}",
        content: {
          text: "🔍 Fetching your NNS neurons...",
          action: "CHECK_NEURONS",
        },
      },
    ],
    [
      {
        user: "{{user1}}",
        content: {
          text: "List all my NNS neurons",
          action: "CHECK_NEURONS",
        },
      },
      {
        user: "{{user2}}",
        content: {
          text: "🧠 Your NNS Neurons:\n\nNeuron #1: ...",
          action: "CHECK_NEURONS",
        },
      },
    ],
  ],
};
