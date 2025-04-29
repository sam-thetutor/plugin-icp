import {
  type Action,
  type HandlerCallback,
  type IAgentRuntime,
  type Memory,
  type State,
  ModelClass,
  composeContext,
  generateObjectDeprecated,
} from "@elizaos/core";
import { icpWalletProvider } from "../providers/wallet";
import { CANISTER_IDS } from "../constants/canisters";
import {
  idlFactory as storageIdlFactory,
  Transaction,
} from "../canisters/storage/storage.did";

interface PaymentStatus {
  status: "pending" | "completed" | "failed";
  paymentId: string;
  tokenAmount: number;
  tokenSymbol: string;
  usdAmount: number;
  destinationAddress: string;
  timestamp: number;
  error?: string;
}

// Dummy API function - replace with real API call later
const checkPaymentStatus = async (
  paymentId: string,
  createActor: any
): Promise<Transaction> => {
  const storageCanister = await createActor(
    storageIdlFactory,
    CANISTER_IDS.STORAGE_CANISTER
  );

  //get the details of the payment
  const paymentDetails = await storageCanister.getTransaction(paymentId);

  if (paymentDetails.length === 0) {
    return {
      fromAmount: [],
      destinationAddress: "",
      usdAmount: "",
      isPaid: false,
      tokenAmount: "",
      error: [],
      tokenSymbol: "",
      swapTxId: [],
      destinationCanisterId: "",
      price: [],
      toAmount: [],
      paymentLinkId: "",
      slippage: [],
    };
  }

  const paymentDetail: Transaction = paymentDetails[0];

  console.log("Payment details:", paymentDetail);

  return paymentDetail;
};

export const checkPaymentAction: Action = {
  name: "CHECK_PAYMENT",
  description: "Check the status of a crypto purchase payment",
  similes: ["PAYMENT_STATUS", "CHECK_PAYMENT"],

  validate: async (runtime: IAgentRuntime, message: Memory) => {
    const messageText = (
      typeof message.content === "string"
        ? message.content
        : message.content.text || ""
    ).toLowerCase();

    const statusKeywords = [
      "payment status",
      "check payment",
      "payment id",
      "check status",
    ];
    return statusKeywords.some((keyword) => messageText.includes(keyword));
  },

  handler: async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State | undefined,
    _options: { [key: string]: unknown } | undefined,
    callback?: HandlerCallback
  ): Promise<void> => {
    try {
      // Extract payment ID from message
      const messageText =
        typeof message.content === "string"
          ? message.content
          : message.content.text || "";

      const paymentIdMatch = messageText.match(/[a-zA-Z0-9-]{36}/);
      if (!paymentIdMatch) {
        throw new Error("Please provide a valid payment ID to check status");
      }

      const paymentId = paymentIdMatch[0];

      callback?.({
        text: `🔍 Checking payment status for ID: ${paymentId}...`,
        action: "CHECK_PAYMENT",
        type: "processing",
      });

      const walletResponse = await icpWalletProvider.get(
        runtime,
        message,
        state
      );
      if (!walletResponse.wallet || !walletResponse.createActor) {
        throw new Error("Failed to initialize wallet");
      }

      const status = await checkPaymentStatus(
        paymentId,
        walletResponse.createActor
      );
      console.log("Status:", status);
      let statusMessage = "";
      switch (status.isPaid) {
        case true:
          statusMessage =
            `✅ Purchase Completed!\n\n` +
            `Amount: ${status.tokenAmount} ${status.tokenSymbol}\n` +
            `Value: $${Number(status.usdAmount).toFixed(2)}\n` +
            `Delivered to: ${status.destinationAddress}\n`;
          break;

        case false:
          if (status.error.length >0) {
            statusMessage =
              `❌ Payment Failed\n\n` +
              `Amount: ${status.tokenAmount} ${status.tokenSymbol}\n` +
              `Value: $${status.usdAmount}\n` +
              `Destination: ${status.destinationAddress}\n` +
              "Escrow does not have enough funds to complete the payment";
          } else {
            statusMessage =
              `⏳ Payment Pending\n\n`
            }
      }

      callback?.({
        text: statusMessage,
        action: "CHECK_PAYMENT",
        type: status.isPaid
          ? "success"
          : !status.isPaid
          ? "error"
          : "processing",
      });
    } catch (error) {
      console.error("Payment status check error:", error);
      callback?.({
        text: `❌ Failed to check payment status: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        action: "CHECK_PAYMENT",
        type: "error",
      });
    }
  },

  examples: [
    [
      {
        user: "{{user1}}",
        content: {
          text: "Check payment status for abc123-def456-ghi789",
          action: "CHECK_PAYMENT",
        },
      },
      {
        user: "{{user2}}",
        content: {
          text: "Checking payment status...",
          action: "CHECK_PAYMENT",
        },
      },
    ],
  ],
};
