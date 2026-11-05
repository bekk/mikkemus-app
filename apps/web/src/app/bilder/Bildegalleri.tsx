import type { BildeDto } from "@/lib/bilder";

export function Bildegalleri({ bilder }: { bilder: BildeDto[] }) {
  if (bilder.length === 0) {
    return <p className="text-mikke-black/50 mt-6">Ingen bilder ennå. Bli den første!</p>;
  }
  return (
    <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
      {bilder.map((bilde) => (
        <li key={bilde.navn}>
          <a href={`/api/bilder/${bilde.navn}`}>
            <img
              src={`/api/bilder/${bilde.navn}`}
              alt={`Bilde lastet opp ${new Date(bilde.lastetOpp).toLocaleString("no-NO")}`}
              loading="lazy"
              className="aspect-square w-full object-cover rounded-lg border border-mikke-black/10"
            />
          </a>
        </li>
      ))}
    </ul>
  );
}
