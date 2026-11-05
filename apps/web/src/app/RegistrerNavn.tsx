"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function RegistrerNavn() {
  const router = useRouter();
  const [navn, setNavn] = useState("");
  const [status, setStatus] = useState<"idle" | "sender" | "feil">("idle");
  const [feilmelding, setFeilmelding] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("sender");
    setFeilmelding(null);

    const res = await fetch("/api/navn", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ navn }),
    }).catch(() => null);

    if (!res?.ok) {
      const data = await res?.json().catch(() => ({}));
      setFeilmelding(data?.error ?? "Noe gikk galt, prøv igjen.");
      setStatus("feil");
      return;
    }

    setNavn("");
    setStatus("idle");
    // Hent lista med navn på nytt fra serveren.
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label htmlFor="navn" className="font-medium">
        Navnet ditt
      </label>
      <input
        id="navn"
        name="navn"
        type="text"
        required
        maxLength={100}
        value={navn}
        onChange={(e) => setNavn(e.target.value)}
        placeholder="F.eks. Mikke Mus"
        className="border border-mikke-black/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-mikke-red"
      />

      {feilmelding && (
        <p className="text-mikke-red text-sm" role="alert">
          {feilmelding}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sender"}
        className="bg-mikke-red hover:bg-mikke-red/90 disabled:opacity-60 text-white font-semibold rounded-lg px-4 py-2 transition-colors"
      >
        {status === "sender" ? "Sender..." : "Registrer meg"}
      </button>
    </form>
  );
}
