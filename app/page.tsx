'use client';

import { sdk } from '@farcaster/miniapp-sdk';
import { encodeFunctionData } from 'viem';
import { useEffect, useState } from 'react';
import styles from './page.module.css';

const CONTRACT_ADDRESS = '0x16050F4246C1C97A3Da2A73f7736b44A3062B4b8';
const BASE_CHAIN_ID = '0x2105';
const APP_URL = 'https://base-frame-plum.vercel.app';
const EXPLORER_URL = `https://basescan.org/address/${CONTRACT_ADDRESS}`;

const NFT_ABI = [
  {
    type: 'function',
    name: 'mint',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
] as const;

type MintStatus = 'idle' | 'confirming' | 'submitted' | 'success' | 'error';
type TxReceipt = {
  status?: string;
  logs?: Array<{ address: string; topics: string[] }>;
};

const roles = ['Builder', 'Creator', 'Farmer', 'Basehead'];

function wait(delay: number) {
  return new Promise((resolve) => window.setTimeout(resolve, delay));
}

export default function Home() {
  const [isMiniApp, setIsMiniApp] = useState<boolean | null>(null);
  const [status, setStatus] = useState<MintStatus>('idle');
  const [message, setMessage] = useState('');
  const [transactionHash, setTransactionHash] = useState('');
  const [tokenId, setTokenId] = useState('');

  useEffect(() => {
    let active = true;

    void sdk.isInMiniApp().then(async (insideMiniApp) => {
      if (active) setIsMiniApp(insideMiniApp);
      if (insideMiniApp) await sdk.actions.ready();
    });

    return () => {
      active = false;
    };
  }, []);

  async function mint() {
    setStatus('confirming');
    setMessage('');
    setTransactionHash('');
    setTokenId('');

    try {
      const provider = await sdk.wallet.getEthereumProvider();
      if (!provider) {
        throw new Error('Open this app inside Farcaster to connect your wallet.');
      }

      const chainId = await provider.request({ method: 'eth_chainId' });
      if (chainId !== BASE_CHAIN_ID) {
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: BASE_CHAIN_ID }],
        });
      }

      const accounts = (await provider.request({
        method: 'eth_requestAccounts',
      })) as string[];
      const from = accounts[0];
      if (!from) throw new Error('No wallet account is available.');

      const data = encodeFunctionData({
        abi: NFT_ABI,
        functionName: 'mint',
      });

      const hash = (await provider.request({
        method: 'eth_sendTransaction',
        params: [{ from, to: CONTRACT_ADDRESS, data }],
      })) as string;

      setTransactionHash(hash);
      setStatus('submitted');

      let receipt: TxReceipt | null = null;
      for (let attempt = 0; attempt < 45; attempt += 1) {
        receipt = (await provider.request({
          method: 'eth_getTransactionReceipt',
          params: [hash],
        })) as TxReceipt | null;
        if (receipt) break;
        await wait(2000);
      }

      if (!receipt) {
        setMessage('The transaction is still processing. Follow it on BaseScan.');
        return;
      }
      if (receipt.status !== '0x1') {
        throw new Error('The transaction failed on Base.');
      }

      const transferLog = receipt.logs?.find(
        (log) =>
          log.address.toLowerCase() === CONTRACT_ADDRESS.toLowerCase() &&
          log.topics.length > 3,
      );
      if (transferLog?.topics[3]) {
        setTokenId(BigInt(transferLog.topics[3]).toString());
      }

      setStatus('success');
      try {
        await sdk.haptics.notificationOccurred('success');
      } catch {
        // Haptics are optional and unavailable in some hosts.
      }
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Mint was cancelled.');
    }
  }

  async function share() {
    await sdk.actions.composeCast({
      text: 'I just minted my onchain Base role. Which one are you?',
      embeds: [APP_URL],
    });
  }

  const isBusy = status === 'confirming' || status === 'submitted';
  const transactionUrl = transactionHash
    ? `https://basescan.org/tx/${transactionHash}`
    : EXPLORER_URL;

  if (status === 'success') {
    return (
      <main className={styles.main}>
        <section className={`${styles.card} ${styles.successCard}`}>
          <div className={styles.successGlow} aria-hidden="true" />
          <div className={styles.successIcon} aria-hidden="true">
            <span>✓</span>
          </div>
          <div className={styles.eyebrow}>Mint complete</div>
          <h1 className={styles.successTitle}>Your Base role is onchain</h1>
          <p className={styles.successCopy}>
            {tokenId ? `Token #${tokenId}` : 'Your NFT'} now belongs to your wallet on Base.
          </p>
          <div className={styles.successActions}>
            <button type="button" className={styles.primaryButton} onClick={share}>
              Share on Farcaster
            </button>
            <a className={styles.secondaryButton} href={transactionUrl} target="_blank" rel="noreferrer">
              View on BaseScan <span aria-hidden="true">↗</span>
            </a>
          </div>
          <button type="button" className={styles.textButton} onClick={() => setStatus('idle')}>
            Back to Base Roles
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <section className={styles.card}>
        <header className={styles.brandRow}>
          <div className={styles.brand}>
            <span className={styles.brandMark} aria-hidden="true" />
            Base Roles
          </div>
          <span className={styles.networkBadge}>Base</span>
        </header>

        <div className={styles.heroWrap}>
          <img
            className={styles.hero}
            src="/hero-v2.jpg"
            alt="Futuristic blue Base Roles android"
          />
          <div className={styles.heroShade} aria-hidden="true" />
        </div>

        <div className={styles.intro}>
          <div className={styles.eyebrow}>Your identity on Base</div>
          <h1 className={styles.title}>Discover your Base role</h1>
          <p className={styles.copy}>Mint one of four onchain identities.</p>
        </div>

        <div className={styles.roles} aria-label="Available roles">
          {roles.map((role) => (
            <span className={styles.role} key={role}>
              <span className={styles.roleDot} aria-hidden="true" />
              {role}
            </span>
          ))}
        </div>

        <button
          type="button"
          onClick={mint}
          disabled={isBusy || isMiniApp === false}
          className={styles.primaryButton}
        >
          {status === 'confirming'
            ? 'Confirm in wallet'
            : status === 'submitted'
              ? 'Minting on Base…'
              : isMiniApp === false
                ? 'Open in Farcaster to mint'
                : 'Mint my role'}
          {!isBusy && isMiniApp !== false && <span aria-hidden="true">→</span>}
          {isBusy && <span className={styles.spinner} aria-hidden="true" />}
        </button>

        <div className={styles.trustRow}>
          <span><span className={styles.statusDot} aria-hidden="true" />Free mint</span>
          <span>Base network</span>
        </div>

        {(message || status === 'error') && (
          <div className={status === 'error' ? styles.errorBox : styles.statusBox} role="status">
            {message}
            {transactionHash && (
              <a href={transactionUrl} target="_blank" rel="noreferrer">
                View transaction ↗
              </a>
            )}
          </div>
        )}

        <a className={styles.contractLink} href={EXPLORER_URL} target="_blank" rel="noreferrer">
          Contract: {CONTRACT_ADDRESS.slice(0, 6)}…{CONTRACT_ADDRESS.slice(-4)} <span aria-hidden="true">↗</span>
        </a>
      </section>
    </main>
  );
}
