import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic();

const SYSTEM_PROMPT = `Sei un esperto sviluppatore web e copywriter. Il tuo compito è generare una landing page HTML professionale e moderna a partire da un testo descrittivo di un'attività aziendale.

Genera una landing page completa con i seguenti blocchi HTML separati:
1. **hero** - Sezione hero con headline, sottotitolo e CTA button
2. **features** - Sezione con 3-4 caratteristiche/servizi principali con icone SVG inline
3. **about** - Sezione "Chi siamo" con testo descrittivo
4. **cta** - Sezione Call to Action con pulsante
5. **footer** - Footer con info aziendali

Rispondi ESCLUSIVAMENTE con un oggetto JSON valido nel seguente formato:
{
  "companyName": "Nome azienda",
  "tagline": "Slogan breve",
  "blocks": [
    {
      "id": "hero",
      "name": "Hero Section",
      "html": "<section>...</section>"
    },
    {
      "id": "features",
      "name": "Features / Servizi",
      "html": "<section>...</section>"
    },
    {
      "id": "about",
      "name": "Chi Siamo",
      "html": "<section>...</section>"
    },
    {
      "id": "cta",
      "name": "Call to Action",
      "html": "<section>...</section>"
    },
    {
      "id": "footer",
      "name": "Footer",
      "html": "<footer>...</footer>"
    }
  ]
}

Regole per l'HTML:
- Usa Tailwind CSS classes per lo styling (la pagina usa Tailwind)
- Rendi ogni blocco visivamente accattivante con colori adeguati al settore
- Usa gradienti, ombre e spaziatura generosa
- Includi icone SVG inline dove appropriato
- I colori devono essere coerenti tra i blocchi
- Tutto il testo deve essere in italiano
- Non includere tag <html>, <head>, <body> - solo il contenuto del blocco
- Non aggiungere script tag`;

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

    // Extract JSON from response (handle markdown code blocks)
    let jsonText = content.text.trim();
    if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    const data = JSON.parse(jsonText);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error generating landing page:", error);
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Errore nel parsing della risposta. Riprova." },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Errore nella generazione. Riprova tra qualche secondo." },
      { status: 500 }
    );
  }
}
