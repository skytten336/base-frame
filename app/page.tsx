'use client';

import { sdk } from '@farcaster/miniapp-sdk';
import { encodeFunctionData } from 'viem';
import { useEffect, useState } from 'react';

const CONTRACT_ADDRESS = '0x38579E3A48673F05F3847B65744919d448c521D8';
const BASE_CHAIN_ID = '0x2105';

const NFT_ABI = [
  {
    type: 'function',
    name: 'mint',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
] as const;

export default function Home() {
  const [isMiniApp, setIsMiniApp] = useState<boolean | null>(null);
  const [isMinting, setIsMinting] = useState(false);
  const [message, setMessage] = useState('');
  const [transactionHash, setTransactionHash] = useState('');

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
    setIsMinting(true);
    setMessage('');
    setTransactionHash('');

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
      setMessage('Transaction submitted. Your Base role is being minted.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Mint was cancelled.');
    } finally {
      setIsMinting(false);
    }
  }

  return (
    <main
      style={{
        minHeight: '100dvh',
        background:
          'radial-gradient(circle at 50% 0%, #06336b 0%, #020b20 48%, #010512 100%)',
        color: '#ffffff',
        fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
        padding: '20px',
        boxSizing: 'border-box',
      }}
    >
      <section
        style={{
          width: '100%',
          maxWidth: 520,
          margin: '0 auto',
          display: 'grid',
          gap: 18,
        }}
      >
        <img
          src="/hero.png"
          alt="Base Roles: Builder, Basehead, Farmer, and Creator"
          style={{
            width: '100%',
            aspectRatio: '1200 / 630',
            objectFit: 'cover',
            borderRadius: 22,
            border: '1px solid rgba(75, 214, 255, 0.35)',
            boxShadow: '0 20px 60px rgba(0, 138, 255, 0.22)',
          }}
        />

        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              color: '#53dcff',
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
            }}
          >
            On Base
          </div>
          <h1 style={{ margin: '8px 0', fontSize: 36, lineHeight: 1.05 }}>
            Mint your Base role
          </h1>
          <p style={{ margin: 0, color: '#adbed9', fontSize: 16, lineHeight: 1.5 }}>
            Receive one of four onchain identities: Builder, Creator, Farmer, or
            Basehead.
          </p>
        </div>

        <button
          type="button"
          onClick={mint}
          disabled={isMinting || isMiniApp === false}
          style={{
            width: '100%',
            border: 0,
            borderRadius: 16,
            padding: '16px 20px',
            background:
              isMinting || isMiniApp === false
                ? '#25415f'
                : 'linear-gradient(135deg, #18c8ff, #0878ff)',
            color: '#ffffff',
            cursor: isMinting || isMiniApp === false ? 'not-allowed' : 'pointer',
            fontSize: 17,
            fontWeight: 800,
            boxShadow:
              isMinting || isMiniApp === false
                ? 'none'
                : '0 12px 34px rgba(0, 148, 255, 0.35)',
          }}
        >
          {isMinting
            ? 'Confirm in wallet...'
            : isMiniApp === false
              ? 'Open in Farcaster to mint'
              : 'Mint NFT'}
        </button>

        {message && (
          <div
            role="status"
            style={{
              padding: '14px 16px',
              borderRadius: 14,
              background: 'rgba(10, 35, 70, 0.8)',
              border: '1px solid rgba(83, 220, 255, 0.22)',
              color: transactionHash ? '#7fffd4' : '#d5e4fa',
              fontSize: 14,
              lineHeight: 1.45,
              overflowWrap: 'anywhere',
            }}
          >
            {message}
            {transactionHash && (
              <div style={{ marginTop: 6, color: '#8fb1dc' }}>
                Tx: {transactionHash.slice(0, 10)}...{transactionHash.slice(-8)}
              </div>
            )}
          </div>
        )}

        <div
          style={{
            textAlign: 'center',
            color: '#69809f',
            fontSize: 12,
            overflowWrap: 'anywhere',
          }}
        >
          Contract: {CONTRACT_ADDRESS}
        </div>
      </section>
    </main>
  );
}
