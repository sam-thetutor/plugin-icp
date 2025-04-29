import { CANISTER_IDS } from "../../constants/canisters";

export const createTokenTemplate = `Based on the user's description, generate creative and memorable values for a new meme token on PickPump:

User's idea: "{{recentMessages}}"

Please generate:
1. A catchy and fun token name that reflects the theme
2. A 3-4 letter symbol based on the name (all caps)
3. An engaging and humorous description (include emojis)
4. Set other fields to null

Example response:
\`\`\`json
{
    "name": "CatLaser",
    "symbol": "PAWS",
    "description": "The first meme token powered by feline laser-chasing energy! Watch your investment zoom around like a red dot! 😺🔴✨",
    "logo": null,
    "website": null,
    "twitter": null,
    "telegram": null
}
\`\`\`

Generate appropriate meme token information based on the user's description.
Respond with a JSON markdown block containing only the generated values.`;



export const transferTemplate = `Extract transfer details for sending tokens to another address.

User's message: "{{recentMessages}}"

Required information:
1. amount: Number of tokens to send
2. to: Recipient's principal address (63 characters)
3. canisterId: Token's canister ID (27 characters)

Return in this format:
{
    "amount": "[NUMBER]",
    "to": "[PRINCIPAL_ADDRESS]",
    "canisterId": "[CANISTER_ID]"
}

RULES
- if the user wants to send icp, the canisterId is ${CANISTER_IDS.ICP}
- if the user wants to send ckusdt, the canisterId is ${CANISTER_IDS.CKUSDT}
- if the user wants to send ckbtc, the canisterId is ${CANISTER_IDS.CKBTC}
- if the user wants to send chat, the canisterId is ${CANISTER_IDS.CHAT}

Example valid inputs:
"send 100 CHAT to 4dcwd-5oxhq-z32kh-2prdj-uoh2h-rjfc7-6faoh-rsvbn-jypgt-t6ayq-cae"
"transfer 50 tokens to principal 4dcwd-5oxhq-z32kh-2prdj-uoh2h-rjfc7-6faoh-rsvbn-jypgt-t6ayq-cae"

Note: This is for sending tokens to another address ONLY. For token swaps, use the swap command instead.
NO additional text or explanations in the output.`;



export const tokenPriceTemplate = `Here's the current market data for {{symbol}} from KongSwap:

Please generate a JSON object with:
1. price (as string)
2. priceChange (as string)
3. marketCap (as string)
4. volume (as string)
5. lastUpdated (as string)

Example responses:

For ICP:
{
      "💰 price": "0.001",
      "📈 24h change": "100",
      "📊 market cap": "100",
      "📉 24h volume": "100",
      "⏰ last updated": "100"
  }

For any other token:
{
    "price": "100",
    "priceChange": "100",
    "marketCap": "100",
    "volume": "100",
    "lastUpdated": "100"
}`;



export const logoPromptTemplate = `Based on this token idea: "{{description}}", create a detailed prompt for generating a logo image.
The prompt should describe visual elements, style, and mood for the logo.
Focus on making it memorable and suitable for a cryptocurrency token.
Keep the response short and specific.
Respond with only the prompt text, no additional formatting.

Example for a dog-themed token:
"A playful cartoon dog face with a cryptocurrency symbol on its collar, using vibrant colors and bold outlines, crypto-themed minimal style"`;


export const swapTemplate = `Extract token swap details from the user's message. This is for exchanging one token for another.

User's message: "{{recentMessages}}"

Required information:
1. fromToken: Source token name/symbol (e.g., "CHAT", "ICP")
2. toToken: Target token name/symbol (e.g., "EXE", "ckBTC")
3. amount: Number of source tokens to swap
4. platform: Trading platform ("kongswap" or "icpswap")
5. DEFAULT platform is kongswap
6. When swapping, we dont need to specify the receiver address because the tokens are deposited to the wallet that did the swap automatically
7. Please generate the response in JSON format:
{
    "fromToken": "[SOURCE_TOKEN]",
    "toToken": "[TARGET_TOKEN]",
    "amount": "[NUMBER]",
    "platform": "[PLATFORM]"
}

Example valid inputs:
"swap 100 CHAT for EXE on kongswap"
"exchange 50 ICP to ckBTC using icpswap"
"convert 25 CHAT into EXE via kongswap"
"trade 75 AWL for CHAT through icpswap"

Note: Platform (kongswap/icpswap) must be specified if no platform is specified in the user's message, use kongswap as default. No recipient address needed - swapped tokens go directly to your wallet.
NO additional text or explanations in the output.`;






export const buyTokenTemplate = `Extract token purchase details from the user's message.

User's message: "{{recentMessages}}"

Required information:
1. tokenSymbol: Token symbol/name to buy (e.g., "ICP", "CHAT")
2. amount: Number of tokens to buy

Return in this format:
{
    "tokenSymbol": "[TOKEN_SYMBOL]",
    "amount": "[NUMBER]"
}

Example valid inputs:
"I want to buy 100 ICP"
"How can I purchase 50 CHAT tokens"
"Buy 25 ckBTC"

NO additional text or explanations in the output.`;
