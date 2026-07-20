import { useState } from 'react';
import { Client, networks } from '../contracts/kns';
import albedo from '@albedo-link/intent';
import { rpc, TransactionBuilder } from '@stellar/stellar-sdk';

import { signTransaction } from '@stellar/freighter-api';

const TESTNET_RPC_URL = 'https://soroban-testnet.stellar.org';
const PUBLICNET_RPC_URL = 'https://soroban-rpc.mainnet.stellar.org';

const FAKE_PUBLICNET_ID = 'CCXFUKZ6D3ZLV6K3U4F5XYH3Y4BZTKTB7FMYI3U5WZVXV7OEZN7V4GZ6';

export default function useKns(walletPubKey, walletType, network = 'testnet') {
  const [txStatus, setTxStatus] = useState('idle'); // idle | waiting | confirming | error | success
  const [errorMessage, setErrorMessage] = useState('');

  const RPC_URL = network === 'testnet' ? TESTNET_RPC_URL : PUBLICNET_RPC_URL;
  const rpcServer = new rpc.Server(RPC_URL);
  
  const getNetworkPassphrase = () => network === 'testnet' ? networks.testnet.networkPassphrase : "Public Global Stellar Network ; September 2015";
  const getContractId = () => network === 'testnet' ? networks.testnet.contractId : FAKE_PUBLICNET_ID;

  const resetTx = () => {
    setTxStatus('idle');
    setErrorMessage('');
  };

  const getClient = () => {
    return new Client({
      networkPassphrase: getNetworkPassphrase(),
      contractId: getContractId(),
      rpcUrl: RPC_URL,
      publicKey: walletPubKey,
    });
  };

  const submitTransaction = async (tx) => {
    setTxStatus('waiting');
    
    try {
      let actualXdr = null;
      
      if (walletType === 'freighter') {
        setTxStatus('confirming');
        let signedXdr;
        try {
          const freighterNetwork = network === 'testnet' ? 'TESTNET' : 'PUBLIC';
          signedXdr = await signTransaction(tx.built.toXDR(), { network: freighterNetwork });
        } catch (e) {
          throw new Error("User rejected signing or Freighter error: " + e.message);
        }
        
        if (signedXdr.error) throw new Error(signedXdr.error);
        actualXdr = typeof signedXdr === 'string' ? signedXdr : signedXdr.signedTx;
        if (!actualXdr) throw new Error("Did not receive signed XDR from Freighter.");
      } 
 
      else if (walletType === 'albedo') {
        const xdr = tx.built.toXDR();
        // Force albedo to only sign, not submit, so we can broadcast and poll reliably via our RPC
        const albedoNetwork = network === 'testnet' ? 'testnet' : 'public';
        const res = await albedo.tx({ xdr, network: albedoNetwork, submit: false });
        actualXdr = res.signed_envelope_xdr;
        if (!actualXdr) throw new Error("Did not receive signed XDR from Albedo.");
        setTxStatus('confirming');
      } 
      
      else if (walletType === 'rabet') {
        const xdr = tx.built.toXDR();
        const rabetNetwork = network === 'testnet' ? 'testnet' : 'mainnet';
        const res = await window.rabet.sign(xdr, rabetNetwork);
        actualXdr = res.xdr;
        if (!actualXdr) throw new Error("Did not receive signed XDR from Rabet.");
        setTxStatus('confirming');
      }

      // ---------------------------------------------------------
      // MANUALLY BROADCAST AND POLL
      // ---------------------------------------------------------
      const signedTx = TransactionBuilder.fromXDR(actualXdr, getNetworkPassphrase());
      const sendRes = await rpcServer.sendTransaction(signedTx);
      
      if (sendRes.status === "ERROR") {
        throw new Error("RPC Broadcast Error: " + (sendRes.errorResultXdr || JSON.stringify(sendRes)));
      }
      
      let status = "PENDING";
      let attempt = 0;
      while (status === "PENDING" && attempt < 15) {
        await new Promise(r => setTimeout(r, 2000));
        const txInfo = await rpcServer.getTransaction(sendRes.hash);
        status = txInfo.status;
        if (status === "SUCCESS") break;
        if (status === "FAILED") {
           const resultXdr = txInfo.resultXdr;
           throw new Error("Transaction FAILED on-chain. Result XDR: " + resultXdr);
        }
        attempt++;
      }
      if (status === "PENDING") throw new Error("Transaction confirmation timeout.");

      setTxStatus('success');
      return true;
    } catch (e) {
      console.error(e);
      setTxStatus('error');
      setErrorMessage(e.message || "Transaction rejected or failed");
      // setTimeout(() => setTxStatus('idle'), 4000);
      return false;
    }
  };

  const formatTld = (tldString) => {
    const rawTag = tldString.replace('.', '');
    
    // Check if it's one of the static ones
    const staticTags = ['kale', 'farm', 'fun', 'kalien', 'farmer'];
    if (staticTags.includes(rawTag.toLowerCase())) {
        return { tag: rawTag.charAt(0).toUpperCase() + rawTag.slice(1).toLowerCase(), values: void 0 };
    }
    
    // If it's a custom extension
    return { tag: "Custom", values: [rawTag.toLowerCase()] };
  };

  const registerDomain = async (name, tldString) => {
    if (!walletPubKey) return false;
    try {
      setTxStatus('waiting'); // Initializing simulation
      const client = getClient();
      const tld = formatTld(tldString);
      
      const tx = await client.register({ name, tld, owner: walletPubKey });
      return await submitTransaction(tx);
    } catch (e) {
      console.error(e);
      setTxStatus('error');
      setErrorMessage(e.message || "Domain taken or simulation failed");
      // setTimeout(() => setTxStatus('idle'), 4000);
      return false;
    }
  };

  const redeemDomain = async (name, tldString) => {
    if (!walletPubKey) return false;
    try {
      setTxStatus('waiting'); 
      const client = getClient();
      const tld = formatTld(tldString);
      
      const tx = await client.redeem_domain({ name, tld, buyer: walletPubKey });
      return await submitTransaction(tx);
    } catch (e) {
      console.error(e);
      setTxStatus('error');
      setErrorMessage(e.message || "Simulation failed");
      setTimeout(() => setTxStatus('idle'), 4000);
      return false;
    }
  };

  return { registerDomain, redeemDomain, txStatus, errorMessage, resetTx };
}
