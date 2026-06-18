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