import { TIDSSONE, type SammenslåttNavn } from "@/lib/navn";
import { SlettNavn } from "./SlettNavn";

// Like navn er slått sammen til én rad, med siste registrering som tidspunkt.
export function Navneliste({ navn }: { navn: SammenslåttNavn[] }) {
  return (
    <ul className="flex flex-col gap-2">
      {navn.map((n) => (
        <li
          key={n.navn}
          className="flex items-center justify-between gap-4 border-b border-mikke-black/10 py-2"
        >
          <span className="min-w-0">
            <span className="font-medium break-all">{n.navn}</span>
            {n.antall > 1 && (
              <span
                className="ml-2 text-xs font-medium rounded-full px-2 py-0.5 bg-mikke-black/10 text-mikke-black/70 whitespace-nowrap"
                title={`Registrert ${n.antall} ganger`}
              >
                ×{n.antall}
              </span>
            )}
          </span>
          <span className="flex items-center gap-4 shrink-0">
            <span className="text-sm text-mikke-black/50">
              {new Date(n.sist).toLocaleString("no-NO", { timeZone: TIDSSONE })}
            </span>
            <SlettNavn navn={n.navn} antall={n.antall} />
          </span>
        </li>
      ))}
    </ul>
  );
}
