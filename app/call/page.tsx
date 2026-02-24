"use client";

import "@livekit/components-styles";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  ControlBar,
  GridLayout,
  ParticipantTile,
  VideoConference,
} from "@livekit/components-react";
import { useEffect, useState } from "react";
import { generate } from 'yet-another-name-generator'
import Flower from "./Flower";

export default function RoomPage() {

  // Safe decode + fallback
  const roomName = "frends";

  const [token, setToken] = useState<string | null>(null);
  const [name, setName] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("lk_name") || generate();
    setName(saved);
  }, []);

  useEffect(() => {
    if (!name) return;
    (async () => {
      const res = await fetch("/api/livekit/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ room: roomName, name }),
      });
      const data = await res.json();
      setToken(data.token);
    })();
  }, [name, roomName]);

  if (!token) return <main style={{ padding: 24 }}>Getting token…</main>;

  return (
    <div style={{ position: "relative" }}>
      <LiveKitRoom
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
        token={token}
        connect
        audio
        video
        style={{ height: "90vh" }}
      >
        <VideoConference />
      </LiveKitRoom>
      <div style={{ position: "fixed", bottom: 80, left: "50%", transform: "translateX(-50%)", zIndex: 50 }}>
        <Flower />
      </div>
    </div>
  );
}