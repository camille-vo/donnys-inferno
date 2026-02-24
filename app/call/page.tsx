"use client";

import "@livekit/components-styles";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  ControlBar,
  GridLayout,
  ParticipantTile,
  VideoConference,
  useRoomContext,
} from "@livekit/components-react";
import { RoomEvent } from "livekit-client";
import { useCallback, useEffect, useState } from "react";
import { generate } from 'yet-another-name-generator'
import confetti from "canvas-confetti";

function JoinEffect() {
  const room = useRoomContext();

  const fireJoinAnimation = useCallback(() => {
    // Play join sound
    const audio = new Audio("/sounds/join.mp3");
    audio.play().catch(() => {});

    // Fire confetti
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
    });
  }, []);

  useEffect(() => {
    room.on(RoomEvent.ParticipantConnected, fireJoinAnimation);
    return () => {
      room.off(RoomEvent.ParticipantConnected, fireJoinAnimation);
    };
  }, [room, fireJoinAnimation]);

  return null;
}

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
    <LiveKitRoom
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      token={token}
      connect
      audio
      video
      style={{ height: "90vh" }}
    >
      <JoinEffect />
      {/* <RoomAudioRenderer />
      <GridLayout tracks={[]}>
        <ParticipantTile />
      </GridLayout>
      <ControlBar /> */}
      <VideoConference />
    </LiveKitRoom>
  );
}