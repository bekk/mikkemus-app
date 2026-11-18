import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@mikkemus/database";
import { hentSide, lesSidetall, PER_SIDE } from "@/lib/navn";

// Én side om gangen, f.eks. /api/navn?side=2. Å returnere alle radene på én
// gang får serveren til å gå tom for minne når tabellen er stor.
export async function GET(request: NextRequest) {
  try {
    const side = await hentSide(lesSidetall(request.nextUrl.searchParams.get("side")));
    return NextResponse.json({ ...side, perSide: PER_SIDE });
  } catch (err) {
    console.error("Klarte ikke å hente navn", err);
    return databasefeil();
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const navn = typeof body?.navn === "string" ? body.navn.trim() : "";

  if (!navn) {
    return NextResponse.json(
      { error: "Navn kan ikke være tomt" },
      { status: 400 },
    );
  }

  if (navn.length > 100) {
    return NextResponse.json(
      { error: "Navnet er for langt (maks 100 tegn)" },
      { status: 400 },
    );
  }

  try {
    const opprettet = await prisma.navn.create({ data: { navn } });
    return NextResponse.json(opprettet, { status: 201 });
  } catch (err) {
    console.error("Klarte ikke å lagre navn", err);
    return databasefeil();
  }
}

// Sletter alle registreringene av et navn, f.eks. DELETE /api/navn?navn=Mikke.
// Lista viser like navn som én rad, så det er det slett-knappen der bruker.
export async function DELETE(request: NextRequest) {
  const navn = request.nextUrl.searchParams.get("navn");
  if (!navn) {
    return NextResponse.json({ error: "Mangler ?navn=" }, { status: 400 });
  }

  let count: number;
  try {
    ({ count } = await prisma.navn.deleteMany({ where: { navn } }));
  } catch (err) {
    console.error("Klarte ikke å slette navn", err);
    return databasefeil();
  }
  if (count === 0) {
    return NextResponse.json({ error: "Fant ikke navnet" }, { status: 404 });
  }
  return new NextResponse(null, { status: 204 });
}

function databasefeil() {
  return NextResponse.json(
    { error: "Databasen svarer ikke akkurat nå. Se /status for detaljer." },
    { status: 503 },
  );
}
