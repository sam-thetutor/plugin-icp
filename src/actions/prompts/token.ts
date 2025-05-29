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



export const stakeNeuronTemplate = `Extract ICP staking details from the user's message.

User's message: "{{recentMessages}}"

Required information:
1. amount: Number of ICP to stake
2. neuronId: Neuron ID to stake into (optional)

Return in this format:
{
    "amount": "[NUMBER]",
    "neuronId": "[NEURON_ID or null]"
}

Example valid inputs:
"create a new neuron with 1 icp"
"stake 1 ICP in a neuron"
"stake 0.5 ICP in neuron 12345678"
"add 1 ICP to neuron 987654321"
"use 1 icp to stake in a neuron"

Note: If no neuron ID is specified, a new neuron will be created.
NO additional text or explanations in the output.`;



export const startDissolveNeuronTemplate = `Extract neuron ID for dissolving from the user's message.

User's message: "{{recentMessages}}"

Required information:
1. neuronId: Neuron ID to dissolve

RULES:
- Use the latest messages in the state to determine the neuron id

Return in this format as a bigInt:
{
    "neuronId": "[NEURON_ID]"
}

Example valid inputs:
"dissolve neuron 12345678"
"start dissolving neuron 987654321"
"start dissolving neuron 12345678"
"start dissolving neuron 987654321"

NO additional text or explanations in the output.`;


export const stopDissolveNeuronTemplate = `Extract neuron ID for stopping dissolving from the user's message.

User's message: "{{recentMessages}}"

Required information:
1. neuronId: Neuron ID to stop dissolving

RULES:
- Use the latest messages in the state to determine the neuron id

Return in this format as a bigInt:
{
    "neuronId": "[NEURON_ID]"
}

Example valid inputs:
"stop dissolving neuron 12345678"
"stop dissolving neuron 987654321"
"stop dissolving neuron 12345678"
"stop dissolving neuron 987654321"

NO additional text or explanations in the output.`;

export const increaseDissolveDelayTemplate = `Extract neuron ID and delay time for increasing dissolve delay from the user's message.

User's message: "{{recentMessages}}"


RULES:
- If the user specifies the time in hours, convert it to days (1 day = 24 hours).
- If the user specifies the time in days, use it directly.
- Use the latest messages in the state to determine the neuron id and the delay time



Required information:
1. neuronId: Neuron ID to increase dissolve delay
2. delayDays: Delay time in days

Return in this format:
{
    "neuronId": "[NEURON_ID]",
    "delayDays": "[DELAY_DAYS]"
}


Example valid inputs:
"increase dissolve delay for neuron 12345678 by 240 hours"
"extend dissolve delay for neuron 987654321 by 10 days"
"increase dissolve delay for neuron 12345678 by 48 hours"
"extend dissolve delay for neuron 987654321 by 5 days"

NO additional text or explanations in the output.`;

export const disburseNeuronTemplate = `Extract disburse details from the user's message.

User's message: "{{recentMessages}}"

Required information:
1. neuronId: Neuron ID to disburse
2. amount: Number of tokens to disburse
3. toAccountId: Recipient's account ID

RULES:
- Use the latest messages in the state to determine the neuron id, amount and toAccountId

Return in this format:
{
    "neuronId": "[NEURON_ID]",
    "amount": "[NUMBER]",
    "toAccountId": "[ACCOUNT_ID]"
    }

Example valid inputs:
"disburse 100 ICP from neuron 12345678 to 783b4a9fa2e08acf2e540ed442e57f497de231bbab974e6f57c4f493cb23d7fe"
"withdraw 0.4 ICP from neuron 987654321 to 783b4a9fa2e08acf2e540ed442e57f497de231bbab974e6f57c4f493cb23d7fe"

NO additional text or explanations in the output.`;