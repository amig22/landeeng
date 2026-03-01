import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic();

const SYSTEM_PROMPT = `Sei un esperto sviluppatore web e copywriter. Genera una landing page HTML professionale a partire dalla descrizione di un'attività aziendale.

Rispondi ESATTAMENTE in questo formato con i delimitatori indicati (non usare JSON):

COMPANY_NAME: [nome azienda]
TAGLINE: [slogan breve]

===BLOCK:hero===
[HTML sezione hero con headline, sottotitolo e CTA button]
===BLOCK:features===
[HTML sezione con 3-4 servizi/caratteristiche e icone SVG inline]
===BLOCK:about===
[HTML sezione "Chi siamo" con testo]
===BLOCK:cta===
[HTML sezione Call to Action con pulsante]
===BLOCK:footer===
[HTML footer con info aziendali]
===END===

Regole per l'HTML:
- Usa Tailwind CSS classes per lo styling
- Ogni blocco deve essere visivamente accattivante con colori adeguati al settore
- Usa gradienti, ombre e spaziatura generosa
- Includi icone SVG inline dove appropriato
- Colori coerenti tra tutti i blocchi
- Testo in italiano
- Non includere tag html, head, body, script
- Non racchiudere l'HTML in backtick o markdown`;

export async function POST(request: NextRequest) {
  try {
    const { description } = await request.json();

    if (!description || description.trim().length < 10) {
      return NextResponse.json(
        { error: "Descrizione troppo breve. Fornisci almeno 10 caratteri." },
        { status: 400 }
      );
    }

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 8192,
      messages: [
        {
          role: "user",
          content: `Genera una landing page professionale per questa attività aziendale:\n\n${description}`,
        },
      ],
      system: SYSTEM_PROMPT,
    });

    const content = message.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type from Claude");
    }

    const text = content.text;
    const BLOCK_NAMES: Record<string, string> = {
      hero: "Hero Section",
      features: "Features / Servizi",
      about: "Chi Siamo",
      cta: "Call to Action",
      footer: "Footer",
    };

    const companyMatch = text.match(/COMPANY_NAME:\s*(.+)/);
    const taglineMatch = text.match(/TAGLINE:\s*(.+)/);
    const blocks: { id: string; name: string; html: string }[] = [];
    const blockRegex = /===BLOCK:(\w+)===([\s\S]*?)(?====BLOCK:|===END===|$)/g;
    let match;
    while ((match = blockRegex.exec(text)) !== null) {
      const id = match[1].trim();
      const html = match[2].trim();
      if (html) blocks.push({ id, name: BLOCK_NAMES[id] ?? id, html });
    }

    if (!blocks.length) {
      return NextResponse.json(
        { error: "Formato risposta non riconosciuto. Riprova." },
        { status: 500 }
      );
    }

    const data = {
      companyName: companyMatch?.[1]?.trim() ?? "Azienda",
      tagline: taglineMatch?.[1]?.trim() ?? "",
      blocks,
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error generating landing page:", error);
    return NextResponse.json(
      { error: "Errore nella generazione. Riprova tra qualche secondo." },
      { status: 500 }
    );
  }
}
