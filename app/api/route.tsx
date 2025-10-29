/** @jsxImportSource frog/jsx */
import { Frog, Button } from "frog";

// ── важливо, щоб Next не намагався статично будувати цей роут
export const dynamic = "force-dynamic";
export const revalidate = 0;

// якщо буде капризувати edge, поміняй на 'nodejs'
export const runtime = "edge";

const app = new Frog({
  title: "Base Mint Frame",
  basePath: "/api",
  assetsPath: "/",
  imageOptions: { width: 1200, height: 630 },
});

// простий фрейм для перевірки
app.frame("/", (c) =>
  c.res({
    image: (
      <div
        style={{
          display: "grid",
          placeItems: "center",
          width: "100%",
          height: "100%",
          background: "#0b0f1a",
          color: "white",
          fontSize: 48,
          fontWeight: 700,
          letterSpacing: "-0.02em",
        }}
      >
        Base Mint Frame — OK
      </div>
    ),
    intents: [<Button>Mint</Button>],
  }),
);

// health-маршрут щоб легко debugg’ити
app.get("/health", (c) => c.text("ok"));

export async function GET(req: Request) {
  return app.fetch(req);
}
export async function POST(req: Request) {
  return app.fetch(req);
}
