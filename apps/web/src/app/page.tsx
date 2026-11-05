import { lagS3Klient, lesBlobKonfig } from "@/lib/blob";
import { hentBilder, MAKS_BYTES, type BildeDto } from "@/lib/bilder";
import { hentSide, type NavnSide } from "@/lib/navn";
import { LastOppBilde } from "./bilder/LastOppBilde";
import { Bildegalleri } from "./bilder/Bildegalleri";
import { Navneliste } from "./navn/Navneliste";
import { RegistrerNavn } from "./RegistrerNavn";

// Alltid hent ferske navn og bilder, ikke cache siden statisk.
export const dynamic = "force-dynamic";

const kort = "bg-white rounded-xl shadow-sm p-8 border border-mikke-black/10";

export default async function Home() {
  const konfig = lesBlobKonfig();

  // Database og blob storage hentes hver for seg, og en feil i den ene skal
  // verken ta ned siden eller den andre delen. Feilen vises i stedet.
  const [navnResultat, bildeResultat] = await Promise.allSettled([
    hentSide(1),
    konfig ? hentBilder(lagS3Klient(konfig), konfig.bøtte) : Promise.resolve([]),
  ]);

  let side: NavnSide | null = null;
  if (navnResultat.status === "fulfilled") {
    side = navnResultat.value;
  } else {
    console.error("Klarte ikke å hente navn", navnResultat.reason);
  }

  let bilder: BildeDto[] | null = null;
  if (bildeResultat.status === "fulfilled") {
    bilder = bildeResultat.value;
  } else {
    console.error("Klarte ikke å hente bilder", bildeResultat.reason);
  }

  return (
    <div className="flex flex-col gap-6">
      <section className={kort}>
        <h2 className="text-2xl font-semibold mb-2">Velkommen! 🎩</h2>
        <p className="text-mikke-black/70 mb-6">
          Skriv inn navnet ditt under, så dukker det opp på listen over alle
          som har vært innom.
        </p>
        <RegistrerNavn />
      </section>

      <section className={kort}>
        <h2 className="text-2xl font-semibold mb-2">Hvem har vært innom</h2>
        {!side ? (
          <Feil>Klarte ikke å hente navnene fra databasen.</Feil>
        ) : side.totalt === 0 ? (
          <p className="text-mikke-black/50">Ingen har registrert seg ennå.</p>
        ) : (
          <>
            <p className="text-mikke-black/70 mb-4">
              {`${side.totalt.toLocaleString("no-NO")} ${side.totalt === 1 ? "person har" : "personer har"} registrert seg. Nyeste først:`}
            </p>
            <Navneliste navn={side.navn} />
            <a href="/navn" className="inline-block mt-6 text-mikke-red font-medium hover:underline">
              {side.antallSider > 1 ? "Se alle navn og grafen →" : "Se grafen →"}
            </a>
          </>
        )}
      </section>

      <section className={kort}>
        <h2 className="text-2xl font-semibold mb-2">Bilder 📷</h2>
        {!konfig ? (
          <p className="text-mikke-black/70">
            Bildeopplasting er ikke satt opp i dette miljøet. Den trenger blob
            storage fra plattformen.
          </p>
        ) : (
          <>
            <p className="text-mikke-black/70 mb-6">
              Last opp et bilde, så havner det i bøtta og dukker opp under.
            </p>
            <LastOppBilde maksMB={MAKS_BYTES / 1024 / 1024} />
            {bilder ? (
              <Bildegalleri bilder={bilder} />
            ) : (
              <div className="mt-6">
                <Feil>Klarte ikke å hente bildene fra blob storage.</Feil>
              </div>
            )}
          </>
        )}
      </section>

      <a href="/status" className="text-mikke-red font-medium hover:underline">
        Plattformstatus →
      </a>
    </div>
  );
}

function Feil({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-mikke-red" role="alert">
      {children} Se{" "}
      <a href="/status" className="underline">
        plattformstatus
      </a>{" "}
      for detaljer.
    </p>
  );
}
