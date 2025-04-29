import { getCrc32 } from "@dfinity/principal/lib/esm/utils/getCrc";
import { sha224 } from "@dfinity/principal/lib/esm/utils/sha224";
import { KONG_SWAP_TOKEN_API_HOST } from "../../constants/apis";

import { Principal } from "@dfinity/principal";
import { array2hex, hex2array, string2array } from "../arrays";

// Principal -> string
export const principal2string = (p: Principal): string => p.toText();

// string -> Principal
export const string2principal = (p: string): Principal => Principal.fromText(p);

// Calculate account from Principal
// export const principal2account = (
//     principal: string,
//     subaccount?: number | Uint8Array | number[]
// ): string => {
//     return array2hex(principal2account_array(principal, subaccount));
// };

// Calculate subAccount from Principal
export const principal2SubAccount = (principal: string): Uint8Array => {
    const bytes = string2principal(principal).toUint8Array();
    const subAccount = new Uint8Array(32);
    subAccount[0] = bytes.length;
    subAccount.set(bytes, 1);
    return subAccount;
};

// Calculate account from Principal
// export const principal2account_array = (
//     principal: string,
//     subaccount?: number | Uint8Array | number[]
// ): number[] => {
//     let subaccountArray: number[];
//     if (typeof subaccount === "number") {
//         subaccountArray = [
//             (subaccount >> 24) & 0xff,
//             (subaccount >> 16) & 0xff,
//             (subaccount >> 8) & 0xff,
//             subaccount & 0xff,
//         ];
//     }
//     if (subaccount === undefined) {
//         subaccountArray = [];
//     } else if (Array.isArray(subaccount)) {
//         subaccountArray = [...subaccount];
//     } else if (subaccount instanceof Uint8Array) {
//         subaccountArray = Array.from(subaccount);
//     } else {
//         throw new Error(`Invalid subaccount type: ${typeof subaccount}`);
//     }

//     while (subaccountArray.length < 32) {
//         subaccountArray.unshift(0);
//     }
//     if (subaccountArray.length !== 32) {
//         throw new Error(`Wrong subaccount length: ${subaccountArray.length}`);
//     }

//     const buffer: number[] = [
//         ...string2array("\x0Aaccount-id"),
//         ...Array.from(string2principal(principal).toUint8Array()),
//         ...subaccountArray,
//     ];

//     const hash = sha224(new Uint8Array(buffer));
//     const checksum = getCrc32(hash);

//     const result = [
//         (checksum >> 24) & 0xff,
//         (checksum >> 16) & 0xff,
//         (checksum >> 8) & 0xff,
//         (checksum >> 0) & 0xff,
//         ...Array.from(hash),
//     ];

//     return result;
// };

// Check if it's a valid account
export const isAccountHex = (text: string | undefined): boolean => {
    if (!text) return false;
    if (text.length !== 64) return false;
    try {
        return hex2array(text).length === 32;
    } catch {
        // Ignore error
    }
    return false;
};


export const formatTransferError = (err: any): string => {
    if (err.InsufficientFunds) {
      return `Insufficient funds. Current balance: ${(Number(err.InsufficientFunds.balance))/1e8}`;
    }
    if (err.BadFee) {
      return `Incorrect fee. Expected fee: ${err.BadFee.expected_fee} tokens`;
    }
    if (err.GenericError) {
      return `${err.GenericError.message} (Error code: ${err.GenericError.error_code})`;
    }
    if (err.TemporarilyUnavailable) {
      return "Service temporarily unavailable. Please try again later";
    }
    if (err.CreatedInFuture) {
      return "Transaction timestamp is in the future";
    }
    if (err.TooOld) {
      return "Transaction is too old";
    }
    if (err.Duplicate) {
      return `Duplicate transaction. Already processed in block ${err.Duplicate.duplicate_of}`;
    }
    return `Unknown error: ${JSON.stringify(err)}`;
  };


  export const validateTransferParams = (response: any) => {
    if (response.error) {
      throw new Error(response.error);
    }
    
    // Check for canister ID first
    if (!response.canisterId) {
      throw new Error("Please provide the canister ID for the token you want to transfer");
    }

    // Validate canister ID format
    if (response.canisterId.length !== 27) {
      throw new Error("Invalid canister ID format. Please provide a valid 27-character canister ID");
    }

    if (!response.to) {
      throw new Error("Please provide a recipient address");
    }

    if (!response.amount || isNaN(Number(response.amount))) {
      throw new Error("Please specify a valid amount to transfer");
    }
  };



interface TokenInfo {
  symbol: string;
  name: string;
  canisterId: string;
}

export const getTokenByNameOrSymbol = async (nameOrSymbol: string): Promise<TokenInfo | null> => {
  try {
    const response = await fetch(KONG_SWAP_TOKEN_API_HOST);
    const data = await response.json();
    
    const searchTerm = nameOrSymbol.toLowerCase().trim();

    // Find token by exact match first
    let token = data.items.find((t: any) => 
      t.symbol.toLowerCase() === searchTerm || 
      t.name.toLowerCase() === searchTerm
    );

    // If no exact match, try partial/fuzzy matching
    if (!token) {
      token = data.items.find((t: any) => {
        const symbol = t.symbol.toLowerCase();
        const name = t.name.toLowerCase();
        
        // Check if search term is part of the name
        if (name.includes(searchTerm)) return true;
        
        // Check if search term matches initials of symbol
        if (searchTerm.split('').every(char => symbol.includes(char))) return true;
        
        // Check if search term is similar to symbol
        if (symbol.includes(searchTerm) || searchTerm.includes(symbol)) return true;

        return false;
      });
    }

    // console.log("Token found:", token);
    if (!token) return null;

    return {
      symbol: token.symbol,
      name: token.name,
      canisterId: token.canister_id
    };
  } catch (error) {
    console.error("Error getting token by name/symbol:", error);
    return null;
  }
}; 