import { NextResponse } from "next/server";
import { AccessToken } from "livekit-server-sdk";

export async function POST(req: Request) {
  const { room, name } = await req.json();

  console.log("Generating token for", { room, name });

  const apiKey = process.env.LIVEKIT_API_KEY!;
  const apiSecret = process.env.LIVEKIT_API_SECRET!;

  const token = new AccessToken(apiKey, apiSecret, { identity: name, name });
  token.addGrant({ roomJoin: true, room, canPublish: true, canSubscribe: true });

  const jwt = await token.toJwt();
  return NextResponse.json({ token: jwt });
}