import Groq from "groq-sdk";
import { results2026, keyInsights } from "@/data/results2026";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request) {
  const { home, away, venue, date, matchday, isKnockout } = await request.json();

  const resultsText = results2026
    .filter(r => r.score !== "pending")
    .map(r => `${r.home} ${r.score} ${r.away} — ${r.note}`)
    .join("\n");

  const insightsText = keyInsights.join("\n");

  const prompt = isKnockout ? `You are a world class football analyst with access to real 2026 FIFA World Cup results.

REAL RESULTS SO FAR IN THE 2026 WORLD CUP:
${resultsText}

KEY INSIGHTS FROM THIS TOURNAMENT SO FAR:
${insightsText}

IMPORTANT: This is a KNOCKOUT match. There are NO draws. Someone must go through. You must predict the full journey — 90 minutes, then extra time if needed, then penalties if still level.

Now predict this match:
${home} vs ${away}
Knockout Stage | ${date} | ${venue}

Respond in exactly this format and nothing else:

HOME_SCORE_90: [home goals after 90 minutes]
AWAY_SCORE_90: [away goals after 90 minutes]
GOES_TO_ET: [Yes or No]
HOME_SCORE_ET: [home goals in extra time, 0 if no extra time]
AWAY_SCORE_ET: [away goals in extra time, 0 if no extra time]
GOES_TO_PENALTIES: [Yes or No]
PENALTY_WINNER: [team name who wins on penalties, or N/A if decided before penalties]
WINNER: [team name who goes through — never a draw]
HOME_WIN: [percentage chance home team goes through, just the number]
AWAY_WIN: [percentage chance away team goes through, just the number]
DRAW: 0

Make sure HOME_WIN + AWAY_WIN = 100` 

  : `You are a world class football analyst with access to real 2026 FIFA World Cup results.

REAL RESULTS SO FAR IN THE 2026 WORLD CUP:
${resultsText}

KEY INSIGHTS FROM THIS TOURNAMENT SO FAR:
${insightsText}

Now predict this match:
${home} vs ${away}
${matchday || "Group Stage"} | ${date} | ${venue}

Respond in exactly this format and nothing else:

HOME_SCORE: [number]
AWAY_SCORE: [number]
WINNER: [home team name or away team name or Draw]
HOME_WIN: [percentage chance home team wins, just the number]
AWAY_WIN: [percentage chance away team wins, just the number]
DRAW: [percentage chance of draw, just the number]

Make sure HOME_WIN + AWAY_WIN + DRAW = 100`;

  const chat = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
  });

  const raw = chat.choices[0].message.content;

  const get = (key) => {
    const match = raw.match(new RegExp(`${key}:\\s*(.+)`));
    return match ? match[1].trim() : null;
  };

  if (isKnockout) {
    const goesToET = get("GOES_TO_ET") === "Yes";
    const goesToPenalties = get("GOES_TO_PENALTIES") === "Yes";

    let method = "90 minutes";
    if (goesToPenalties) method = "Penalties";
    else if (goesToET) method = "Extra Time";

    const homeScore90 = get("HOME_SCORE_90");
    const awayScore90 = get("AWAY_SCORE_90");
    const homeScoreET = get("HOME_SCORE_ET");
    const awayScoreET = get("AWAY_SCORE_ET");

    const totalHome = goesToET
      ? parseInt(homeScore90 || 0) + parseInt(homeScoreET || 0)
      : parseInt(homeScore90 || 0);
    const totalAway = goesToET
      ? parseInt(awayScore90 || 0) + parseInt(awayScoreET || 0)
      : parseInt(awayScore90 || 0);

    return Response.json({
      homeScore: homeScore90,
      awayScore: awayScore90,
      homeScoreET: homeScoreET,
      awayScoreET: awayScoreET,
      totalHome: totalHome.toString(),
      totalAway: totalAway.toString(),
      goesToET,
      goesToPenalties,
      penaltyWinner: get("PENALTY_WINNER"),
      winner: get("WINNER"),
      method,
      homeWin: get("HOME_WIN"),
      awayWin: get("AWAY_WIN"),
      draw: "0",
      isKnockout: true,
    });
  }

  return Response.json({
    homeScore: get("HOME_SCORE"),
    awayScore: get("AWAY_SCORE"),
    winner: get("WINNER"),
    homeWin: get("HOME_WIN"),
    awayWin: get("AWAY_WIN"),
    draw: get("DRAW"),
    isKnockout: false,
  });
}