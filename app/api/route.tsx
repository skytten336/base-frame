/** @jsxImportSource frog/jsx */
import { Frog, Button, type FrameContext } from "frog";
import { baseSepolia } from "viem/chains";

export const runtime = "nodejs";

const app = new Frog({
  title: "Base Mint Frame",
  assetsPath: "/",
  basePath: "/api",
  imageOptions: { width: 1200, height: 630 },
  hub: { apiUrl: "https://hubs.airstack.xyz" },
});

app.frame("/", (c: FrameContext) => {
  const { origin } = new URL(c.req.url);
  const imgUrl = `${origin}/collage.jpg`;

  return c.res({
    image: (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "grid",
          gridTemplateRows: "auto 1fr auto",
          background:
            "radial-gradient(1200px 600px at 50% -20%, #051125 0%, #030914 55%, #02050d 100%)",
          color: "white",
          padding: "36px 40px",
          boxSizing: "border-box",
          fontFamily:
            "ui-sans-serif, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
          letterSpacing: "-0.01em",
        }}
      >
        {/* Верхній напис */}
        <div
          style={{
            textAlign: "center",
            fontSize: 40,
            fontWeight: 800,
            lineHeight: 1.2,
            background:
              "linear-gradient(90deg, #00C2FF, #006EFF, #00C2FF, #006EFF)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundSize: "400% 100%",
            animation: "gradientShift 8s ease-in-out infinite",
          }}
        >
          Check who you are on the Base network:
          <br />
          Builder, Creator, Farmer or Basehead
        </div>

        {/* Зона зображення */}
        <div
          style={{
            display: "grid",
            placeItems: "center",
            padding: "12px 0",
            position: "relative",
          }}
        >
          {/* Неонове світіння */}
          <div
            style={{
              position: "absolute",
              width: "84%",
              height: "84%",
              borderRadius: "22px",
              background:
                "conic-gradient(from 0deg, #00C2FF, #006EFF, #00C2FF, #006EFF)",
              filter: "blur(40px)",
              opacity: 0.25,
              animation: "rotateGlow 10s linear infinite",
            }}
          ></div>

          {/* Основне зображення */}
          <img
            src={imgUrl}
            alt="Roles collage"
            width={992}
            height={496}
            style={{
              width: "992px",
              height: "496px",
              objectFit: "cover",
              borderRadius: "18px",
              border: "3px solid rgba(0, 120, 255, 0.5)",
              boxShadow:
                "0 0 35px rgba(0, 195, 255, 0.5), 0 0 15px rgba(0, 120, 255, 0.4)",
            }}
          />
        </div>

        {/* Нижня частина */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            opacity: 0.85,
            fontSize: 22,
            marginTop: "8px",
          }}
        >
          <span>Powered by Base</span>
          <span>Mint your role NFT</span>
        </div>

        {/* CSS-анімації */}
        <style>{`
          @keyframes rotateGlow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}</style>
      </div>
    ),

    // Кнопка для відправки транзакції
    intents: [<Button action="tx">Mint</Button>],
  });
});

// 🔹 Конфігурація виклику смарт-контракту
const CONTRACT_ADDRESS = "0x38579E3A48673F05F3847B65744919d448c521D8";

const NFT_ABI = [
  {
    type: "function",
    stateMutability: "nonpayable",
    name: "mint",
    inputs: [],
    outputs: [],
  },
] as const;

// 🔹 Визначення маршруту транзакції
app.transaction("/mint", (c) => {
  return c.contract({
    abi: NFT_ABI,
    to: CONTRACT_ADDRESS as `0x${string}`,
    functionName: "mint",
    chainId: "eip155:8453", // ✅ Base mainnet
  });
});

// 🔹 Проксі у Next.js App Router
export async function GET(req: Request) {
  return app.fetch(req);
}
export async function POST(req: Request) {
  return app.fetch(req);
}
