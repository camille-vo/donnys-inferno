import { NextResponse } from "next/server";
import {
  EgressClient,
  WebhookReceiver,
  DirectFileOutput,
  TrackType,
} from "livekit-server-sdk";

const receiver = new WebhookReceiver(
  process.env.LIVEKIT_API_KEY!,
  process.env.LIVEKIT_API_SECRET!
);

export async function POST(req: Request) {
  const body = await req.text();
  const authHeader = req.headers.get("Authorization") ?? "";

  let event;
  try {
    event = await receiver.receive(body, authHeader);
  } catch (err) {
    console.error("Webhook validation failed:", err);
    return NextResponse.json({ error: "Invalid webhook" }, { status: 401 });
  }

  console.log("Webhook event:", event.event, event.room?.name);

  if (event.event === "track_published" && event.track && event.participant && event.room) {
    if (event.track.type === TrackType.AUDIO) {
      const identity = event.participant.identity;
      const roomName = event.room.name;
      const trackSid = event.track.sid;
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const filepath = `/out/${identity}-${roomName}-${timestamp}.ogg`;

      const egressClient = new EgressClient(
        process.env.LIVEKIT_URL!,
        process.env.LIVEKIT_API_KEY!,
        process.env.LIVEKIT_API_SECRET!
      );

      const output = new DirectFileOutput({ filepath });

      try {
        const info = await egressClient.startTrackEgress(roomName, output, trackSid);
        console.log(`Track egress started for ${identity}:`, info.egressId);
      } catch (err) {
        console.error(`Failed to start track egress for ${identity}:`, err);
      }
    }
  }

  return NextResponse.json({ ok: true });
}
