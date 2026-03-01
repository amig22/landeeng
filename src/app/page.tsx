"use client";

import { useState } from "react";
import { LandingPageData } from "@/types/landing";
import LandingPreview from "@/components/LandingPreview";

const EXAMPLES = [
  "Studio legale specializzato in diritto del lavoro e diritto societario, fondato nel 2005 a Milano. Offriamo consulenza legale personalizzata a privati e aziende con un team di 8 avvocati esperti.",
  "Ristorante di cucina mediterranea con oltre 20 anni di tradizione familiare a Napoli. Utilizziamo solo ingredienti freschi e di stagione. Disponiamo di sala eventi per cerimonie e banchetti fino a 200 persone.",
  "Startup fintech che sviluppa soluzioni di pagamento digitale per le PMI italiane. La nostra piattaforma integra POS fisici e digitali, gestione fatture elettroniche e analytics in tempo reale.",
];

export default function Home() {
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [landingData, setLandingData] = useState<LandingPageData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!description.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setLandingData(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Errore nella generazione. Riprova.");
        return;
      }

      setLandingData(data);
    } catch {
      setError("Errore di rete. Controlla la connessione e riprova.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    if (!landingData) return;

    const fullHtml = `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${landingData.companyName} — ${landingData.tagline}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
${landingData.blocks.map((b) => b.html).join("\n")}
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${landingData.companyName.toLowerCase().replace(/\s+/g, "-")}-landing.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setLandingData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-white font-bold text-lg">LandeEng</span>
            <span className="text-blue-400 text-sm hidden sm:block">
              — Genera landing page con AI
            </span>
          </div>
          {landingData && (
            <button
              onClick={handleReset}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              ← Nuova landing page
            </button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {!landingData ? (
          /* Input form */
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold text-white mb-4">
                Crea la tua{" "}
                <span className="text-blue-400">landing page</span>{" "}
                in secondi
              </h1>
              <p className="text-gray-300 text-lg">
                Descrivi la tua attività e l&apos;AI genererà una landing page
                professionale con blocchi HTML modificabili.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Descrivi la tua attività aziendale
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Es: Studio di architettura fondato nel 2010 a Roma, specializzato in progettazione sostenibile e ristrutturazioni di immobili storici. Il nostro team di 5 architetti ha completato oltre 200 progetti residenziali e commerciali..."
                className="w-full bg-white/10 text-white placeholder-gray-500 border border-white/20 rounded-xl p-4 text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-40"
              />
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-gray-500">
                  {description.length} caratteri
                </span>
                <span className="text-xs text-gray-500">
                  Minimo 10 caratteri
                </span>
              </div>

              {error && (
                <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={description.trim().length < 10 || isLoading}
                className="mt-4 w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Generazione in corso...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Genera Landing Page
                  </>
                )}
              </button>
            </div>

            {/* Examples */}
            <div className="mt-8">
              <p className="text-sm text-gray-400 mb-3 text-center">
                Oppure prova con un esempio:
              </p>
              <div className="flex flex-col gap-2">
                {EXAMPLES.map((example, i) => (
                  <button
                    key={i}
                    onClick={() => setDescription(example)}
                    className="text-left text-sm text-gray-400 hover:text-gray-200 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-4 py-3 transition-all line-clamp-2"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>

            {/* How it works */}
            <div className="mt-12 grid grid-cols-3 gap-4">
              {[
                { icon: "✍️", title: "1. Descrivi", text: "Racconta la tua attività in forma libera" },
                { icon: "⚡", title: "2. Genera", text: "L'AI crea blocchi HTML professionali" },
                { icon: "⬇️", title: "3. Esporta", text: "Scarica l'HTML pronto all'uso" },
              ].map((step) => (
                <div key={step.title} className="text-center p-4">
                  <div className="text-2xl mb-2">{step.icon}</div>
                  <div className="text-white font-semibold text-sm mb-1">{step.title}</div>
                  <div className="text-gray-400 text-xs">{step.text}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Landing page preview */
          <div>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">
                  Landing page generata ✓
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  Passa il mouse su un blocco per modificarne l&apos;HTML. Poi esporta il risultato.
                </p>
              </div>
            </div>
            <LandingPreview data={landingData} onExport={handleExport} />
          </div>
        )}
      </main>
    </div>
  );
}
