import { Client, networks } from './src/contracts/kns/src/index.ts';
import { Keypair } from '@stellar/stellar-sdk';

async function run() {
  try {
    const adminKp = Keypair.random();
    console.log("Admin generated:", adminKp.publicKey());
    
    console.log("Funding admin via Friendbot...");
    await fetch(`https://friendbot.stellar.org?addr=${adminKp.publicKey()}`);
    console.log("Funded.");
    
    const client = new Client({
      networkPassphrase: networks.testnet.networkPassphrase,
      contractId: networks.testnet.contractId,
      rpcUrl: 'https://soroban-testnet.stellar.org',
      publicKey: adminKp.publicKey(),
    });
    
    console.log("Simulating register...");
    const tx = await client.register({
      name: 'hello',
      tld: {tag: 'Kale'},
      owner: adminKp.publicKey()
    });
    console.log("Simulation Result:", tx.result);
  } catch (e) {
    console.error("Error:", e);
  }
}
run();
