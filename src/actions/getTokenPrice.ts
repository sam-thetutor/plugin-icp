import {
    type Action,
    type IAgentRuntime,
    type Memory,
    type State,
    type HandlerCallback,
    ActionExample,
} from "@elizaos/core";
import { tokenPriceTemplate } from "./prompts/token";
import { KONG_SWAP_TOKEN_API_HOST } from "../constants/apis";
import { validateInternetComputerConfig } from "../utils/environment";

interface TokenMetrics {
    price: string;
    price_change_24h: string | null;
    market_cap: string;
    volume_24h: string;
    updated_at: string;
}

const getTokenPrice = async (symbol: string): Promise<any> => {
    try {
        const response = await fetch(`${KONG_SWAP_TOKEN_API_HOST}?page=1&limit=50`);
        const data = await response.json();
        // Find the token in the items array
        const token = data.items.find((item: any) => 
            item.symbol.toLowerCase() === symbol.toLowerCase()
        );
        console.log("token:",token);
        if (!token) {
            throw new Error(`Token ${symbol} not found`);
        }

        return {
            symbol: token.symbol,
            price: token.metrics.price,
            priceChange: token.metrics.price_change_24h || "0",
            marketCap: token.metrics.market_cap,
            volume: token.metrics.volume_24h,
            lastUpdated: token.metrics.updated_at
        };
    } catch (error) {
        console.error("Error fetching token price:", error);
        throw error;
    }
};

export const getTokenPriceAction: Action = {
    name: "GET_TOKEN_PRICE",
    description: "Get token price from KongSwap",
    similes: ["TOKEN_PRICE", "CHECK_PRICE"],

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

            // Extract token symbol from message
            const messageText = typeof message.content === "string" 
                ? message.content 
                : message.content.text || "";

            // Look for token symbol in the message
            const match = messageText.match(/price of (\w+)/i) || 
                         messageText.match(/(\w+) price/i);
            
            const symbol = match ? match[1].toUpperCase() : "ICP";
            const priceData = await getTokenPrice(symbol);

            callback?.({
                text: `${symbol} is currently trading at $${Number(priceData.price).toFixed(4)}. ` +
                      `In the last 24 hours, the price has changed by ${Number(priceData.priceChange).toFixed(2)}%. ` +
                      `The token has a market cap of $${Number(priceData.marketCap).toLocaleString()} ` +
                      `with a 24-hour trading volume of $${Number(priceData.volume).toLocaleString()}.`,
                action: "GET_TOKEN_PRICE",
                type: "success",
            });

        } catch (error) {
            callback?.({
                text: `❌ Failed to get token price: ${error instanceof Error ? error.message : "Unknown error"}`,
                action: "GET_TOKEN_PRICE",
                type: "error",
            });
        }
    },

    validate: async (runtime: IAgentRuntime, message: Memory) => {
        const keywords = [
            "price",
            "price of",
            "token price",
            "how much is",
            "what is the price of"
        ];

        await validateInternetComputerConfig(runtime);
        
        const messageText = (
            typeof message.content === "string"
                ? message.content
                : message.content.text || ""
        ).toLowerCase();

        return keywords.some(keyword => messageText.includes(keyword));
    },

    examples: [[
        {
            user: "{{user1}}",
            content: "What's the price of ICP?",
        },
        {
            user: "{{user2}}",
            content: {
                text: "💰 Current price of ICP is $5.66\n📈 24h Change: -6.52%",
                action: "GET_TOKEN_PRICE",
            },
        }
    ]] as ActionExample[][],
};
