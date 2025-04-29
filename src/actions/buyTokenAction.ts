import {
  type Action,
  type HandlerCallback,
  type IAgentRuntime,
  type Memory,
  type State,
  ModelClass,
  composeContext,
  generateObjectDeprecated
} from "@elizaos/core";
import { buyTokenTemplate } from "./prompts/token";
import { getTokenByNameOrSymbol } from "../utils/ic";
import { icpWalletProvider } from "../providers/wallet";
import { KONG_SWAP_TOKEN_API_HOST, STRIPE_API_KEY } from "../constants/apis";
import Stripe from 'stripe';
import { v4 as uuidv4 } from 'uuid';
import { idlFactory as icrcIdlFactory } from "../canisters/icrc/index.did";
import { Principal } from "@dfinity/principal";
import { CANISTER_IDS } from "../constants/canisters";

const stripe = new Stripe(STRIPE_API_KEY, {
  apiVersion: '2025-03-31.basil'
});


const stripeClient = new Stripe(STRIPE_API_KEY);

interface BuyTokenParams {
  tokenSymbol: string;
  amount: number;
  destinationAddress?: string;
}

const validateBuyParams = (response: any) => {
  console.log("response---------------", response);

  if (!response.tokenSymbol) {
    throw new Error("Please specify which token you want to buy");
  }

  if (!response.amount || isNaN(Number(response.amount))) {
    throw new Error("Please specify a valid amount to buy");
  }
};

const createStripePaymentLink = async (params: {
  tokenSymbol: string,
  tokenAmount: number,
  usdAmount: number,
  destinationAddress: string,
  destinationCanisterId: string
}) => {
  try {

    //first create a stripe product
    const product = await stripeClient.products.create({
      name: `Purchase ${params.tokenAmount} ${params.tokenSymbol}`,
      description: `Purchase ${params.tokenAmount} ${params.tokenSymbol} tokens worth ${params.usdAmount} USD`,
      metadata: {
        tokenSymbol: params.tokenSymbol,
        tokenAmount: params.tokenAmount.toString(),
        destinationAddress: params.destinationAddress,
      },
    });

    console.log("product", product);

    //create a stripe price
    const price = await stripeClient.prices.create({
      product: product.id,
      unit_amount: Math.round(params.usdAmount * 100),
      currency: 'usd',
    });

    let paymentLinkId = uuidv4();
    //create a payment link
    const paymentLink = await stripeClient.paymentLinks.create({
      line_items: [{
        price: price.id,
        quantity: 1,
      }],
      metadata: {
        tokenSymbol: params.tokenSymbol,
        tokenAmount: params.tokenAmount.toString(),
        usdAmount: params.usdAmount,
        destinationCanisterId: params.destinationCanisterId,
        destinationAddress: params.destinationAddress,
        paymentLinkId: paymentLinkId,  
      },
    });

    return {
      paymentLinkUrl: paymentLink.url,
      paymentLinkId: paymentLinkId,
    };
  } catch (error) {
    console.error('Error creating Stripe session:', error);
    throw error;
  }
};


// Add function to check CKUSDT balance
const checkCKUSDTBalance = async (createActor: any): Promise<number> => {
  try {
    const ckusdtActor: any = await createActor(icrcIdlFactory, CANISTER_IDS.CKUSDT);
    
    const [balance, decimals] = await Promise.all([
      ckusdtActor.icrc1_balance_of({
        owner: Principal.fromText(CANISTER_IDS.ESCROW_ADDRESS),
        subaccount: []
      }),
      ckusdtActor.icrc1_decimals()
    ]);



    console.log("balance usdddddd--------", balance);

    // Convert from e8s to CKUSDT
    return Number(balance) / Math.pow(10, decimals);
  } catch (error) {
    console.error("Error checking CKUSDT balance:", error);
    throw error;
  }
};

export const buyTokenAction: Action = {
  name: "BUY_TOKEN",
  description: "Buy tokens using credit card through Stripe",
  similes: ["BUY", "PURCHASE", "GET"],

  validate: async (runtime: IAgentRuntime, message: Memory) => {
    const messageText = (
      typeof message.content === "string"
        ? message.content
        : message.content.text || ""
    ).toLowerCase();

    const buyKeywords = ["buy", "purchase", "get"];
    return buyKeywords.some(keyword => messageText.includes(keyword));
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
      }

      const buyTokenContext = composeContext({
        state,
        template: buyTokenTemplate,
      });

      const response = await generateObjectDeprecated({
        runtime,
        context: buyTokenContext,
        modelClass: ModelClass.LARGE,
      });

      validateBuyParams(response);

      const walletResponse = await icpWalletProvider.get(runtime, message, state);
      if (!walletResponse.wallet || !walletResponse.createActor) {
        throw new Error("Failed to initialize wallet");
      }

      const destinationAddress = await walletResponse.wallet.getPrincipal();

      // Get token info and calculate USD amount
      const tokenInfo = await getTokenByNameOrSymbol(response.tokenSymbol);
      if (!tokenInfo) {
        throw new Error(`Token ${response.tokenSymbol} not found`);
      }

      const tokenPrice = await fetch(`${KONG_SWAP_TOKEN_API_HOST}/${tokenInfo.canisterId}`);
      const priceData = await tokenPrice.json();
      const price = Number(priceData.metrics?.price) || 0;
      const amount = Number(response.amount) || 0;
      const usdAmount = price * amount;

      // Check CKUSDT balance before proceeding
      const ckusdtBalance = await checkCKUSDTBalance(walletResponse.createActor);
      
      console.log("ckusdtBalance--------", ckusdtBalance, usdAmount,response.amount);
      if (ckusdtBalance < usdAmount) {
        callback?.({
          text: `❌ The tokens you are trying to buy are more than the balance in the swap escrow.\n\n` +
                `Requested amount: $${usdAmount.toFixed(2)} USD\n` +
                `Available balance: $${ckusdtBalance.toFixed(2)} USD\n\n` +
                `Please try a smaller amount to complete the purchase.`,
          action: "BUY_TOKEN",
          type: "error"
        });
        return;
      }

      console.log("tokenInfo--------", tokenInfo);

      console.log("Price calculation:", { price, amount, usdAmount });

      callback?.({
        text: `💳 Creating payment link for ${response.amount} ${response.tokenSymbol}...\n` +
              `Total: $${usdAmount.toFixed(2)} USD`,
        action: "BUY_TOKEN",
        type: "processing"
      });

      // Create Stripe payment link
      const paymentLink = await createStripePaymentLink({
        tokenSymbol: response.tokenSymbol,
        tokenAmount: Number(response.amount),
        usdAmount: usdAmount,
        destinationAddress: destinationAddress.toString(),
        destinationCanisterId: tokenInfo.canisterId
      });

      callback?.({
        text: `✅ Payment link created!\n\n` +
              `Amount: ${response.amount} ${response.tokenSymbol}\n` +
              `Total: $${usdAmount.toFixed(2)} USD\n` +
              `Delivery Address: ${destinationAddress.toString()}\n\n` +
              `Payment Link: ${paymentLink.paymentLinkUrl}\n` +
              `Payment Link ID: ${paymentLink.paymentLinkId}\n\n` +
              `Once payment is completed, tokens will be automatically sent to your wallet.`,
        action: "BUY_TOKEN",
        type: "success"
      });

    } catch (error) {
      console.error("Buy token error:", error);
      callback?.({
        text: `❌ Failed to create payment: ${error instanceof Error ? error.message : "Unknown error"}`,
        action: "BUY_TOKEN",
        type: "error"
      });
    }
  },

  examples: [
    [
      {
        user: "{{user1}}",
        content: {
          text: "I want to buy 100 ICP",
          action: "BUY_TOKEN",
        },
      },
      {
        user: "{{user2}}",
        content: {
          text: "Creating payment link for 100 ICP...",
          action: "BUY_TOKEN",
        },
      },
    ],
    [
      {
        user: "{{user1}}",
        content: {
          text: "How can I purchase CHAT tokens?",
          action: "BUY_TOKEN",
        },
      },
      {
        user: "{{user2}}",
        content: {
          text: "Please specify how many CHAT tokens you'd like to buy",
        },
      },
    ],
  ],
}; 