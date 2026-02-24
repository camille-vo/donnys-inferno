"use client";

import { Card, ProgressBar, Bubble, Button } from "pixel-retroui";
import { useEffect, useState } from "react";
import type { FlowerState } from "@/lib/flower";

const waterDialogue = {
  normal: [
    "Thanks!",
    "Ahh, refreshing!",
    "Just what I needed!",
  ],
  overwatered: [
    "Too much water!",
    "I'm drowning here!",
    "Glub glub glub...",
  ],
};

function formatAlive(createdAt: string, now: number): string {
  const mins = Math.floor((now - new Date(createdAt).getTime()) / 60_000);
  if (mins < 1) return "Alive for <1 min";
  if (mins === 1) return "Alive for 1 min";
  if (mins < 60) return `Alive for ${mins} mins`;
  const hrs = Math.floor(mins / 60);
  const rem = mins % 60;
  if (hrs === 1) return rem ? `Alive for 1 hr ${rem} min` : "Alive for 1 hr";
  return rem ? `Alive for ${hrs} hrs ${rem} min` : `Alive for ${hrs} hrs`;
}

function getWaterDialogue(overwatered: boolean): string {
  const lines = overwatered ? waterDialogue.overwatered : waterDialogue.normal;
  return lines[Math.floor(Math.random() * lines.length)];
}

export default function Flower() {
  const [flower, setFlower] = useState<FlowerState | null>(null);
  const [hovered, setHovered] = useState(false);
  const [waterLine, setWaterLine] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    const es = new EventSource("/api/flower/stream");
    es.onmessage = (event) => {
      const state: FlowerState = JSON.parse(event.data);
      setFlower(state);
    };
    return () => es.close();
  }, []);

  const handleReset = () => {
    fetch("/api/flower", { method: "DELETE" });
  };

  const handleWater = () => {
    fetch("/api/flower", { method: "POST" })
      .then((res) => res.json())
      .then((data) => {
        const overwatered = data.flower.waterCount > 3;
        setWaterLine(getWaterDialogue(overwatered));
        setTimeout(() => setWaterLine(null), 2000);
      });
  };

  if (!flower) return null;

  return (
    <div
      style={{ position: "relative", paddingLeft: 72 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hovered && (
        <div style={{ position: "absolute", left: 0, top: -8, zIndex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
          {flower.health === 0 ? (
            <Button onClick={handleReset} bg="#ddceb4" borderColor="#30210b" shadow="#30210b" textColor="#30210b" style={{ lineHeight: 1, padding: 0 }}>
              <img src="/flower/retry.png" alt="Retry" style={{ width: 36, height: 36, objectFit: "contain", display: "block" }} />
            </Button>
          ) : (
            <Button onClick={handleWater} bg="#ddceb4" borderColor="#30210b" shadow="#30210b" textColor="#30210b" style={{ lineHeight: 1, padding: 0 }}>
              <img src="/flower/watering-can.png" alt="Water" style={{ width: 36, height: 36, objectFit: "contain", display: "block" }} />
            </Button>
          )}
        </div>
      )}
      <div style={{ position: "relative" }}>
        {(hovered || waterLine) && (
          <div style={{ position: "absolute", top: -12, left: "100%", marginLeft: 4, whiteSpace: "nowrap" }}>
            <Bubble direction="left" bg="#ddceb4" borderColor="#30210b" textColor="#30210b">
              {waterLine ?? flower.line}
            </Bubble>
          </div>
        )}
        <Card
          bg="#ddceb4"
          textColor="#30210b"
          borderColor="#30210b"
          shadowColor="#30210b"
          className="p-4"
          style={{ width: 200 }}
        >
          <div style={{ textAlign: "center" }}>
            <img src={flower.health === 0 ? "/flower/dead-flower.png" : flower.health > 75 ? "/flower/happy-flower.png" : flower.health >= 25 ? "/flower/mid-flower.png" : "/flower/sad-flower.png"} alt={flower.name} style={{ width: 80, height: 80, objectFit: "contain", margin: "0 auto" }} />
          </div>
          <h3
            style={{
              fontWeight: 700,
              fontSize: 18,
              textAlign: "center",
              margin: "8px 0 4px",
            }}
          >
            {flower.name}
          </h3>
          <p style={{ fontSize: 11, textAlign: "center", margin: "0 0 8px", opacity: 0.7 }}>
            {flower.health === 0 ? "ded" : formatAlive(flower.createdAt, now)}
          </p>
          <ProgressBar
            progress={flower.health}
            color="#6b8f3c"
            borderColor="#30210b"
            size="sm"
          />
        </Card>
      </div>
    </div>
  );
}
