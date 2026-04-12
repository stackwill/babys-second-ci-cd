"use client";

import { FormEvent, useState } from "react";

type EncodeResponse = {
  encoded: string;
  source: "server";
};

type ErrorResponse = {
  error?: string;
};

const initialInput = "Hello from the server route.";

export function Base64Demo() {
  const [input, setInput] = useState(initialInput);
  const [encoded, setEncoded] = useState("");
  const [status, setStatus] = useState("Ready to send text to the server.");
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setHasError(false);
    setStatus("Encoding on the server...");

    try {
      const response = await fetch("/api/base64", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: input }),
      });

      const payload = (await response.json()) as EncodeResponse | ErrorResponse;

      if (!response.ok || !("encoded" in payload)) {
        const message =
          "error" in payload
            ? payload.error ?? "The server could not encode the text."
            : "The server could not encode the text.";

        throw new Error(message);
      }

      setEncoded(payload.encoded);
      setStatus("Encoded successfully on the server.");
    } catch (error) {
      setHasError(true);
      setStatus(
        error instanceof Error ? error.message : "An unknown error occurred.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="panel">
      <form className="demo-grid" onSubmit={handleSubmit}>
        <div className="field-group">
          <label htmlFor="plain-text">Text to encode</label>
          <textarea
            id="plain-text"
            name="plainText"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            spellCheck={false}
          />
        </div>

        <div className="actions">
          <button className="button" type="submit" disabled={isLoading}>
            {isLoading ? "Encoding..." : "Encode"}
          </button>
          <span className="hint">POSTs plain text to `/api/base64`.</span>
        </div>

        <p className="status" data-error={hasError}>
          {status}
        </p>

        <div className="result">
          <strong>Result</strong>
          <code>{encoded || "No server response yet."}</code>
        </div>
      </form>
    </section>
  );
}
