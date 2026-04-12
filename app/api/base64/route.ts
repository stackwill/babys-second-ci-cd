import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { text?: unknown };
  const text = typeof body.text === "string" ? body.text : "";

  if (!text) {
    return NextResponse.json(
      { error: "Provide text to encode." },
      { status: 400 },
    );
  }

  const encoded = Buffer.from(text, "utf8").toString("base64");

  return NextResponse.json({
    encoded,
    source: "server",
  });
}
