import { icpWalletProvider } from "./providers/wallet";
import { executeCreateToken, checkBalancesAction,getTokenPriceAction,transferTokenAction,swapTokenAction,buyTokenAction,checkPaymentAction } from "./actions";

export const icpPlugin = {
    name: "icp",
    description: "Internet Computer Protocol Plugin for Eliza",
    providers: [icpWalletProvider],
    actions: [
        swapTokenAction,
        executeCreateToken,
        checkBalancesAction,
        getTokenPriceAction,
        transferTokenAction,
        buyTokenAction,
        checkPaymentAction
    ],
    evaluators: [],
};

export default icpPlugin;