import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Transaction {
  'fromAmount' : [] | [string],
  'destinationAddress' : string,
  'usdAmount' : string,
  'isPaid' : boolean,
  'tokenAmount' : string,
  'error' : [] | [string],
  'tokenSymbol' : string,
  'swapTxId' : [] | [string],
  'destinationCanisterId' : string,
  'price' : [] | [string],
  'toAmount' : [] | [string],
  'paymentLinkId' : string,
  'slippage' : [] | [string],
}
export interface _SERVICE {
  'checkPaymentStatus' : ActorMethod<[string], boolean>,
  'getAllTransactions' : ActorMethod<[], Array<[string, Transaction]>>,
  'getTransaction' : ActorMethod<[string], [] | [Transaction]>,
  'storeTransaction' : ActorMethod<[Transaction], boolean>,
  'updateTransaction' : ActorMethod<[string, Transaction], boolean>,
}


export const idlFactory = ({ IDL }) => {
    const Transaction = IDL.Record({
      'fromAmount' : IDL.Opt(IDL.Text),
      'destinationAddress' : IDL.Text,
      'usdAmount' : IDL.Text,
      'isPaid' : IDL.Bool,
      'tokenAmount' : IDL.Text,
      'error' : IDL.Opt(IDL.Text),
      'tokenSymbol' : IDL.Text,
      'swapTxId' : IDL.Opt(IDL.Text),
      'destinationCanisterId' : IDL.Text,
      'price' : IDL.Opt(IDL.Text),
      'toAmount' : IDL.Opt(IDL.Text),
      'paymentLinkId' : IDL.Text,
      'slippage' : IDL.Opt(IDL.Text),
    });
    return IDL.Service({
      'checkPaymentStatus' : IDL.Func([IDL.Text], [IDL.Bool], []),
      'getAllTransactions' : IDL.Func(
          [],
          [IDL.Vec(IDL.Tuple(IDL.Text, Transaction))],
          ['query'],
        ),
      'getTransaction' : IDL.Func([IDL.Text], [IDL.Opt(Transaction)], ['query']),
      'storeTransaction' : IDL.Func([Transaction], [IDL.Bool], []),
      'updateTransaction' : IDL.Func([IDL.Text, Transaction], [IDL.Bool], []),
    });
  };
  export const init = ({ IDL }) => { return []; };
