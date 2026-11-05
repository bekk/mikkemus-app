import { lagS3Klient, lesBlobKonfig } from "@/lib/blob";
import { hentBilder, MAKS_BYTES, type BildeDto } from "@/lib/bilder";
import { Bildegalleri } from "./Bildegalleri";
import { LastOppBilde } from "./LastOppBilde";

// Alltid hent ferske bilder fra bøtta, ikke cache siden statisk.
export const dynamic = "force-dynamic";

export default async function BilderPage() {
  const konfig = lesBlobKonfig();

  let bilder: BildeDto[] = [];
  let feil: string | null = null;
  if (konfig) {
    try {
      bilder = await hentBilder(lagS3Klient(konfig), konfig.bøtte);
    } catch (err) {
      console.error("Klarte ikke å hente bilder", err);
      feil = "Klarte ikke å hente bildene fra blob storage.";
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-8 border border-mikke-black/10">
      <h2 className="text-2xl font-semibold mb-2">Bilder 📷</h2>

      {!konfig ? (
        <p className="text-mikke-black/70">
          Bildeopplasting er ikke satt opp i dette miljøet. Den trenger blob
          storage fra plattformen, se{" "}
          <a href="/status" className="text-mikke-red hover:underline">
            plattformstatus
          </a>
          .
        </p>
      ) : (
        <>
          <p className="text-mikke-black/70 mb-6">
            Last opp et bilde, så havner det i bøtta og dukker opp under.
          </p>

          <LastOppBilde maksMB={MAKS_BYTES / 1024 / 1024} />

          {feil ? (
            <p className="text-mikke-red mt-6" role="alert">
              {feil} Se{" "}
              <a href="/status" className="hover:underline">
                plattformstatus
              </a>{" "}
              for detaljer.
            </p>
          ) : (
            <Bildegalleri bilder={bilder} />
          )}
        </>
      )}

      <a
        href="/"
        className="inline-block mt-6 text-mikke-red font-medium hover:underline"
      >
        ← Til forsiden
      </a>
    </div>
  );
}
