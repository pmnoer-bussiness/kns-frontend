import { Buffer } from "buffer";
import { Address } from "@stellar/stellar-sdk";
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Result,
  Spec as ContractSpec,
} from "@stellar/stellar-sdk/contract";
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Timepoint,
  Duration,
} from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";

if (typeof window !== "undefined") {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}


export const networks = {
  testnet: {
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: "CCLUVWFPKQDEZPCDX4NR27AK7TN62PV2IT5F6KY2GXJEMKEWWUJRRVOS",
  }
} as const

export type Tld = {tag: "Kale", values: void} | {tag: "Farm", values: void} | {tag: "Fun", values: void} | {tag: "Kalien", values: void} | {tag: "Farmer", values: void} | {tag: "Custom", values: readonly [string]};

export type DataKey = {tag: "Admin", values: void} | {tag: "KaleToken", values: void} | {tag: "FlatFee", values: void} | {tag: "Domain", values: readonly [FullDomain]} | {tag: "Listing", values: readonly [FullDomain]};


export interface FullDomain {
  name: string;
  tld: Tld;
}

export interface Client {
  /**
   * Construct and simulate a resolve transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Membaca/Menerjemahkan domain menjadi alamat dompet (Resolve)
   */
  resolve: ({name, tld}: {name: string, tld: Tld}, options?: MethodOptions) => Promise<AssembledTransaction<string>>

  /**
   * Construct and simulate a register transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Mendaftarkan domain baru (Minting)
   */
  register: ({name, tld, owner}: {name: string, tld: Tld, owner: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Inisialisasi kontrak
   */
  initialize: ({admin, kale_token, flat_fee}: {admin: string, kale_token: string, flat_fee: i128}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a list_domain transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Memasang harga jual untuk domain (Listing)
   */
  list_domain: ({name, tld, owner, price}: {name: string, tld: Tld, owner: string, price: i128}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a redeem_domain transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Membeli domain yang sedang dijual (Redeem/Atomic Swap)
   */
  redeem_domain: ({name, tld, buyer}: {name: string, tld: Tld, buyer: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a unlist_domain transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Membatalkan penjualan domain (Unlisting)
   */
  unlist_domain: ({name, tld, owner}: {name: string, tld: Tld, owner: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a transfer_domain transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Mentransfer domain (P2P gratis)
   */
  transfer_domain: ({name, tld, from, to}: {name: string, tld: Tld, from: string, to: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      }
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy(null, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAgAAAAAAAAAAAAAAA1RsZAAAAAAGAAAAAAAAAAAAAAAES2FsZQAAAAAAAAAAAAAABEZhcm0AAAAAAAAAAAAAAANGdW4AAAAAAAAAAAAAAAAGS2FsaWVuAAAAAAAAAAAAAAAAAAZGYXJtZXIAAAAAAAEAAAAAAAAABkN1c3RvbQAAAAAAAQAAABA=",
        "AAAAAAAAADxNZW1iYWNhL01lbmVyamVtYWhrYW4gZG9tYWluIG1lbmphZGkgYWxhbWF0IGRvbXBldCAoUmVzb2x2ZSkAAAAHcmVzb2x2ZQAAAAACAAAAAAAAAARuYW1lAAAAEAAAAAAAAAADdGxkAAAAB9AAAAADVGxkAAAAAAEAAAAT",
        "AAAAAAAAACJNZW5kYWZ0YXJrYW4gZG9tYWluIGJhcnUgKE1pbnRpbmcpAAAAAAAIcmVnaXN0ZXIAAAADAAAAAAAAAARuYW1lAAAAEAAAAAAAAAADdGxkAAAAB9AAAAADVGxkAAAAAAAAAAAFb3duZXIAAAAAAAATAAAAAA==",
        "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAABQAAAAAAAAAAAAAABUFkbWluAAAAAAAAAAAAAAAAAAAJS2FsZVRva2VuAAAAAAAAAAAAAAAAAAAHRmxhdEZlZQAAAAABAAAAAAAAAAZEb21haW4AAAAAAAEAAAfQAAAACkZ1bGxEb21haW4AAAAAAAEAAAAAAAAAB0xpc3RpbmcAAAAAAQAAB9AAAAAKRnVsbERvbWFpbgAA",
        "AAAAAAAAABRJbmlzaWFsaXNhc2kga29udHJhawAAAAppbml0aWFsaXplAAAAAAADAAAAAAAAAAVhZG1pbgAAAAAAABMAAAAAAAAACmthbGVfdG9rZW4AAAAAABMAAAAAAAAACGZsYXRfZmVlAAAACwAAAAA=",
        "AAAAAAAAACpNZW1hc2FuZyBoYXJnYSBqdWFsIHVudHVrIGRvbWFpbiAoTGlzdGluZykAAAAAAAtsaXN0X2RvbWFpbgAAAAAEAAAAAAAAAARuYW1lAAAAEAAAAAAAAAADdGxkAAAAB9AAAAADVGxkAAAAAAAAAAAFb3duZXIAAAAAAAATAAAAAAAAAAVwcmljZQAAAAAAAAsAAAAA",
        "AAAAAQAAAAAAAAAAAAAACkZ1bGxEb21haW4AAAAAAAIAAAAAAAAABG5hbWUAAAAQAAAAAAAAAAN0bGQAAAAH0AAAAANUbGQA",
        "AAAAAAAAADZNZW1iZWxpIGRvbWFpbiB5YW5nIHNlZGFuZyBkaWp1YWwgKFJlZGVlbS9BdG9taWMgU3dhcCkAAAAAAA1yZWRlZW1fZG9tYWluAAAAAAAAAwAAAAAAAAAEbmFtZQAAABAAAAAAAAAAA3RsZAAAAAfQAAAAA1RsZAAAAAAAAAAABWJ1eWVyAAAAAAAAEwAAAAA=",
        "AAAAAAAAAChNZW1iYXRhbGthbiBwZW5qdWFsYW4gZG9tYWluIChVbmxpc3RpbmcpAAAADXVubGlzdF9kb21haW4AAAAAAAADAAAAAAAAAARuYW1lAAAAEAAAAAAAAAADdGxkAAAAB9AAAAADVGxkAAAAAAAAAAAFb3duZXIAAAAAAAATAAAAAA==",
        "AAAAAAAAAB9NZW50cmFuc2ZlciBkb21haW4gKFAyUCBncmF0aXMpAAAAAA90cmFuc2Zlcl9kb21haW4AAAAABAAAAAAAAAAEbmFtZQAAABAAAAAAAAAAA3RsZAAAAAfQAAAAA1RsZAAAAAAAAAAABGZyb20AAAATAAAAAAAAAAJ0bwAAAAAAEwAAAAA=" ]),
      options
    )
  }
  public readonly fromJSON = {
    resolve: this.txFromJSON<string>,
        register: this.txFromJSON<null>,
        initialize: this.txFromJSON<null>,
        list_domain: this.txFromJSON<null>,
        redeem_domain: this.txFromJSON<null>,
        unlist_domain: this.txFromJSON<null>,
        transfer_domain: this.txFromJSON<null>
  }
}