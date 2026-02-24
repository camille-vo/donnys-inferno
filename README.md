This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Prerequisites

- [Docker](https://www.docker.com/) (for LiveKit server, Egress, and Redis)
- [Bun](https://bun.sh/) (or Node.js)

## Getting Started

### 1. Start the backend services

```bash
docker compose up
```

This starts three containers:

- **Redis** — message bus between LiveKit and Egress
- **LiveKit server** — WebRTC signaling and room management
- **Egress** — audio/video recording service

### 2. Set up environment variables

Create a `.env.local` file:

```
NEXT_PUBLIC_LIVEKIT_URL=ws://localhost:7880
LIVEKIT_URL=http://localhost:7880
LIVEKIT_API_KEY=devkey
LIVEKIT_API_SECRET=secret
```

### 3. Start the Next.js dev server

```bash
bun install
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Audio Recording

Audio recording is automatic. When a participant joins a call, LiveKit fires a webhook to the Next.js app, which starts an audio-only recording via the Egress service. When the room empties (after ~30s timeout), the recording stops and saves to the `./recordings/` directory as an `.ogg` file.

### Verifying recordings locally

1. `docker compose up` — confirm all 3 containers start
2. `bun dev` — start Next.js on :3000
3. Join a call, talk for a few seconds, then leave
4. Wait ~30s for the room to close
5. Check `./recordings/` for an `.ogg` file

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [LiveKit Documentation](https://docs.livekit.io/) - learn about LiveKit.
