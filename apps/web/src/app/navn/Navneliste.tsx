import type { Navn } from "@mikkemus/database";
import { TIDSSONE } from "@/lib/navn";
import { SlettNavn } from "./SlettNavn";

export function Navneliste({ navn }: { navn: Navn[] }) {
  return (
    <ul className="flex flex-col gap-2">
      {navn.map((n) => (
        <li
          key={n.id}
          className="flex items-center justify-between gap-4 border-b border-mikke-black/10 py-2"
        >
          <span className="font-medium break-all">{n.navn}</span>
          <span className="flex items-center gap-4 shrink-0">
            <span className="text-sm text-mikke-black/50">
              {new Date(n.opprettet).toLocaleString("no-NO", { timeZone: TIDSSONE })}
            </span>
            <SlettNavn id={n.id} navn={n.navn} />
          </span>
        </li>
      ))}
    </ul>
  );
}
