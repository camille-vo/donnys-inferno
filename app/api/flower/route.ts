import { NextResponse } from "next/server";
import { getFlower, waterFlower, resetFlower } from "@/lib/flower";

export async function GET() {
  return NextResponse.json({ flower: getFlower() });
}

export async function POST() {
  const flower = waterFlower();
  return NextResponse.json({ flower });
}

export async function DELETE() {
  const flower = resetFlower();
  return NextResponse.json({ flower });
}
