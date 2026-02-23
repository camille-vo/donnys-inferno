"use client";

import { Card } from 'pixel-retroui';
import { useRouter } from "next/navigation";
import { useState } from "react";

const coolGradient = 'linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.3) 10%, rgba(255, 255, 255, 0.3) 90%, rgba(255, 255, 255, 0) 100%)';
export default function Home() {
    const router = useRouter();
    const [room, setRoom] = useState("friends");
    const [name, setName] = useState("");
    return (
        <div style={{ maxWidth: '60rem', width: '100%', margin: '0 auto', padding: '2rem', background: coolGradient, height: '100vh' }}>

            <Card className="p-4 text-center w-full" bg="#ddceb4"
                textColor="#30210b"
                borderColor="#30210b"
                shadowColor="#30210b">
                <h2>Welcome, friend</h2>
            </Card>
            <div style={{ display: "grid", gap: 12, maxWidth: 420 }}>
                <input value={room} onChange={(e) => setRoom(e.target.value)} placeholder="Room name" />
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />

                <button
                    onClick={() => {
                        localStorage.setItem("lk_name", name);
                        router.push(`/room/${encodeURIComponent(room)}`);
                    }}
                    disabled={!room || !name}
                >
                    Join call
                </button>
            </div>
        </div>

    )
}
