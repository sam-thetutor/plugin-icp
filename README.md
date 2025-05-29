# @elizaos/plugin-icp

Internet Computer Protocol (ICP) plugin for Eliza OS.

## Features

- Create meme tokens on PickPump
- Interact with ICP canisters
- Handle ICRC-1 token standard
- Manage ICP wallets and identities
- Support for anonymous and authenticated calls
- Transfer ICP and ICRC tokens between accounts
- Swap between ICRC tokens
- Create and manage NNS neurons
- Start and stop dissolving neurons
- Increase dissolve delay of neurons
- Disburse neurons to other accounts

## Installation

```bash
pnpm install @elizaos/plugin-icp
```

## Configuration

The plugin requires the following environment variables:

```env
INTERNET_COMPUTER_PRIVATE_KEY=<your-ed25519-private-key>
```

## Usage

### Import and Register

```typescript
import { icpPlugin } from "@elizaos/plugin-icp";

// Register the plugin with Eliza
eliza.registerPlugin(icpPlugin);
```

### Available Actions

#### Create Token

Creates a new meme token on PickPump with AI-generated logo and description.

```typescript
// Example usage in chat
"Create a space cat token on PickPump";
"Help me create a pizza-themed funny token on PP";
```



#### Manage Tokens

- **Swap Tokens**: Swap between two ICRC tokens.
  ```typescript
  // Example usage in chat
  "Swap 100 CHAT for EXE on kongswap";
  "Exchange 50 ICP to ckBTC using icpswap";
  ```

- **Check Balances**: Check user's token balances.
  ```typescript
  // Example usage in chat
  "What are my token balances?";
  "Show me my balances";
  ```

- **Get Token Price**: Get the current price of a token.
  ```typescript
  // Example usage in chat
  "What's the price of ICP?";
  "Check the price of CHAT";
  ```

- **Buy Token**: Buy tokens using a credit card through Stripe.
  ```typescript
  // Example usage in chat
  "I want to buy 100 ICP";
  "How can I purchase CHAT tokens?";
  ```

- **Transfer Token**: Transfer an ICRC token to a specific principal address.
  ```typescript
  // Example usage in chat
  "Transfer 100 CHAT to principal 4dcwd-5oxhq-z32kh-2prdj-uoh2h-rjfc7-6faoh-rsvbn-jypgt-t6ayq-cae";
  "Send 50 ICP to address abcdef-ghi";
  ```



#### Manage Neurons

- **Create Neuron**: Create a new NNS neuron with a specified amount of ICP.
  ```typescript
  // Example usage in chat
  "Create a new neuron with 1 icp";
  "Stake 2.5 ICP to create a neuron";
  ```

- **Check Neurons**: List all available NNS neurons for the user.
  ```typescript
  // Example usage in chat
  "Show me my neurons";
  "List all my NNS neurons";
  ```

- **Start Dissolving Neuron**: Begin dissolving a specific neuron by ID.
  ```typescript
  // Example usage in chat
  "Start dissolving neuron id: 123456";
  ```

- **Stop Dissolving Neuron**: Stop dissolving a specific neuron by ID.
  ```typescript
  // Example usage in chat
  "Stop dissolving neuron id: 123456";
  ```

- **Increase Dissolve Delay**: Increase the dissolve delay of a neuron by a specified number of days.
  ```typescript
  // Example usage in chat
  "Increase dissolve delay for neuron id: 123456 by 30 days";
  ```

- **Disburse Neuron**: Disburse a specific neuron to an account.
  ```typescript
  // Example usage in chat
  "Disburse 1 ICP from neuron id: 123456 to account abcdef-ghi";
  ```


### Providers

#### ICP Wallet Provider

Manages ICP wallet operations and canister interactions.

```typescript
const { wallet } = await icpWalletProvider.get(runtime, message, state);
```

## Common Issues & Troubleshooting

1. **Identity Creation Failures**

    - Ensure private key is exactly 32 bytes
    - Verify private key is properly hex-encoded
    - Check if private key has correct permissions

2. **Canister Interaction Issues**

    - Verify canister ID is valid
    - Ensure proper network configuration (mainnet/testnet)
    - Check if canister is available and running

3. **Transaction Failures**

    - Verify sufficient balance for operation
    - Check cycle balance for canister calls
    - Ensure proper fee calculation

4. **Authentication Problems**
    - Verify identity is properly initialized
    - Check if agent is configured correctly
    - Ensure proper network connectivity

## Security Best Practices

1. **Key Management**

    - Never expose private keys in code or logs
    - Use environment variables for sensitive data
    - Rotate keys periodically
    - Use separate keys for development and production

2. **Identity Security**

    - Create separate identities for different purposes
    - Limit identity permissions appropriately
    - Monitor identity usage and access patterns

3. **Canister Interaction Safety**

    - Validate all input parameters
    - Implement proper error handling
    - Use query calls when possible to save cycles
    - Implement rate limiting for calls

4. **Network Security**
    - Use secure endpoints
    - Implement proper timeout handling
    - Validate responses from canisters
    - Handle network errors gracefully

## API Reference

### Types

```typescript
// Token Creation Arguments
export type CreateMemeTokenArg = {
    name: string;
    symbol: string;
    description: string;
    logo: string;
    twitter?: string;
    website?: string;
    telegram?: string;
};

// ICP Configuration
export interface ICPConfig {
    privateKey: string;
    network?: "mainnet" | "testnet";
}
```

### Utilities

The plugin provides various utility functions for:

- Principal/Account conversions
- Candid type handling
- Result/Variant unwrapping
- Array/Hex conversions

### Helper Functions

```typescript
// Convert principal to account
principal2account(principal: string, subaccount?: number[]): string

// Check if text is valid principal
isPrincipalText(text: string): boolean

// Create anonymous actor for public queries
createAnonymousActor<T>(idlFactory, canisterId, host?)
```

## Development Guide

### Setting Up Development Environment

1. Clone the repository
2. Install dependencies:

```bash
pnpm install
```

3. Build the plugin:

```bash
pnpm run build
```

4. Run tests:

```bash
pnpm test
```

### Testing with Local Replica

1. Start a local Internet Computer replica
2. Configure environment for local testing
3. Use test identities for development

## Dependencies

- @dfinity/agent: ^2.1.3
- @dfinity/candid: ^2.1.3
- @dfinity/identity: ^2.1.3
- @dfinity/principal: ^2.1.3
- @elizaos/core: workspace:\*

## Future Enhancements

- Support for additional canister standards
- Enhanced error handling and recovery
- Batch transaction support
- Advanced identity management
- Improved cycle management
- Extended canister interaction capabilities

## Contributing

Contributions are welcome! Please see the [CONTRIBUTING.md](CONTRIBUTING.md) file for more information.

## Credits

This plugin integrates with and builds upon several key technologies:

- [Internet Computer](https://internetcomputer.org/): Decentralized cloud computing platform
- [@dfinity/agent](https://www.npmjs.com/package/@dfinity/agent): ICP HTTP client and agent
- [@dfinity/candid](https://www.npmjs.com/package/@dfinity/candid): Candid interface description language
- [@dfinity/principal](https://www.npmjs.com/package/@dfinity/principal): Principal identifier handling
- [@dfinity/identity](https://www.npmjs.com/package/@dfinity/identity): Identity management

Special thanks to:

- The DFINITY Foundation for developing the Internet Computer
- The ICP Developer community
- The DFINITY SDK maintainers
- The PickPump team for meme token infrastructure
- The Eliza community for their contributions and feedback

For more information about Internet Computer capabilities:

- [ICP Documentation](https://internetcomputer.org/docs/)
- [DFINITY Developer Portal](https://smartcontracts.org/)
- [ICP Dashboard](https://dashboard.internetcomputer.org/)
- [Candid Documentation](https://internetcomputer.org/docs/current/developer-docs/build/candid/)

## License

This plugin is part of the Eliza project. See the main project repository for license information.
