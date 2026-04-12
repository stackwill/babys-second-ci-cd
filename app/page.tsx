import { Base64Demo } from "./ui/base64-demo";

export default function Home() {
  return (
    <main className="shell">
      <section className="hero">
        <p className="eyebrow">Server-side demo</p>
        <h1>Base64 encoder</h1>
        <p className="intro">
          Submit text. The page sends it to a Next.js route handler, which
          encodes it on the server with <code>Buffer</code> and returns JSON.
        </p>
      </section>
      <Base64Demo />
    </main>
  );
}
