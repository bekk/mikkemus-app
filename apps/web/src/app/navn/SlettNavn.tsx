"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Like navn vises som én rad, så slett fjerner alle registreringene av navnet.
export function SlettNavn({ navn, antall }: { navn: string; antall: number }) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "sletter" | "feil">("idle");

  async function slett() {
    const spørsmål =
      antall > 1 ? `Slette alle ${antall} registreringene av «${navn}»?` : `Slette «${navn}»?`;
    if (!confirm(spørsmål)) return;
    setStatus("sletter");

    const res = await fetch(`/api/navn?navn=${encodeURIComponent(navn)}`, {
      method: "DELETE",
    }).catch(() => null);

    // 404 betyr at noen andre allerede har slettet det, så lista må uansett oppdateres.
    if (!res?.ok && res?.status !== 404) {
      setStatus("feil");
      return;
    }

    // Hent lista, antallet og grafen på nytt fra serveren.
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={slett}
      disabled={status === "sletter"}
      aria-label={`Slett ${navn}`}
      className="text-sm text-mikke-red hover:underline disabled:opacity-60"
    >
      {status === "sletter" ? "Sletter..." : status === "feil" ? "Feilet, prøv igjen" : "Slett"}
    </button>
  );
}
