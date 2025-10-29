/** @jsxImportSource frog/jsx */
import { Frog, Button } from "frog";

export const runtime = "edge";            // важливо для Vercel
export const dynamic = "force-dynamic";   // щоб не кешувалось як статика
export const revalidate = 0;

const app = new Frog({
  title: "Base Mint Frame",
  assetsPath: "/",
  basePath: "/api",
  imageOptions: { width: 1200, height: 630 },
  hub: { apiUrl: "https://hubs.airstack.xyz" },
});

// Головний кадр
app.frame("/", (c) => {
  const count = Number(c.buttonValue ?? 0);

  return c.res({
    image: (
      <div
        style={{
          display: "grid",
          placeItems: "center",
          width: "100%",
          height: "100%",
          background: "#020617",
          color: "white",
          fontSize: 38,
          fontWeight: 700,
          letterSpacing: "-0.02em",
        }}
      >
        Check who you are on the Base network:
        <br />
        Builder • Creator • Farmer • Basehead
      </div>
    ),
    intents: [<Button value={(count + 1).toString()}>Mint</Button>],
  });
});

// ВАЖЛИВО: експортуємо обидва хендлери
export const GET = (req: Request) => app.fetch(req);
export const POST = (req: Request) => app.fetch(req);
