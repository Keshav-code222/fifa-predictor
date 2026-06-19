import Groq from "groq-sdk";
import { results2026, keyInsights } from "@/data/results2026";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request) {
  const { home, away, venue, date, matchday } = await request.json();

  const resultsText = results2026
    .filter(r => r.score !== "pending")
    .map(r => `${r.home} ${r.score} ${r.away} — ${r.note}`)
    .join("\n");

  const insightsText = keyInsights.join("\n");

  const chat = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: `You are a world class football analyst with access to real 2026 FIFA World Cup results.

REAL RESULTS SO FAR IN THE 2026 WORLD CUP:
${resultsText}

KEY INSIGHTS FROM THIS TOURNAMENT SO FAR:
${insightsText}

Use this real data to inform your prediction. Upsets are happening. Small teams are competing. Do not just pick the obvious favorite.

Now predict this match:
${home} vs ${away}
${matchday} | ${date} | ${venue}

Respond in exactly this format and nothing else:

HOME_SCORE: [number]
AWAY_SCORE: [number]
WINNER: [home team name or away team name or Draw]
HOME_WIN: [percentage chance home team wins, just the number]
AWAY_WIN: [percentage chance away team wins, just the number]
DRAW: [percentage chance of draw, just the number]

Make sure HOME_WIN + AWAY_WIN + DRAW = 100`,
      },
    ],
  });

  const raw = chat.choices[0].message.content;

  const get = (key) => {
    const match = raw.match(new RegExp(`${key}:\\s*(.+)`));
    return match ? match[1].trim() : null;
  };

  return Response.json({
    homeScore: get("HOME_SCORE"),
    awayScore: get("AWAY_SCORE"),
    winner: get("WINNER"),
    homeWin: get("HOME_WIN"),
    awayWin: get("AWAY_WIN"),
    draw: get("DRAW"),
  });
}