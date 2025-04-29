import { IAgentRuntime } from '@elizaos/core';
import { z } from 'zod';

export const internetComputerEnvSchema = z.object({
  INTERNET_COMPUTER_PRIVATE_KEY: z.string().min(1, 'ICP private key is required'),
});

export type internetComputerConfig = z.infer<typeof internetComputerEnvSchema>;

export async function validateInternetComputerConfig(runtime: IAgentRuntime): Promise<internetComputerConfig> {
  try {
    const config = {
      INTERNET_COMPUTER_PRIVATE_KEY: runtime.getSetting('INTERNET_COMPUTER_PRIVATE_KEY'),
    };
    return internetComputerEnvSchema.parse(config);
  } catch (error) {
    console.log('error::::', error);
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join('\n');
      throw new Error(`Internet Computer configuration validation failed:\n${errorMessages}`);
    }
    throw error;
  }
}
