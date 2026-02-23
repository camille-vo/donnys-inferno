"use client";

import "@livekit/components-styles";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  ControlBar,
  GridLayout,
  ParticipantTile,
} from "@livekit/components-react";
import { useEffect, useMemo, useState } from "react";

export default function RoomPage(props: { params?: { room?: string } }) {
  // Safe decode + fallback
  const roomName = useMemo(() => {
    const raw = props?.params?.room;
    if (!raw) return "friends";
    try {
      return decodeURIComponent(raw);
    } catch {
      return raw;
    }
  }, [props?.params?.room]);

  const [token, setToken] = useState<string | null>(null);
  const [name, setName] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("lk_name") || "";
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

  if (!name) {
    return (
      <main style={{ padding: 24 }}>
        <h1>Join {roomName}</h1>
        <input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            localStorage.setItem("lk_name", e.target.value);
          }}
          placeholder="Your name"
          style={{ padding: 8 }}
        />
      </main>
    );
  }

  if (!token) return <main style={{ padding: 24 }}>Getting token…</main>;

  return (
    <LiveKitRoom
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      token={token}
      connect
      audio
      video={false}
      style={{ height: "100vh" }}
    >
      <RoomAudioRenderer />
      <GridLayout tracks={[]}>
        <ParticipantTile />
      </GridLayout>
      <ControlBar />
    </LiveKitRoom>
  );
}