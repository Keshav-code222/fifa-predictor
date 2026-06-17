import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request) {
  const { home, away, venue, date, matchday } = await request.json();

  const chat = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: `You are a world class football analyst. Predict this FIFA World Cup 2026 match:

${home} vs ${away}
${matchday} | ${date} | ${venue}

Give your response in exactly this format:

PREDICTED SCORE: [home goals] - [away goals]
WINNER: [team name or Draw]

ANALYSIS:
[3-4 sentences analyzing why you predicted this result. Talk about team strength, recent form, and key factors.]

CONFIDENCE: [Low / Medium / High]`,
      },
    ],
  });

  const result = chat.choices[0].message.content;
  return Response.json({ result });
}