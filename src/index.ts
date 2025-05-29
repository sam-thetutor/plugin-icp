import { icpWalletProvider } from "./providers/wallet";
import {
    executeCreateToken,
    checkBalancesAction,
    getTokenPriceAction,
    transferTokenAction,
    swapAction,
    buyTokenAction,
    checkPaymentAction,
    checkNeuronsAction,
    createNeuronAction,
    startDissolvingNeuronAction,
    stopDissolvingNeuronAction,
    increaseDissolveDelayAction,
    disburseNeuronAction
} from "./actions";

export const icpPlugin = {
    name: "icp",
    description: "Internet Computer Protocol Plugin for Eliza",
    providers: [icpWalletProvider],
    actions: [
        swapAction,
        executeCreateToken,
        checkBalancesAction,
        getTokenPriceAction,
        checkNeuronsAction,
        createNeuronAction,
        transferTokenAction,
        buyTokenAction,
        checkPaymentAction,
        startDissolvingNeuronAction,
        disburseNeuronAction,
        stopDissolvingNeuronAction,
        increaseDissolveDelayAction,
    ],
    evaluators: [],
};

export default icpPlugin;