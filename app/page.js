"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fixtures } from "@/data/fixtures";
import { teamFlags } from "@/data/teamFlags";
import { getResult, getKnockoutResult } from "@/data/results2026";
import { knockoutFixtures } from "@/data/knockout";

const TABS = [
  { id: "group", label: "Group Stage" },
  { id: "r32", label: "Round of 32" },
  { id: "r16", label: "Round of 16" },
  { id: "qf", label: "Quarter Finals" },
  { id: "sf", label: "Semi Finals" },
  { id: "final", label: "Final" },
];

const MATCHDAYS = ["Matchday 1", "Matchday 2", "Matchday 3"];

function FlagImage({ team, className }) {
  const code = teamFlags[team];
  if (!code) return <div className={className || "w-10 h-7 rounded bg-gray-800 mx-auto"} />;
  return (
    <img
      src={`https://flagcdn.com/w80/${code}.png`}
      alt={team}
      className={className || "w-10 h-7 mx-auto object-cover rounded"}
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

function KnockoutCard({ fixture }) {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const actualResult = getKnockoutResult(fixture.id);
  const isPlayed = !!actualResult;

  const isHomeWinner = prediction?.winner?.toLowerCase().includes(fixture.home.toLowerCase());
  const isAwayWinner = prediction?.winner?.toLowerCase().includes(fixture.away.toLowerCase());

  async function predict() {
    setLoading(true);
    setPrediction(null);
    const res = await fetch("/api/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...fixture, isKnockout: true }),
    });
    const data = await res.json();
    setPrediction(data);
    setLoading(false);
  }

  if (!fixture.confirmed || fixture.home === "TBD" || fixture.away === "TBD") {
    return (
      <div className="bg-gray-900 rounded-2xl p-5 flex flex-col items-center justify-center min-h-40 border border-gray-800">
        <p className="text-gray-600 text-2xl mb-2">⚽</p>
        <p className="text-gray-600 text-sm font-semibold">To Be Decided</p>
        <p className="text-gray-700 text-xs mt-1">Fixture not confirmed yet</p>
      </div>
    );
  }

  if (isPlayed) {
    const homeWins = actualResult.winner === fixture.home;
    return (
      <div className="bg-gray-900 rounded-2xl p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{fixture.date}</span>
          <span>{fixture.time}</span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className={`flex-1 text-center rounded-xl p-3 ${
            homeWins ? "shadow-[0_0_25px_rgba(74,222,128,0.4)] bg-gray-800" : "shadow-[0_0_25px_rgba(239,68,68,0.4)] bg-gray-800"
          }`}>
            <FlagImage team={fixture.home} />
            <p className={`text-sm font-semibold mt-2 ${homeWins ? "text-green-400" : "text-white"}`}>{fixture.home}</p>
            {homeWins && <p className="text-green-400 text-xs font-bold mt-1 animate-pulse">Goes Through</p>}
          </div>

          <div className="text-center px-2">
            <p className="text-2xl font-bold text-white">{actualResult.score}</p>
            {actualResult.et && <p className="text-blue-400 text-xs mt-1">ET: {actualResult.etScore}</p>}
            {actualResult.penalties && <p className="text-yellow-400 text-xs mt-1 font-bold animate-pulse">{actualResult.winner} on Pens {actualResult.penaltyScore}</p>}
            {!actualResult.et && !actualResult.penalties && <p className="text-gray-500 text-xs mt-1">Full Time</p>}
          </div>

          <div className={`flex-1 text-center rounded-xl p-3 ${
            !homeWins ? "shadow-[0_0_25px_rgba(74,222,128,0.4)] bg-gray-800" : "shadow-[0_0_25px_rgba(239,68,68,0.4)] bg-gray-800"
          }`}>
            <FlagImage team={fixture.away} />
            <p className={`text-sm font-semibold mt-2 ${!homeWins ? "text-green-400" : "text-white"}`}>{fixture.away}</p>
            {!homeWins && <p className="text-green-400 text-xs font-bold mt-1 animate-pulse">Goes Through</p>}
          </div>
        </div>

        <div className="text-center">
          <span className="text-xs text-gray-500 uppercase tracking-widest">Match Completed</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{fixture.date}</span>
        <span>{fixture.time}</span>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className={`flex-1 text-center rounded-xl p-3 transition-all duration-700 ${
          prediction && isHomeWinner ? "shadow-[0_0_25px_rgba(74,222,128,0.4)] bg-gray-800" :
          prediction && isAwayWinner ? "shadow-[0_0_25px_rgba(239,68,68,0.4)] bg-gray-800" : ""
        }`}>
          <FlagImage team={fixture.home} />
          <p className={`text-sm font-semibold mt-2 transition-all duration-700 ${
            prediction && isHomeWinner ? "text-green-400" : "text-white"
          }`}>{fixture.home}</p>
          <p className="text-gray-500 text-xs mt-0.5">Home</p>
          {prediction && isHomeWinner && <p className="text-green-400 text-xs font-bold mt-1 animate-pulse">Goes Through</p>}
        </div>

        <div className="text-center px-2">
          {prediction ? (
            <div>
              <p className="text-2xl font-bold text-white">
                <AnimatedScore value={prediction.homeScore} />
                {" — "}
                <AnimatedScore value={prediction.awayScore} />
              </p>
              <p className="text-gray-500 text-xs mt-1">90 mins</p>
              {prediction.goesToET && (
                <p className="text-blue-400 text-xs mt-1 font-semibold">
                  ET: <AnimatedScore value={prediction.totalHome} />—<AnimatedScore value={prediction.totalAway} />
                </p>
              )}
              {prediction.goesToPenalties && (
                <p className="text-yellow-400 text-xs mt-1 font-bold animate-pulse">
                  {prediction.penaltyWinner} wins on Penalties
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-600 text-xl font-bold">vs</p>
          )}
        </div>

        <div className={`flex-1 text-center rounded-xl p-3 transition-all duration-700 ${
          prediction && isAwayWinner ? "shadow-[0_0_25px_rgba(74,222,128,0.4)] bg-gray-800" :
          prediction && isHomeWinner ? "shadow-[0_0_25px_rgba(239,68,68,0.4)] bg-gray-800" : ""
        }`}>
          <FlagImage team={fixture.away} />
          <p className={`text-sm font-semibold mt-2 transition-all duration-700 ${
            prediction && isAwayWinner ? "text-green-400" : "text-white"
          }`}>{fixture.away}</p>
          <p className="text-gray-500 text-xs mt-0.5">Away</p>
          {prediction && isAwayWinner && <p className="text-green-400 text-xs font-bold mt-1 animate-pulse">Goes Through</p>}
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
            <p className="text-gray-400 mb-1">Decided by</p>
            <p className="text-white font-semibold mt-1">{prediction.method}</p>
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
    </div>
  );
}

function BigMatchCard({ fixture, label }) {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const actualResult = getKnockoutResult(fixture.id);
  const isPlayed = !!actualResult;

  const isHomeWinner = prediction?.winner?.toLowerCase().includes(fixture.home.toLowerCase());
  const isAwayWinner = prediction?.winner?.toLowerCase().includes(fixture.away.toLowerCase());

  async function predict() {
    setLoading(true);
    setPrediction(null);
    const res = await fetch("/api/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...fixture, isKnockout: true }),
    });
    const data = await res.json();
    setPrediction(data);
    setLoading(false);
  }

  if (!fixture.confirmed || fixture.home === "TBD" || fixture.away === "TBD") {
    return (
      <div className="w-full max-w-md mx-auto bg-gray-900 rounded-3xl p-8 flex flex-col items-center justify-center min-h-52 border border-gray-800">
        <p className="text-4xl mb-3">⚽</p>
        <p className="text-gray-500 text-sm font-semibold">{label}</p>
        <p className="text-gray-700 text-xs mt-2">To Be Decided</p>
      </div>
    );
  }

  if (isPlayed) {
    const homeWins = actualResult.winner === fixture.home;
    return (
      <div className="w-full max-w-lg mx-auto bg-gray-900 rounded-3xl p-7 border border-gray-800">
        <div className="text-center mb-4">
          <span className="text-xs font-bold tracking-widest uppercase text-gray-400">{label}</span>
        </div>
        <div className="text-center mb-1 text-xs text-gray-500">{fixture.venue}</div>
        <div className="text-center mb-6 text-xs text-gray-600">{fixture.date} · {fixture.time}</div>

        <div className="flex items-center justify-between gap-4 mb-6">
          <div className={`flex-1 text-center rounded-2xl p-5 ${
            homeWins ? "shadow-[0_0_40px_rgba(74,222,128,0.5)] bg-gray-800" : "shadow-[0_0_40px_rgba(239,68,68,0.5)] bg-gray-800"
          }`}>
            <FlagImage team={fixture.home} />
            <p className={`text-base font-bold mt-3 ${homeWins ? "text-green-400" : "text-white"}`}>{fixture.home}</p>
            {homeWins && <p className="text-green-400 text-xs font-bold mt-2 animate-pulse tracking-widest">✦ WINNER</p>}
          </div>

          <div className="text-center px-1">
            <p className="text-4xl font-bold text-white">{actualResult.score}</p>
            {actualResult.et && <p className="text-blue-400 text-xs mt-2">ET: {actualResult.etScore}</p>}
            {actualResult.penalties && <p className="text-yellow-400 text-xs mt-2 font-bold animate-pulse">{actualResult.winner} on Pens {actualResult.penaltyScore}</p>}
            {!actualResult.et && !actualResult.penalties && <p className="text-gray-500 text-xs mt-1">Full Time</p>}
          </div>

          <div className={`flex-1 text-center rounded-2xl p-5 ${
            !homeWins ? "shadow-[0_0_40px_rgba(74,222,128,0.5)] bg-gray-800" : "shadow-[0_0_40px_rgba(239,68,68,0.5)] bg-gray-800"
          }`}>
            <FlagImage team={fixture.away} />
            <p className={`text-base font-bold mt-3 ${!homeWins ? "text-green-400" : "text-white"}`}>{fixture.away}</p>
            {!homeWins && <p className="text-green-400 text-xs font-bold mt-2 animate-pulse tracking-widest">✦ WINNER</p>}
          </div>
        </div>

        <div className="text-center">
          <span className="text-xs text-gray-500 uppercase tracking-widest">Match Completed</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes floatUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 20px rgba(74,222,128,0.3); }
          50% { box-shadow: 0 0 60px rgba(74,222,128,0.8); }
        }
        @keyframes redGlowPulse {
          0%, 100% { box-shadow: 0 0 20px rgba(239,68,68,0.3); }
          50% { box-shadow: 0 0 60px rgba(239,68,68,0.8); }
        }
        .shimmer-text {
          background: linear-gradient(90deg, #4ade80, #facc15, #60a5fa, #4ade80);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }
        .float-in { animation: floatUp 0.6s ease forwards; }
        .glow-winner { animation: glowPulse 2s ease-in-out infinite; }
        .glow-loser { animation: redGlowPulse 2s ease-in-out infinite; }
      `}</style>

      <div className="text-center mb-4">
        <span className="shimmer-text text-sm font-bold tracking-widest uppercase">{label}</span>
      </div>

      <div className="bg-gray-900 rounded-3xl p-7 border border-gray-800">
        <div className="text-center mb-1 text-xs text-gray-500">{fixture.venue}</div>
        <div className="text-center mb-6 text-xs text-gray-600">{fixture.date} · {fixture.time}</div>

        <div className="flex items-center justify-between gap-4 mb-6">
          <div className={`flex-1 text-center rounded-2xl p-5 transition-all duration-700 ${
            prediction && isHomeWinner ? "glow-winner bg-gray-800" :
            prediction && isAwayWinner ? "glow-loser bg-gray-800" : "bg-gray-800"
          }`}>
            <FlagImage team={fixture.home} />
            <p className={`text-base font-bold mt-3 transition-all duration-700 ${
              prediction && isHomeWinner ? "text-green-400" : "text-white"
            }`}>{fixture.home}</p>
            {prediction && isHomeWinner && <p className="text-green-400 text-xs font-bold mt-2 animate-pulse tracking-widest">✦ WINNER</p>}
          </div>

          <div className="text-center px-1">
            {prediction ? (
              <div className="float-in">
                <p className="text-4xl font-bold text-white">
                  <AnimatedScore value={prediction.homeScore} />
                  <span className="text-gray-600 mx-2">—</span>
                  <AnimatedScore value={prediction.awayScore} />
                </p>
                <p className="text-gray-600 text-xs mt-1">90 mins</p>
                {prediction.goesToET && (
                  <p className="text-blue-400 text-xs mt-2 font-semibold float-in">
                    ET: <AnimatedScore value={prediction.totalHome} />—<AnimatedScore value={prediction.totalAway} />
                  </p>
                )}
                {prediction.goesToPenalties && (
                  <p className="text-yellow-400 text-xs mt-2 font-bold animate-pulse float-in">
                    {prediction.penaltyWinner} wins on Penalties
                  </p>
                )}
                {!prediction.goesToET && !prediction.goesToPenalties && (
                  <p className="text-gray-500 text-xs mt-1">Full Time</p>
                )}
              </div>
            ) : (
              <p className="text-gray-700 text-2xl font-bold">vs</p>
            )}
          </div>

          <div className={`flex-1 text-center rounded-2xl p-5 transition-all duration-700 ${
            prediction && isAwayWinner ? "glow-winner bg-gray-800" :
            prediction && isHomeWinner ? "glow-loser bg-gray-800" : "bg-gray-800"
          }`}>
            <FlagImage team={fixture.away} />
            <p className={`text-base font-bold mt-3 transition-all duration-700 ${
              prediction && isAwayWinner ? "text-green-400" : "text-white"
            }`}>{fixture.away}</p>
            {prediction && isAwayWinner && <p className="text-green-400 text-xs font-bold mt-2 animate-pulse tracking-widest">✦ WINNER</p>}
          </div>
        </div>

        {prediction && (
          <div className="flex justify-between text-xs px-2 mb-6 float-in">
            <div className="text-center">
              <p className="text-gray-400 mb-1">{fixture.home}</p>
              <div className="w-20 bg-gray-800 rounded-full h-1.5">
                <div className="bg-green-500 h-1.5 rounded-full transition-all duration-1000" style={{ width: `${prediction.homeWin}%` }} />
              </div>
              <p className="text-white mt-1">{prediction.homeWin}%</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 mb-1">Decided by</p>
              <p className="text-white font-semibold mt-1">{prediction.method}</p>
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
          className="w-full bg-green-500 hover:bg-green-400 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-black font-bold py-4 rounded-2xl text-sm tracking-widest uppercase"
        >
          {loading ? "Analyzing..." : prediction ? "Predict Again" : "Predict →"}
        </button>
      </div>
    </div>
  );
}

function KnockoutRound({ fixtures, round }) {
  const confirmed = fixtures.filter(f => f.confirmed).length;
  const total = fixtures.length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white font-semibold text-lg">{round}</h2>
        <span className="text-gray-500 text-xs">{confirmed}/{total} fixtures confirmed</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {fixtures.map((f) => (
          <KnockoutCard key={f.id} fixture={f} />
        ))}
      </div>
    </div>
  );
}

function BigMatchRound({ fixtures, round, label }) {
  const confirmed = fixtures.filter(f => f.confirmed).length;
  const total = fixtures.length;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-white font-semibold text-lg">{round}</h2>
        <span className="text-gray-500 text-xs">{confirmed}/{total} fixtures confirmed</span>
      </div>
      <div className="flex flex-col gap-8 items-center">
        {fixtures.map((f) => (
          <BigMatchCard key={f.id} fixture={f} label={label} />
        ))}
      </div>
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
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
            transition={{ duration: 0.3 }}
          >
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

            {activeTab === "r32" && <KnockoutRound fixtures={knockoutFixtures.r32} round="Round of 32" />}
            {activeTab === "r16" && <KnockoutRound fixtures={knockoutFixtures.r16} round="Round of 16" />}
            {activeTab === "qf" && <BigMatchRound fixtures={knockoutFixtures.qf} round="Quarter Finals" label="Quarter Final" />}
            {activeTab === "sf" && <BigMatchRound fixtures={knockoutFixtures.sf} round="Semi Finals" label="Semi Final" />}
            {activeTab === "final" && <BigMatchRound fixtures={knockoutFixtures.final} round="The Final" label="🏆 FIFA World Cup Final 2026" />}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}