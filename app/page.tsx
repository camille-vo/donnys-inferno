"use client";

import { Card, Button, Input } from 'pixel-retroui';
import { useRouter } from "next/navigation";
import { useState } from "react";

const coolGradient = 'linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.3) 10%, rgba(255, 255, 255, 0.3) 90%, rgba(255, 255, 255, 0) 100%)';
export default function Home() {
    const router = useRouter();
    const [room, setRoom] = useState("friends");
    const [name, setName] = useState("");
    return (
        <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            maxWidth: '60rem', margin: '0 auto', padding: '2rem', background: coolGradient, height: '100vh'
        }}>

            <Card className="p-4 text-center " bg="#ddceb4"
                textColor="#30210b"
                borderColor="#30210b"
                shadowColor="#30210b"
                style={{ margin: 'auto' }}>
                <h1 style={{ fontWeight: 700, fontSize: 30, paddingBottom: 8 }}>Welcome, friend</h1>
                <h2 style={{ padding: '4px' }}>Join the call to hang out and chat</h2>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />

                <Button
                    onClick={() => {
                        localStorage.setItem("lk_name", name);
                        router.push(`/call`);
                    }}
                    disabled={!name}
                >
                    Join call
                </Button>
            </Card>
        </div>

    )
}
