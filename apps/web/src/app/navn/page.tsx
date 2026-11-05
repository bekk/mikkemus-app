import { ENHETSNAVN, hentSide, hentTidsserie, lesSidetall, PER_SIDE } from "@/lib/navn";
import { Navneliste } from "./Navneliste";
import { Tidsgraf } from "./Tidsgraf";

// Alltid hent ferske data fra databasen, ikke cache siden statisk.
export const dynamic = "force-dynamic";

export default async function NavnPage({
  searchParams,
}: {
  searchParams: Promise<{ side?: string | string[] }>;
}) {
  const ønsketSide = lesSidetall((await searchParams).side);
  // Databasefeil skal ikke ta ned siden, men vises som en melding.
  const [sideResultat, tidsserieResultat] = await Promise.allSettled([
    hentSide(ønsketSide),
    hentTidsserie(),
  ]);
  if (tidsserieResultat.status === "rejected") {
    console.error("Klarte ikke å hente tidsserie", tidsserieResultat.reason);
  }
  if (sideResultat.status === "rejected") {
    console.error("Klarte ikke å hente navn", sideResultat.reason);
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm p-8 border border-mikke-black/10">
        <h2 className="text-2xl font-semibold mb-2">Alle som har vært innom</h2>
        <p className="text-mikke-red" role="alert">
          Klarte ikke å hente navnene fra databasen. Se{" "}
          <a href="/status" className="underline">
            plattformstatus
          </a>{" "}
          for detaljer.
        </p>
        <a href="/" className="inline-block mt-6 text-mikke-red font-medium hover:underline">
          ← Til forsiden
        </a>
      </div>
    );
  }
  const { navn: alleNavn, side, antallSider, totalt } = sideResultat.value;
  const tidsserie = tidsserieResultat.status === "fulfilled" ? tidsserieResultat.value : null;
  const fra = (side - 1) * PER_SIDE + 1;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm p-8 border border-mikke-black/10">
      <h2 className="text-2xl font-semibold mb-2">Alle som har vært innom</h2>
      <p className="text-mikke-black/70 mb-6">
        {totalt === 0
          ? "Ingen har registrert seg ennå."
          : `${totalt.toLocaleString("no-NO")} ${totalt === 1 ? "person har" : "personer har"} registrert seg.`}
      </p>

      {tidsserie && (
        <Tidsgraf punkter={tidsserie.punkter} enhetsnavn={ENHETSNAVN[tidsserie.enhet]} />
      )}

      {totalt > 0 && (
        <p className="text-sm text-mikke-black/50 mb-2">
          Viser {fra.toLocaleString("no-NO")}–{(fra + alleNavn.length - 1).toLocaleString("no-NO")}, nyeste først
        </p>
      )}

      <Navneliste navn={alleNavn} />

      {antallSider > 1 && <Sidevelger side={side} antallSider={antallSider} />}

      <a
        href="/"
        className="inline-block mt-6 text-mikke-red font-medium hover:underline"
      >
        ← Til forsiden
      </a>
    </div>
  );
}

function Sidevelger({ side, antallSider }: { side: number; antallSider: number }) {
  const lenker: [tekst: string, mål: number, aktiv: boolean][] = [
    ["« Første", 1, side > 1],
    ["‹ Forrige", side - 1, side > 1],
    ["Neste ›", side + 1, side < antallSider],
    ["Siste »", antallSider, side < antallSider],
  ];
  const [første, forrige, neste, siste] = lenker.map(([tekst, mål, aktiv]) =>
    aktiv ? (
      <a key={tekst} href={`/navn?side=${mål}`} className="text-mikke-red font-medium hover:underline">
        {tekst}
      </a>
    ) : (
      <span key={tekst} className="text-mikke-black/30" aria-disabled="true">
        {tekst}
      </span>
    ),
  );

  return (
    <nav aria-label="Sider" className="flex items-center justify-between gap-2 mt-6 text-sm">
      <span className="flex gap-4">
        {første}
        {forrige}
      </span>
      <span className="text-mikke-black/70" aria-current="page">
        Side {side.toLocaleString("no-NO")} av {antallSider.toLocaleString("no-NO")}
      </span>
      <span className="flex gap-4">
        {neste}
        {siste}
      </span>
    </nav>
  );
}
