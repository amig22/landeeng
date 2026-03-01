# LandeEng

Genera landing page HTML professionali a partire dalla descrizione testuale della tua attività aziendale, powered by **Claude AI** (Anthropic).

## Funzionalità

- Inserisci una descrizione in linguaggio naturale della tua attività
- L'AI genera automaticamente 5 blocchi HTML:
  - **Hero** — headline, sottotitolo e CTA
  - **Features** — servizi/caratteristiche principali con icone
  - **Chi Siamo** — descrizione aziendale
  - **Call to Action** — sezione di conversione
  - **Footer** — informazioni aziendali
- Modifica l'HTML di ogni blocco direttamente nell'interfaccia
- Esporta il file HTML completo con Tailwind CSS incluso

## Setup

```bash
# Installa le dipendenze
npm install

# Copia il file di configurazione
cp .env.example .env.local

# Aggiungi la tua chiave API Anthropic in .env.local
ANTHROPIC_API_KEY=sk-ant-...

# Avvia il server di sviluppo
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000) nel browser.

## Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Anthropic Claude** (`claude-sonnet-4-6`)
