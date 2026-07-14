/** @jsxImportSource frog/jsx */

import { Button, Frog } from 'frog';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DEFAULT_CONTRACT_ADDRESS =
  '0x38579E3A48673F05F3847B65744919d448c521D8';

const CONTRACT_ADDRESS = (
  /^0x[0-9a-fA-F]{40}$/.test(process.env.CONTRACT_ADDRESS ?? '')
    ? process.env.CONTRACT_ADDRESS
    : DEFAULT_CONTRACT_ADDRESS
) as `0x${string}`;

const NFT_ABI = [
  {
    type: 'function',
    name: 'mint',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
] as const;

const app = new Frog({
  title: 'Base NFT Mint Frame',
  assetsPath: '/',
  basePath: '/api',
  imageAspectRatio: '1:1',
});

app.frame('/', (c) => {
  return c.res({
    image: new URL('/collage.jpg', c.req.url).href,
    intents: [<Button action="/confirm">Mint NFT</Button>],
  });
});

app.frame('/confirm', (c) => {
  return c.res({
    image: new URL('/collage.jpg', c.req.url).href,
    intents: [
      <Button.Transaction target="/tx/mint">
        Sign & Mint
      </Button.Transaction>,
    ],
  });
});

app.transaction('/tx/mint', (c) => {
  return c.contract({
    abi: NFT_ABI,
    chainId: 'eip155:8453',
    functionName: 'mint',
    to: CONTRACT_ADDRESS,
  });
});

function handleRequest(request: Request) {
  const url = new URL(request.url);

  // Frog registers its root frame at `/api/`, while Next normalizes the
  // public URL to `/api`. Feed Frog the route shape it expects.
  if (url.pathname === '/api') {
    url.pathname = '/api/';
    return app.fetch(new Request(url, request));
  }

  return app.fetch(request);
}

export const GET = handleRequest;
export const POST = handleRequest;
