import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type AddLiquiditAmountsResult = { 'Ok' : AddLiquidityAmountsReply } |
  { 'Err' : string };
export interface AddLiquidityAmountsReply {
  'add_lp_token_amount' : bigint,
  'amount_0' : bigint,
  'amount_1' : bigint,
  'address_0' : string,
  'address_1' : string,
  'symbol_0' : string,
  'symbol_1' : string,
  'chain_0' : string,
  'chain_1' : string,
  'symbol' : string,
  'fee_0' : bigint,
  'fee_1' : bigint,
}
export interface AddLiquidityArgs {
  'token_0' : string,
  'token_1' : string,
  'amount_0' : bigint,
  'amount_1' : bigint,
  'tx_id_0' : [] | [TxId],
  'tx_id_1' : [] | [TxId],
}
export type AddLiquidityAsyncResult = { 'Ok' : bigint } |
  { 'Err' : string };
export interface AddLiquidityReply {
  'ts' : bigint,
  'request_id' : bigint,
  'status' : string,
  'tx_id' : bigint,
  'add_lp_token_amount' : bigint,
  'transfer_ids' : Array<TransferIdReply>,
  'amount_0' : bigint,
  'amount_1' : bigint,
  'claim_ids' : BigUint64Array | bigint[],
  'address_0' : string,
  'address_1' : string,
  'symbol_0' : string,
  'symbol_1' : string,
  'chain_0' : string,
  'chain_1' : string,
  'symbol' : string,
}
export type AddLiquidityResult = { 'Ok' : AddLiquidityReply } |
  { 'Err' : string };
export interface AddPoolArgs {
  'token_0' : string,
  'token_1' : string,
  'amount_0' : bigint,
  'amount_1' : bigint,
  'tx_id_0' : [] | [TxId],
  'tx_id_1' : [] | [TxId],
  'lp_fee_bps' : [] | [number],
}
export interface AddPoolReply {
  'ts' : bigint,
  'request_id' : bigint,
  'status' : string,
  'tx_id' : bigint,
  'lp_token_symbol' : string,
  'add_lp_token_amount' : bigint,
  'transfer_ids' : Array<TransferIdReply>,
  'name' : string,
  'amount_0' : bigint,
  'amount_1' : bigint,
  'claim_ids' : BigUint64Array | bigint[],
  'address_0' : string,
  'address_1' : string,
  'symbol_0' : string,
  'symbol_1' : string,
  'pool_id' : number,
  'chain_0' : string,
  'chain_1' : string,
  'is_removed' : boolean,
  'symbol' : string,
  'lp_fee_bps' : number,
}
export type AddPoolResult = { 'Ok' : AddPoolReply } |
  { 'Err' : string };
export interface AddTokenArgs { 'token' : string }
export type AddTokenReply = { 'IC' : ICTokenReply };
export type AddTokenResult = { 'Ok' : AddTokenReply } |
  { 'Err' : string };
export interface CheckPoolsReply {
  'expected_balance' : ExpectedBalance,
  'diff_balance' : bigint,
  'actual_balance' : bigint,
  'symbol' : string,
}
export type CheckPoolsResult = { 'Ok' : Array<CheckPoolsReply> } |
  { 'Err' : string };
export interface ClaimReply {
  'ts' : bigint,
  'fee' : bigint,
  'status' : string,
  'claim_id' : bigint,
  'transfer_ids' : Array<TransferIdReply>,
  'desc' : string,
  'chain' : string,
  'canister_id' : [] | [string],
  'to_address' : string,
  'amount' : bigint,
  'symbol' : string,
}
export type ClaimResult = { 'Ok' : ClaimReply } |
  { 'Err' : string };
export interface ClaimsReply {
  'ts' : bigint,
  'fee' : bigint,
  'status' : string,
  'claim_id' : bigint,
  'desc' : string,
  'chain' : string,
  'canister_id' : [] | [string],
  'to_address' : string,
  'amount' : bigint,
  'symbol' : string,
}
export type ClaimsResult = { 'Ok' : Array<ClaimsReply> } |
  { 'Err' : string };
export interface ExpectedBalance {
  'balance' : bigint,
  'pool_balances' : Array<PoolExpectedBalance>,
  'unclaimed_claims' : bigint,
}
export interface ICTokenReply {
  'fee' : bigint,
  'decimals' : number,
  'token_id' : number,
  'chain' : string,
  'name' : string,
  'canister_id' : string,
  'icrc1' : boolean,
  'icrc2' : boolean,
  'icrc3' : boolean,
  'is_removed' : boolean,
  'symbol' : string,
}
export interface ICTransferReply {
  'is_send' : boolean,
  'block_index' : bigint,
  'chain' : string,
  'canister_id' : string,
  'amount' : bigint,
  'symbol' : string,
}
export interface Icrc10SupportedStandards { 'url' : string, 'name' : string }
export interface Icrc28TrustedOriginsResponse {
  'trusted_origins' : Array<string>,
}
export interface LPBalancesReply {
  'ts' : bigint,
  'usd_balance' : number,
  'balance' : number,
  'name' : string,
  'amount_0' : number,
  'amount_1' : number,
  'address_0' : string,
  'address_1' : string,
  'symbol_0' : string,
  'symbol_1' : string,
  'usd_amount_0' : number,
  'usd_amount_1' : number,
  'chain_0' : string,
  'chain_1' : string,
  'symbol' : string,
  'lp_token_id' : bigint,
}
export interface LPTokenReply {
  'fee' : bigint,
  'decimals' : number,
  'token_id' : number,
  'chain' : string,
  'name' : string,
  'address' : string,
  'pool_id_of' : number,
  'is_removed' : boolean,
  'total_supply' : bigint,
  'symbol' : string,
}
export interface MessagesReply {
  'ts' : bigint,
  'title' : string,
  'message' : string,
  'message_id' : bigint,
}
export type MessagesResult = { 'Ok' : Array<MessagesReply> } |
  { 'Err' : string };
export interface PoolExpectedBalance {
  'balance' : bigint,
  'kong_fee' : bigint,
  'pool_symbol' : string,
  'lp_fee' : bigint,
}
export interface PoolReply {
  'lp_token_symbol' : string,
  'name' : string,
  'lp_fee_0' : bigint,
  'lp_fee_1' : bigint,
  'balance_0' : bigint,
  'balance_1' : bigint,
  'address_0' : string,
  'address_1' : string,
  'symbol_0' : string,
  'symbol_1' : string,
  'pool_id' : number,
  'price' : number,
  'chain_0' : string,
  'chain_1' : string,
  'is_removed' : boolean,
  'symbol' : string,
  'lp_fee_bps' : number,
}
export type PoolsResult = { 'Ok' : Array<PoolReply> } |
  { 'Err' : string };
export interface RemoveLiquidityAmountsReply {
  'lp_fee_0' : bigint,
  'lp_fee_1' : bigint,
  'amount_0' : bigint,
  'amount_1' : bigint,
  'address_0' : string,
  'address_1' : string,
  'symbol_0' : string,
  'symbol_1' : string,
  'chain_0' : string,
  'chain_1' : string,
  'remove_lp_token_amount' : bigint,
  'symbol' : string,
}
export type RemoveLiquidityAmountsResult = {
    'Ok' : RemoveLiquidityAmountsReply
  } |
  { 'Err' : string };
export interface RemoveLiquidityArgs {
  'token_0' : string,
  'token_1' : string,
  'remove_lp_token_amount' : bigint,
}
export type RemoveLiquidityAsyncResult = { 'Ok' : bigint } |
  { 'Err' : string };
export interface RemoveLiquidityReply {
  'ts' : bigint,
  'request_id' : bigint,
  'status' : string,
  'tx_id' : bigint,
  'transfer_ids' : Array<TransferIdReply>,
  'lp_fee_0' : bigint,
  'lp_fee_1' : bigint,
  'amount_0' : bigint,
  'amount_1' : bigint,
  'claim_ids' : BigUint64Array | bigint[],
  'address_0' : string,
  'address_1' : string,
  'symbol_0' : string,
  'symbol_1' : string,
  'chain_0' : string,
  'chain_1' : string,
  'remove_lp_token_amount' : bigint,
  'symbol' : string,
}
export type RemoveLiquidityResult = { 'Ok' : RemoveLiquidityReply } |
  { 'Err' : string };
export type RequestReply = { 'AddLiquidity' : AddLiquidityReply } |
  { 'Swap' : SwapReply } |
  { 'AddPool' : AddPoolReply } |
  { 'RemoveLiquidity' : RemoveLiquidityReply } |
  { 'Pending' : null };
export type RequestRequest = { 'AddLiquidity' : AddLiquidityArgs } |
  { 'Swap' : SwapArgs } |
  { 'AddPool' : AddPoolArgs } |
  { 'RemoveLiquidity' : RemoveLiquidityArgs };
export interface RequestsReply {
  'ts' : bigint,
  'request_id' : bigint,
  'request' : RequestRequest,
  'statuses' : Array<string>,
  'reply' : RequestReply,
}
export type RequestsResult = { 'Ok' : Array<RequestsReply> } |
  { 'Err' : string };
export interface SendArgs {
  'token' : string,
  'to_address' : string,
  'amount' : bigint,
}
export interface SendReply {
  'ts' : bigint,
  'request_id' : bigint,
  'status' : string,
  'tx_id' : bigint,
  'chain' : string,
  'to_address' : string,
  'amount' : bigint,
  'symbol' : string,
}
export type SendResult = { 'OK' : SendReply } |
  { 'Err' : string };
export interface SwapAmountsReply {
  'txs' : Array<SwapAmountsTxReply>,
  'receive_chain' : string,
  'mid_price' : number,
  'pay_amount' : bigint,
  'receive_amount' : bigint,
  'pay_symbol' : string,
  'receive_symbol' : string,
  'receive_address' : string,
  'pay_address' : string,
  'price' : number,
  'pay_chain' : string,
  'slippage' : number,
}
export type SwapAmountsResult = { 'Ok' : SwapAmountsReply } |
  { 'Err' : string };
export interface SwapAmountsTxReply {
  'receive_chain' : string,
  'pay_amount' : bigint,
  'receive_amount' : bigint,
  'pay_symbol' : string,
  'receive_symbol' : string,
  'receive_address' : string,
  'pool_symbol' : string,
  'pay_address' : string,
  'price' : number,
  'pay_chain' : string,
  'lp_fee' : bigint,
  'gas_fee' : bigint,
}
export interface SwapArgs {
  'receive_token' : string,
  'max_slippage' : [] | [number],
  'pay_amount' : bigint,
  'referred_by' : [] | [string],
  'receive_amount' : [] | [bigint],
  'receive_address' : [] | [string],
  'pay_token' : string,
  'pay_tx_id' : [] | [TxId],
}
export type SwapAsyncResult = { 'Ok' : bigint } |
  { 'Err' : string };
export interface SwapReply {
  'ts' : bigint,
  'txs' : Array<SwapTxReply>,
  'request_id' : bigint,
  'status' : string,
  'tx_id' : bigint,
  'transfer_ids' : Array<TransferIdReply>,
  'receive_chain' : string,
  'mid_price' : number,
  'pay_amount' : bigint,
  'receive_amount' : bigint,
  'claim_ids' : BigUint64Array | bigint[],
  'pay_symbol' : string,
  'receive_symbol' : string,
  'receive_address' : string,
  'pay_address' : string,
  'price' : number,
  'pay_chain' : string,
  'slippage' : number,
}
export type SwapResult = { 'Ok' : SwapReply } |
  { 'Err' : string };
export interface SwapTxReply {
  'ts' : bigint,
  'receive_chain' : string,
  'pay_amount' : bigint,
  'receive_amount' : bigint,
  'pay_symbol' : string,
  'receive_symbol' : string,
  'receive_address' : string,
  'pool_symbol' : string,
  'pay_address' : string,
  'price' : number,
  'pay_chain' : string,
  'lp_fee' : bigint,
  'gas_fee' : bigint,
}
export type TokenReply = { 'IC' : ICTokenReply } |
  { 'LP' : LPTokenReply };
export type TokensResult = { 'Ok' : Array<TokenReply> } |
  { 'Err' : string };
export interface TransferIdReply {
  'transfer_id' : bigint,
  'transfer' : TransferReply,
}
export type TransferReply = { 'IC' : ICTransferReply };
export type TransfersResult = { 'Ok' : Array<TransferIdReply> } |
  { 'Err' : string };
export type TxId = { 'TransactionId' : string } |
  { 'BlockIndex' : bigint };
export type TxsReply = { 'AddLiquidity' : AddLiquidityReply } |
  { 'Swap' : SwapReply } |
  { 'AddPool' : AddPoolReply } |
  { 'RemoveLiquidity' : RemoveLiquidityReply };
export type TxsResult = { 'Ok' : Array<TxsReply> } |
  { 'Err' : string };
export interface UpdateTokenArgs { 'token' : string }
export type UpdateTokenReply = { 'IC' : ICTokenReply };
export type UpdateTokenResult = { 'Ok' : UpdateTokenReply } |
  { 'Err' : string };
export type UserBalancesReply = { 'LP' : LPBalancesReply };
export type UserBalancesResult = { 'Ok' : Array<UserBalancesReply> } |
  { 'Err' : string };
export interface UserReply {
  'account_id' : string,
  'fee_level_expires_at' : [] | [bigint],
  'referred_by' : [] | [string],
  'user_id' : number,
  'fee_level' : number,
  'principal_id' : string,
  'referred_by_expires_at' : [] | [bigint],
  'my_referral_code' : string,
}
export type UserResult = { 'Ok' : UserReply } |
  { 'Err' : string };
export type ValidateAddLiquidityResult = { 'Ok' : string } |
  { 'Err' : string };
export type ValidateRemoveLiquidityResult = { 'Ok' : string } |
  { 'Err' : string };
export interface icrc21_consent_info {
  'metadata' : icrc21_consent_message_metadata,
  'consent_message' : icrc21_consent_message,
}
export type icrc21_consent_message = {
    'LineDisplayMessage' : { 'pages' : Array<{ 'lines' : Array<string> }> }
  } |
  { 'GenericDisplayMessage' : string };
export interface icrc21_consent_message_metadata {
  'utc_offset_minutes' : [] | [number],
  'language' : string,
}
export interface icrc21_consent_message_request {
  'arg' : Uint8Array | number[],
  'method' : string,
  'user_preferences' : icrc21_consent_message_spec,
}
export type icrc21_consent_message_response = { 'Ok' : icrc21_consent_info } |
  { 'Err' : icrc21_error };
export interface icrc21_consent_message_spec {
  'metadata' : icrc21_consent_message_metadata,
  'device_spec' : [] | [
    { 'GenericDisplay' : null } |
      {
        'LineDisplay' : {
          'characters_per_line' : number,
          'lines_per_page' : number,
        }
      }
  ],
}
export type icrc21_error = {
    'GenericError' : { 'description' : string, 'error_code' : bigint }
  } |
  { 'InsufficientPayment' : icrc21_error_info } |
  { 'UnsupportedCanisterCall' : icrc21_error_info } |
  { 'ConsentMessageUnavailable' : icrc21_error_info };
export interface icrc21_error_info { 'description' : string }
export interface _SERVICE {
  'add_liquidity' : ActorMethod<[AddLiquidityArgs], AddLiquidityResult>,
  'add_liquidity_amounts' : ActorMethod<
    [string, bigint, string],
    AddLiquiditAmountsResult
  >,
  'add_liquidity_async' : ActorMethod<
    [AddLiquidityArgs],
    AddLiquidityAsyncResult
  >,
  'add_pool' : ActorMethod<[AddPoolArgs], AddPoolResult>,
  'add_token' : ActorMethod<[AddTokenArgs], AddTokenResult>,
  'check_pools' : ActorMethod<[], CheckPoolsResult>,
  'claim' : ActorMethod<[bigint], ClaimResult>,
  'claims' : ActorMethod<[string], ClaimsResult>,
  'get_user' : ActorMethod<[], UserResult>,
  'icrc10_supported_standards' : ActorMethod<
    [],
    Array<Icrc10SupportedStandards>
  >,
  'icrc1_name' : ActorMethod<[], string>,
  'icrc21_canister_call_consent_message' : ActorMethod<
    [icrc21_consent_message_request],
    icrc21_consent_message_response
  >,
  'icrc28_trusted_origins' : ActorMethod<[], Icrc28TrustedOriginsResponse>,
  'pools' : ActorMethod<[[] | [string]], PoolsResult>,
  'remove_liquidity' : ActorMethod<
    [RemoveLiquidityArgs],
    RemoveLiquidityResult
  >,
  'remove_liquidity_amounts' : ActorMethod<
    [string, string, bigint],
    RemoveLiquidityAmountsResult
  >,
  'remove_liquidity_async' : ActorMethod<
    [RemoveLiquidityArgs],
    RemoveLiquidityAsyncResult
  >,
  'requests' : ActorMethod<[[] | [bigint]], RequestsResult>,
  'send' : ActorMethod<[SendArgs], SendResult>,
  'swap' : ActorMethod<[SwapArgs], SwapResult>,
  'swap_amounts' : ActorMethod<[string, bigint, string], SwapAmountsResult>,
  'swap_async' : ActorMethod<[SwapArgs], SwapAsyncResult>,
  'tokens' : ActorMethod<[[] | [string]], TokensResult>,
  'update_token' : ActorMethod<[UpdateTokenArgs], UpdateTokenResult>,
  'user_balances' : ActorMethod<[string], UserBalancesResult>,
  'validate_add_liquidity' : ActorMethod<[], ValidateAddLiquidityResult>,
  'validate_remove_liquidity' : ActorMethod<[], ValidateRemoveLiquidityResult>,
}

export const idlFactory = ({ IDL }) => {
    const TxId = IDL.Variant({
      'TransactionId' : IDL.Text,
      'BlockIndex' : IDL.Nat,
    });
    const AddLiquidityArgs = IDL.Record({
      'token_0' : IDL.Text,
      'token_1' : IDL.Text,
      'amount_0' : IDL.Nat,
      'amount_1' : IDL.Nat,
      'tx_id_0' : IDL.Opt(TxId),
      'tx_id_1' : IDL.Opt(TxId),
    });
    const ICTransferReply = IDL.Record({
      'is_send' : IDL.Bool,
      'block_index' : IDL.Nat,
      'chain' : IDL.Text,
      'canister_id' : IDL.Text,
      'amount' : IDL.Nat,
      'symbol' : IDL.Text,
    });
    const TransferReply = IDL.Variant({ 'IC' : ICTransferReply });
    const TransferIdReply = IDL.Record({
      'transfer_id' : IDL.Nat64,
      'transfer' : TransferReply,
    });
    const AddLiquidityReply = IDL.Record({
      'ts' : IDL.Nat64,
      'request_id' : IDL.Nat64,
      'status' : IDL.Text,
      'tx_id' : IDL.Nat64,
      'add_lp_token_amount' : IDL.Nat,
      'transfer_ids' : IDL.Vec(TransferIdReply),
      'amount_0' : IDL.Nat,
      'amount_1' : IDL.Nat,
      'claim_ids' : IDL.Vec(IDL.Nat64),
      'address_0' : IDL.Text,
      'address_1' : IDL.Text,
      'symbol_0' : IDL.Text,
      'symbol_1' : IDL.Text,
      'chain_0' : IDL.Text,
      'chain_1' : IDL.Text,
      'symbol' : IDL.Text,
    });
    const AddLiquidityResult = IDL.Variant({
      'Ok' : AddLiquidityReply,
      'Err' : IDL.Text,
    });
    const AddLiquidityAmountsReply = IDL.Record({
      'add_lp_token_amount' : IDL.Nat,
      'amount_0' : IDL.Nat,
      'amount_1' : IDL.Nat,
      'address_0' : IDL.Text,
      'address_1' : IDL.Text,
      'symbol_0' : IDL.Text,
      'symbol_1' : IDL.Text,
      'chain_0' : IDL.Text,
      'chain_1' : IDL.Text,
      'symbol' : IDL.Text,
      'fee_0' : IDL.Nat,
      'fee_1' : IDL.Nat,
    });
    const AddLiquiditAmountsResult = IDL.Variant({
      'Ok' : AddLiquidityAmountsReply,
      'Err' : IDL.Text,
    });
    const AddLiquidityAsyncResult = IDL.Variant({
      'Ok' : IDL.Nat64,
      'Err' : IDL.Text,
    });
    const AddPoolArgs = IDL.Record({
      'token_0' : IDL.Text,
      'token_1' : IDL.Text,
      'amount_0' : IDL.Nat,
      'amount_1' : IDL.Nat,
      'tx_id_0' : IDL.Opt(TxId),
      'tx_id_1' : IDL.Opt(TxId),
      'lp_fee_bps' : IDL.Opt(IDL.Nat8),
    });
    const AddPoolReply = IDL.Record({
      'ts' : IDL.Nat64,
      'request_id' : IDL.Nat64,
      'status' : IDL.Text,
      'tx_id' : IDL.Nat64,
      'lp_token_symbol' : IDL.Text,
      'add_lp_token_amount' : IDL.Nat,
      'transfer_ids' : IDL.Vec(TransferIdReply),
      'name' : IDL.Text,
      'amount_0' : IDL.Nat,
      'amount_1' : IDL.Nat,
      'claim_ids' : IDL.Vec(IDL.Nat64),
      'address_0' : IDL.Text,
      'address_1' : IDL.Text,
      'symbol_0' : IDL.Text,
      'symbol_1' : IDL.Text,
      'pool_id' : IDL.Nat32,
      'chain_0' : IDL.Text,
      'chain_1' : IDL.Text,
      'is_removed' : IDL.Bool,
      'symbol' : IDL.Text,
      'lp_fee_bps' : IDL.Nat8,
    });
    const AddPoolResult = IDL.Variant({ 'Ok' : AddPoolReply, 'Err' : IDL.Text });
    const AddTokenArgs = IDL.Record({ 'token' : IDL.Text });
    const ICTokenReply = IDL.Record({
      'fee' : IDL.Nat,
      'decimals' : IDL.Nat8,
      'token_id' : IDL.Nat32,
      'chain' : IDL.Text,
      'name' : IDL.Text,
      'canister_id' : IDL.Text,
      'icrc1' : IDL.Bool,
      'icrc2' : IDL.Bool,
      'icrc3' : IDL.Bool,
      'is_removed' : IDL.Bool,
      'symbol' : IDL.Text,
    });
    const AddTokenReply = IDL.Variant({ 'IC' : ICTokenReply });
    const AddTokenResult = IDL.Variant({
      'Ok' : AddTokenReply,
      'Err' : IDL.Text,
    });
    const PoolExpectedBalance = IDL.Record({
      'balance' : IDL.Nat,
      'kong_fee' : IDL.Nat,
      'pool_symbol' : IDL.Text,
      'lp_fee' : IDL.Nat,
    });
    const ExpectedBalance = IDL.Record({
      'balance' : IDL.Nat,
      'pool_balances' : IDL.Vec(PoolExpectedBalance),
      'unclaimed_claims' : IDL.Nat,
    });
    const CheckPoolsReply = IDL.Record({
      'expected_balance' : ExpectedBalance,
      'diff_balance' : IDL.Int,
      'actual_balance' : IDL.Nat,
      'symbol' : IDL.Text,
    });
    const CheckPoolsResult = IDL.Variant({
      'Ok' : IDL.Vec(CheckPoolsReply),
      'Err' : IDL.Text,
    });
    const ClaimReply = IDL.Record({
      'ts' : IDL.Nat64,
      'fee' : IDL.Nat,
      'status' : IDL.Text,
      'claim_id' : IDL.Nat64,
      'transfer_ids' : IDL.Vec(TransferIdReply),
      'desc' : IDL.Text,
      'chain' : IDL.Text,
      'canister_id' : IDL.Opt(IDL.Text),
      'to_address' : IDL.Text,
      'amount' : IDL.Nat,
      'symbol' : IDL.Text,
    });
    const ClaimResult = IDL.Variant({ 'Ok' : ClaimReply, 'Err' : IDL.Text });
    const ClaimsReply = IDL.Record({
      'ts' : IDL.Nat64,
      'fee' : IDL.Nat,
      'status' : IDL.Text,
      'claim_id' : IDL.Nat64,
      'desc' : IDL.Text,
      'chain' : IDL.Text,
      'canister_id' : IDL.Opt(IDL.Text),
      'to_address' : IDL.Text,
      'amount' : IDL.Nat,
      'symbol' : IDL.Text,
    });
    const ClaimsResult = IDL.Variant({
      'Ok' : IDL.Vec(ClaimsReply),
      'Err' : IDL.Text,
    });
    const UserReply = IDL.Record({
      'account_id' : IDL.Text,
      'fee_level_expires_at' : IDL.Opt(IDL.Nat64),
      'referred_by' : IDL.Opt(IDL.Text),
      'user_id' : IDL.Nat32,
      'fee_level' : IDL.Nat8,
      'principal_id' : IDL.Text,
      'referred_by_expires_at' : IDL.Opt(IDL.Nat64),
      'my_referral_code' : IDL.Text,
    });
    const UserResult = IDL.Variant({ 'Ok' : UserReply, 'Err' : IDL.Text });
    const Icrc10SupportedStandards = IDL.Record({
      'url' : IDL.Text,
      'name' : IDL.Text,
    });
    const icrc21_consent_message_metadata = IDL.Record({
      'utc_offset_minutes' : IDL.Opt(IDL.Int16),
      'language' : IDL.Text,
    });
    const icrc21_consent_message_spec = IDL.Record({
      'metadata' : icrc21_consent_message_metadata,
      'device_spec' : IDL.Opt(
        IDL.Variant({
          'GenericDisplay' : IDL.Null,
          'LineDisplay' : IDL.Record({
            'characters_per_line' : IDL.Nat16,
            'lines_per_page' : IDL.Nat16,
          }),
        })
      ),
    });
    const icrc21_consent_message_request = IDL.Record({
      'arg' : IDL.Vec(IDL.Nat8),
      'method' : IDL.Text,
      'user_preferences' : icrc21_consent_message_spec,
    });
    const icrc21_consent_message = IDL.Variant({
      'LineDisplayMessage' : IDL.Record({
        'pages' : IDL.Vec(IDL.Record({ 'lines' : IDL.Vec(IDL.Text) })),
      }),
      'GenericDisplayMessage' : IDL.Text,
    });
    const icrc21_consent_info = IDL.Record({
      'metadata' : icrc21_consent_message_metadata,
      'consent_message' : icrc21_consent_message,
    });
    const icrc21_error_info = IDL.Record({ 'description' : IDL.Text });
    const icrc21_error = IDL.Variant({
      'GenericError' : IDL.Record({
        'description' : IDL.Text,
        'error_code' : IDL.Nat,
      }),
      'InsufficientPayment' : icrc21_error_info,
      'UnsupportedCanisterCall' : icrc21_error_info,
      'ConsentMessageUnavailable' : icrc21_error_info,
    });
    const icrc21_consent_message_response = IDL.Variant({
      'Ok' : icrc21_consent_info,
      'Err' : icrc21_error,
    });
    const Icrc28TrustedOriginsResponse = IDL.Record({
      'trusted_origins' : IDL.Vec(IDL.Text),
    });
    const PoolReply = IDL.Record({
      'lp_token_symbol' : IDL.Text,
      'name' : IDL.Text,
      'lp_fee_0' : IDL.Nat,
      'lp_fee_1' : IDL.Nat,
      'balance_0' : IDL.Nat,
      'balance_1' : IDL.Nat,
      'address_0' : IDL.Text,
      'address_1' : IDL.Text,
      'symbol_0' : IDL.Text,
      'symbol_1' : IDL.Text,
      'pool_id' : IDL.Nat32,
      'price' : IDL.Float64,
      'chain_0' : IDL.Text,
      'chain_1' : IDL.Text,
      'is_removed' : IDL.Bool,
      'symbol' : IDL.Text,
      'lp_fee_bps' : IDL.Nat8,
    });
    const PoolsResult = IDL.Variant({
      'Ok' : IDL.Vec(PoolReply),
      'Err' : IDL.Text,
    });
    const RemoveLiquidityArgs = IDL.Record({
      'token_0' : IDL.Text,
      'token_1' : IDL.Text,
      'remove_lp_token_amount' : IDL.Nat,
    });
    const RemoveLiquidityReply = IDL.Record({
      'ts' : IDL.Nat64,
      'request_id' : IDL.Nat64,
      'status' : IDL.Text,
      'tx_id' : IDL.Nat64,
      'transfer_ids' : IDL.Vec(TransferIdReply),
      'lp_fee_0' : IDL.Nat,
      'lp_fee_1' : IDL.Nat,
      'amount_0' : IDL.Nat,
      'amount_1' : IDL.Nat,
      'claim_ids' : IDL.Vec(IDL.Nat64),
      'address_0' : IDL.Text,
      'address_1' : IDL.Text,
      'symbol_0' : IDL.Text,
      'symbol_1' : IDL.Text,
      'chain_0' : IDL.Text,
      'chain_1' : IDL.Text,
      'remove_lp_token_amount' : IDL.Nat,
      'symbol' : IDL.Text,
    });
    const RemoveLiquidityResult = IDL.Variant({
      'Ok' : RemoveLiquidityReply,
      'Err' : IDL.Text,
    });
    const RemoveLiquidityAmountsReply = IDL.Record({
      'lp_fee_0' : IDL.Nat,
      'lp_fee_1' : IDL.Nat,
      'amount_0' : IDL.Nat,
      'amount_1' : IDL.Nat,
      'address_0' : IDL.Text,
      'address_1' : IDL.Text,
      'symbol_0' : IDL.Text,
      'symbol_1' : IDL.Text,
      'chain_0' : IDL.Text,
      'chain_1' : IDL.Text,
      'remove_lp_token_amount' : IDL.Nat,
      'symbol' : IDL.Text,
    });
    const RemoveLiquidityAmountsResult = IDL.Variant({
      'Ok' : RemoveLiquidityAmountsReply,
      'Err' : IDL.Text,
    });
    const RemoveLiquidityAsyncResult = IDL.Variant({
      'Ok' : IDL.Nat64,
      'Err' : IDL.Text,
    });
    const SwapArgs = IDL.Record({
      'receive_token' : IDL.Text,
      'max_slippage' : IDL.Opt(IDL.Float64),
      'pay_amount' : IDL.Nat,
      'referred_by' : IDL.Opt(IDL.Text),
      'receive_amount' : IDL.Opt(IDL.Nat),
      'receive_address' : IDL.Opt(IDL.Text),
      'pay_token' : IDL.Text,
      'pay_tx_id' : IDL.Opt(TxId),
    });
    const RequestRequest = IDL.Variant({
      'AddLiquidity' : AddLiquidityArgs,
      'Swap' : SwapArgs,
      'AddPool' : AddPoolArgs,
      'RemoveLiquidity' : RemoveLiquidityArgs,
    });
    const SwapTxReply = IDL.Record({
      'ts' : IDL.Nat64,
      'receive_chain' : IDL.Text,
      'pay_amount' : IDL.Nat,
      'receive_amount' : IDL.Nat,
      'pay_symbol' : IDL.Text,
      'receive_symbol' : IDL.Text,
      'receive_address' : IDL.Text,
      'pool_symbol' : IDL.Text,
      'pay_address' : IDL.Text,
      'price' : IDL.Float64,
      'pay_chain' : IDL.Text,
      'lp_fee' : IDL.Nat,
      'gas_fee' : IDL.Nat,
    });
    const SwapReply = IDL.Record({
      'ts' : IDL.Nat64,
      'txs' : IDL.Vec(SwapTxReply),
      'request_id' : IDL.Nat64,
      'status' : IDL.Text,
      'tx_id' : IDL.Nat64,
      'transfer_ids' : IDL.Vec(TransferIdReply),
      'receive_chain' : IDL.Text,
      'mid_price' : IDL.Float64,
      'pay_amount' : IDL.Nat,
      'receive_amount' : IDL.Nat,
      'claim_ids' : IDL.Vec(IDL.Nat64),
      'pay_symbol' : IDL.Text,
      'receive_symbol' : IDL.Text,
      'receive_address' : IDL.Text,
      'pay_address' : IDL.Text,
      'price' : IDL.Float64,
      'pay_chain' : IDL.Text,
      'slippage' : IDL.Float64,
    });
    const RequestReply = IDL.Variant({
      'AddLiquidity' : AddLiquidityReply,
      'Swap' : SwapReply,
      'AddPool' : AddPoolReply,
      'RemoveLiquidity' : RemoveLiquidityReply,
      'Pending' : IDL.Null,
    });
    const RequestsReply = IDL.Record({
      'ts' : IDL.Nat64,
      'request_id' : IDL.Nat64,
      'request' : RequestRequest,
      'statuses' : IDL.Vec(IDL.Text),
      'reply' : RequestReply,
    });
    const RequestsResult = IDL.Variant({
      'Ok' : IDL.Vec(RequestsReply),
      'Err' : IDL.Text,
    });
    const SendArgs = IDL.Record({
      'token' : IDL.Text,
      'to_address' : IDL.Text,
      'amount' : IDL.Nat,
    });
    const SendReply = IDL.Record({
      'ts' : IDL.Nat64,
      'request_id' : IDL.Nat64,
      'status' : IDL.Text,
      'tx_id' : IDL.Nat64,
      'chain' : IDL.Text,
      'to_address' : IDL.Text,
      'amount' : IDL.Nat,
      'symbol' : IDL.Text,
    });
    const SendResult = IDL.Variant({ 'OK' : SendReply, 'Err' : IDL.Text });
    const SwapResult = IDL.Variant({ 'Ok' : SwapReply, 'Err' : IDL.Text });
    const SwapAmountsTxReply = IDL.Record({
      'receive_chain' : IDL.Text,
      'pay_amount' : IDL.Nat,
      'receive_amount' : IDL.Nat,
      'pay_symbol' : IDL.Text,
      'receive_symbol' : IDL.Text,
      'receive_address' : IDL.Text,
      'pool_symbol' : IDL.Text,
      'pay_address' : IDL.Text,
      'price' : IDL.Float64,
      'pay_chain' : IDL.Text,
      'lp_fee' : IDL.Nat,
      'gas_fee' : IDL.Nat,
    });
    const SwapAmountsReply = IDL.Record({
      'txs' : IDL.Vec(SwapAmountsTxReply),
      'receive_chain' : IDL.Text,
      'mid_price' : IDL.Float64,
      'pay_amount' : IDL.Nat,
      'receive_amount' : IDL.Nat,
      'pay_symbol' : IDL.Text,
      'receive_symbol' : IDL.Text,
      'receive_address' : IDL.Text,
      'pay_address' : IDL.Text,
      'price' : IDL.Float64,
      'pay_chain' : IDL.Text,
      'slippage' : IDL.Float64,
    });
    const SwapAmountsResult = IDL.Variant({
      'Ok' : SwapAmountsReply,
      'Err' : IDL.Text,
    });
    const SwapAsyncResult = IDL.Variant({ 'Ok' : IDL.Nat64, 'Err' : IDL.Text });
    const LPTokenReply = IDL.Record({
      'fee' : IDL.Nat,
      'decimals' : IDL.Nat8,
      'token_id' : IDL.Nat32,
      'chain' : IDL.Text,
      'name' : IDL.Text,
      'address' : IDL.Text,
      'pool_id_of' : IDL.Nat32,
      'is_removed' : IDL.Bool,
      'total_supply' : IDL.Nat,
      'symbol' : IDL.Text,
    });
    const TokenReply = IDL.Variant({ 'IC' : ICTokenReply, 'LP' : LPTokenReply });
    const TokensResult = IDL.Variant({
      'Ok' : IDL.Vec(TokenReply),
      'Err' : IDL.Text,
    });
    const UpdateTokenArgs = IDL.Record({ 'token' : IDL.Text });
    const UpdateTokenReply = IDL.Variant({ 'IC' : ICTokenReply });
    const UpdateTokenResult = IDL.Variant({
      'Ok' : UpdateTokenReply,
      'Err' : IDL.Text,
    });
    const LPBalancesReply = IDL.Record({
      'ts' : IDL.Nat64,
      'usd_balance' : IDL.Float64,
      'balance' : IDL.Float64,
      'name' : IDL.Text,
      'amount_0' : IDL.Float64,
      'amount_1' : IDL.Float64,
      'address_0' : IDL.Text,
      'address_1' : IDL.Text,
      'symbol_0' : IDL.Text,
      'symbol_1' : IDL.Text,
      'usd_amount_0' : IDL.Float64,
      'usd_amount_1' : IDL.Float64,
      'chain_0' : IDL.Text,
      'chain_1' : IDL.Text,
      'symbol' : IDL.Text,
      'lp_token_id' : IDL.Nat64,
    });
    const UserBalancesReply = IDL.Variant({ 'LP' : LPBalancesReply });
    const UserBalancesResult = IDL.Variant({
      'Ok' : IDL.Vec(UserBalancesReply),
      'Err' : IDL.Text,
    });
    const ValidateAddLiquidityResult = IDL.Variant({
      'Ok' : IDL.Text,
      'Err' : IDL.Text,
    });
    const ValidateRemoveLiquidityResult = IDL.Variant({
      'Ok' : IDL.Text,
      'Err' : IDL.Text,
    });
    return IDL.Service({
      'add_liquidity' : IDL.Func([AddLiquidityArgs], [AddLiquidityResult], []),
      'add_liquidity_amounts' : IDL.Func(
          [IDL.Text, IDL.Nat, IDL.Text],
          [AddLiquiditAmountsResult],
          ['query'],
        ),
      'add_liquidity_async' : IDL.Func(
          [AddLiquidityArgs],
          [AddLiquidityAsyncResult],
          [],
        ),
      'add_pool' : IDL.Func([AddPoolArgs], [AddPoolResult], []),
      'add_token' : IDL.Func([AddTokenArgs], [AddTokenResult], []),
      'check_pools' : IDL.Func([], [CheckPoolsResult], []),
      'claim' : IDL.Func([IDL.Nat64], [ClaimResult], []),
      'claims' : IDL.Func([IDL.Text], [ClaimsResult], ['query']),
      'get_user' : IDL.Func([], [UserResult], ['query']),
      'icrc10_supported_standards' : IDL.Func(
          [],
          [IDL.Vec(Icrc10SupportedStandards)],
          ['query'],
        ),
      'icrc1_name' : IDL.Func([], [IDL.Text], ['query']),
      'icrc21_canister_call_consent_message' : IDL.Func(
          [icrc21_consent_message_request],
          [icrc21_consent_message_response],
          [],
        ),
      'icrc28_trusted_origins' : IDL.Func([], [Icrc28TrustedOriginsResponse], []),
      'pools' : IDL.Func([IDL.Opt(IDL.Text)], [PoolsResult], ['query']),
      'remove_liquidity' : IDL.Func(
          [RemoveLiquidityArgs],
          [RemoveLiquidityResult],
          [],
        ),
      'remove_liquidity_amounts' : IDL.Func(
          [IDL.Text, IDL.Text, IDL.Nat],
          [RemoveLiquidityAmountsResult],
          ['query'],
        ),
      'remove_liquidity_async' : IDL.Func(
          [RemoveLiquidityArgs],
          [RemoveLiquidityAsyncResult],
          [],
        ),
      'requests' : IDL.Func([IDL.Opt(IDL.Nat64)], [RequestsResult], ['query']),
      'send' : IDL.Func([SendArgs], [SendResult], []),
      'swap' : IDL.Func([SwapArgs], [SwapResult], []),
      'swap_amounts' : IDL.Func(
          [IDL.Text, IDL.Nat, IDL.Text],
          [SwapAmountsResult],
          ['query'],
        ),
      'swap_async' : IDL.Func([SwapArgs], [SwapAsyncResult], []),
      'tokens' : IDL.Func([IDL.Opt(IDL.Text)], [TokensResult], ['query']),
      'update_token' : IDL.Func([UpdateTokenArgs], [UpdateTokenResult], []),
      'user_balances' : IDL.Func([IDL.Text], [UserBalancesResult], ['query']),
      'validate_add_liquidity' : IDL.Func([], [ValidateAddLiquidityResult], []),
      'validate_remove_liquidity' : IDL.Func(
          [],
          [ValidateRemoveLiquidityResult],
          [],
        ),
    });
  };
  export const init = ({ IDL }) => { return []; };