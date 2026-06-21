"use client";

import { useState, useEffect } from "react";
import { fixtures } from "@/data/fixtures";
import { teamFlags } from "@/data/teamFlags";
import { getResult } from "@/data/results2026";

const TABS = [
  { id: "group", label: "Group Stage" },
  { id: "r32", label: "Round of 32" },
  { id: "r16", label: "Round of 16" },
  { id: "qf", label: "Quarter Finals" },
  { id: "sf", label: "Semi Finals" },
  { id: "final", label: "Final" },
];

const MATCHDAYS = ["Matchday 1", "Matchday 2", "Matchday 3"];

function FlagImage({ team }) {
  const code = teamFlags[team];
  if (!code) return <div className="w-10 h-7 rounded bg-gray-800 mx-auto" />;
  return (
    <img
      src={`https://flagcdn.com/w80/${code}.png`}
      alt={team}
      className="w-10 h-7 mx-auto object-cover rounded"
    />
  );
}

function AnimatedScore({ value }) {
  const [display, setDisplay] = useState(0);
  const target = parseInt(value) || 0;

  useEffect(() => {
    let current = 0;
    const steps = 20;
    const increment = target / steps;
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        setDisplay(target);
        clearInterval(interval);
      } else {
        setDisplay(Math.floor(current));
      }
    }, 40);
    return () => clearInterval(interval);
  }, [target]);

  return <span>{display}</span>;
}

function MatchCard({ fixture }) {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const actualResult = getResult(fixture.home, fixture.away);
  const isPlayed = !!actualResult && actualResult.score !== "pending";

  let actualHome = null;
  let actualAway = null;
  let actualWinner = null;

  if (isPlayed) {
    const parts = actualResult.score.split("-");
    actualHome = parseInt(parts[0]);
    actualAway = parseInt(parts[1]);
    if (actualHome > actualAway) actualWinner = "home";
    else if (actualAway > actualHome) actualWinner = "away";
    else actualWinner = "draw";
  }

  const isDraw = prediction?.winner?.toLowerCase().includes("draw");
  const isHomeWinner = !isDraw && prediction?.winner?.toLowerCase().includes(fixture.home.toLowerCase());
  const isAwayWinner = !isDraw && prediction?.winner?.toLowerCase().includes(fixture.away.toLowerCase());

  async function predict() {
    setLoading(true);
    setPrediction(null);
    const res = await fetch("/api/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fixture),
    });
    const data = await res.json();
    setPrediction(data);
    setLoading(false);
  }

  return (
    <div className="bg-gray-900 rounded-2xl p-5 flex flex-col gap-4">

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{fixture.matchday}</span>
        <span>{fixture.date}</span>
      </div>

      {isPlayed ? (
        <>
          <div className="flex items-center justify-between gap-2">
            <div className={`flex-1 text-center rounded-xl p-3 ${
              actualWinner === "home" ? "shadow-[0_0_25px_rgba(74,222,128,0.4)] bg-gray-800" :
              actualWinner === "away" ? "shadow-[0_0_25px_rgba(239,68,68,0.4)] bg-gray-800" :
              "shadow-[0_0_25px_rgba(234,179,8,0.4)] bg-gray-800"
            }`}>
              <FlagImage team={fixture.home} />
              <p className={`text-sm font-semibold mt-2 ${
                actualWinner === "home" ? "text-green-400" :
                actualWinner === "draw" ? "text-yellow-400" : "text-white"
              }`}>{fixture.home}</p>
              <p className="text-gray-500 text-xs mt-0.5">Home</p>
              {actualWinner === "home" && <p className="text-green-400 text-xs font-bold mt-1 animate-pulse">Winner</p>}
              {actualWinner === "draw" && <p className="text-yellow-400 text-xs font-bold mt-1 animate-pulse">Draw</p>}
            </div>

            <div className="text-center px-2">
              <p className="text-2xl font-bold text-white">{actualHome} — {actualAway}</p>
              <p className="text-gray-500 text-xs mt-1">Final Score</p>
            </div>

            <div className={`flex-1 text-center rounded-xl p-3 ${
              actualWinner === "away" ? "shadow-[0_0_25px_rgba(74,222,128,0.4)] bg-gray-800" :
              actualWinner === "home" ? "shadow-[0_0_25px_rgba(239,68,68,0.4)] bg-gray-800" :
              "shadow-[0_0_25px_rgba(234,179,8,0.4)] bg-gray-800"
            }`}>
              <FlagImage team={fixture.away} />
              <p className={`text-sm font-semibold mt-2 ${
                actualWinner === "away" ? "text-green-400" :
                actualWinner === "draw" ? "text-yellow-400" : "text-white"
              }`}>{fixture.away}</p>
              <p className="text-gray-500 text-xs mt-0.5">Away</p>
              {actualWinner === "away" && <p className="text-green-400 text-xs font-bold mt-1 animate-pulse">Winner</p>}
              {actualWinner === "draw" && <p className="text-yellow-400 text-xs font-bold mt-1 animate-pulse">Draw</p>}
            </div>
          </div>

          <div className="text-center">
            <span className="text-xs text-gray-500 uppercase tracking-widest">Match Completed</span>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between gap-2">
            <div className={`flex-1 text-center rounded-xl p-3 transition-all duration-700 ${
              prediction && isHomeWinner ? "shadow-[0_0_25px_rgba(74,222,128,0.4)] bg-gray-800" :
              prediction && isAwayWinner ? "shadow-[0_0_25px_rgba(239,68,68,0.4)] bg-gray-800" :
              prediction && isDraw ? "shadow-[0_0_25px_rgba(234,179,8,0.4)] bg-gray-800" : ""
            }`}>
              <FlagImage team={fixture.home} />
              <p className={`text-sm font-semibold mt-2 transition-all duration-700 ${
                prediction && isHomeWinner ? "text-green-400" :
                prediction && isDraw ? "text-yellow-400" : "text-white"
              }`}>{fixture.home}</p>
              <p className="text-gray-500 text-xs mt-0.5">Home</p>
              {prediction && isHomeWinner && <p className="text-green-400 text-xs font-bold mt-1 animate-pulse">Winner</p>}
              {prediction && isDraw && <p className="text-yellow-400 text-xs font-bold mt-1 animate-pulse">Draw</p>}
            </div>

            <div className="text-center px-2">
              {prediction ? (
                <div>
                  <p className="text-2xl font-bold text-white">
                    <AnimatedScore value={prediction.homeScore} />
                    {" — "}
                    <AnimatedScore value={prediction.awayScore} />
                  </p>
                  <p className="text-gray-500 text-xs mt-1">Predicted</p>
                </div>
              ) : (
                <p className="text-gray-600 text-xl font-bold">vs</p>
              )}
            </div>

            <div className={`flex-1 text-center rounded-xl p-3 transition-all duration-700 ${
              prediction && isAwayWinner ? "shadow-[0_0_25px_rgba(74,222,128,0.4)] bg-gray-800" :
              prediction && isHomeWinner ? "shadow-[0_0_25px_rgba(239,68,68,0.4)] bg-gray-800" :
              prediction && isDraw ? "shadow-[0_0_25px_rgba(234,179,8,0.4)] bg-gray-800" : ""
            }`}>
              <FlagImage team={fixture.away} />
              <p className={`text-sm font-semibold mt-2 transition-all duration-700 ${
                prediction && isAwayWinner ? "text-green-400" :
                prediction && isDraw ? "text-yellow-400" : "text-white"
              }`}>{fixture.away}</p>
              <p className="text-gray-500 text-xs mt-0.5">Away</p>
              {prediction && isAwayWinner && <p className="text-green-400 text-xs font-bold mt-1 animate-pulse">Winner</p>}
              {prediction && isDraw && <p className="text-yellow-400 text-xs font-bold mt-1 animate-pulse">Draw</p>}
            </div>
          </div>

          {prediction && (
            <div className="flex justify-between text-xs px-1">
              <div className="text-center">
                <p className="text-gray-400 mb-1">{fixture.home}</p>
                <div className="w-20 bg-gray-800 rounded-full h-1.5">
                  <div className="bg-green-500 h-1.5 rounded-full transition-all duration-1000" style={{ width: `${prediction.homeWin}%` }} />
                </div>
                <p className="text-white mt-1">{prediction.homeWin}%</p>
              </div>
              <div className="text-center">
                <p className="text-gray-400 mb-1">Draw</p>
                <div className="w-20 bg-gray-800 rounded-full h-1.5">
                  <div className="bg-yellow-500 h-1.5 rounded-full transition-all duration-1000" style={{ width: `${prediction.draw}%` }} />
                </div>
                <p className="text-white mt-1">{prediction.draw}%</p>
              </div>
              <div className="text-center">
                <p className="text-gray-400 mb-1">{fixture.away}</p>
                <div className="w-20 bg-gray-800 rounded-full h-1.5">
                  <div className="bg-blue-500 h-1.5 rounded-full transition-all duration-1000" style={{ width: `${prediction.awayWin}%` }} />
                </div>
                <p className="text-white mt-1">{prediction.awayWin}%</p>
              </div>
            </div>
          )}

          <button
            onClick={predict}
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-400 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-black font-bold py-3 rounded-xl text-xs tracking-widest uppercase"
          >
            {loading ? "Analyzing..." : prediction ? "Predict Again" : "Predict →"}
          </button>
        </>
      )}

    </div>
  );
}

function KnockoutPlaceholder({ round }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="text-5xl mb-6">🏆</p>
      <h2 className="text-xl font-bold text-white mb-3">{round} Fixtures Not Confirmed Yet</h2>
      <p className="text-gray-500 text-sm max-w-sm">
        These fixtures will be decided once the previous round concludes. Check back soon.
      </p>
    </div>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState("group");

  return (
    <main className="min-h-screen bg-gray-950 text-white">

      <div className="text-center pt-10 pb-6 px-6">
        <p className="text-green-400 text-xs font-semibold tracking-widest uppercase mb-3">FIFA World Cup 2026</p>
        <h1 className="text-4xl font-bold tracking-tight mb-2">Match Predictor</h1>
        <p className="text-gray-500 text-sm">AI powered predictions for every match</p>
      </div>

      <div className="sticky top-0 bg-gray-950 border-b border-gray-800 z-10">
        <div className="max-w-5xl mx-auto px-4 flex overflow-x-auto gap-1 py-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                activeTab === tab.id
                  ? "bg-green-500 text-black"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {activeTab === "group" && (
          <div className="space-y-10">
            {MATCHDAYS.map((matchday) => (
              <div key={matchday}>
                <h2 className="text-gray-400 text-xs uppercase tracking-widest mb-4 font-semibold">{matchday}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {fixtures
                    .filter((f) => f.matchday === matchday)
                    .map((f) => (
                      <MatchCard key={f.id} fixture={f} />
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "r32" && <KnockoutPlaceholder round="Round of 32" />}
        {activeTab === "r16" && <KnockoutPlaceholder round="Round of 16" />}
        {activeTab === "qf" && <KnockoutPlaceholder round="Quarter Finals" />}
        {activeTab === "sf" && <KnockoutPlaceholder round="Semi Finals" />}
        {activeTab === "final" && <KnockoutPlaceholder round="Final" />}
      </div>

    </main>
  );
}