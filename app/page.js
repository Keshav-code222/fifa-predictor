"use client";

import { useState } from "react";
import { fixtures } from "@/data/fixtures";

export default function Home() {
  const [selected, setSelected] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const matchdays = ["Matchday 1", "Matchday 2", "Matchday 3"];

  async function predict() {
    setLoading(true);
    setPrediction(null);

    const res = await fetch("/api/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(selected),
    });

    const data = await res.json();
    setPrediction(data.result);
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-2xl mx-auto">

        <div className="text-center mb-10">
          <p className="text-green-400 text-xs font-semibold tracking-widest uppercase mb-3">FIFA World Cup 2026</p>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Match Predictor</h1>
          <p className="text-gray-500 text-sm">Select a fixture to get an AI powered prediction</p>
        </div>

        <div className="bg-gray-900 rounded-2xl p-6 mb-6">
          <label className="text-gray-400 text-xs uppercase tracking-widest mb-3 block">Select a fixture</label>
          <select
            className="w-full bg-gray-800 text-white p-3 rounded-xl text-sm"
            onChange={(e) => {
              setPrediction(null);
              if (e.target.value === "") {
                setSelected(null);
                return;
              }
              setSelected(JSON.parse(e.target.value));
            }}
          >
            <option value="">Choose a match...</option>
            {matchdays.map((matchday) => (
              <optgroup key={matchday} label={matchday}>
                {fixtures
                  .filter((f) => f.matchday === matchday)
                  .map((f) => (
                    <option key={f.id} value={JSON.stringify(f)}>
                      {f.home} vs {f.away} — {f.date}
                    </option>
                  ))}
              </optgroup>
            ))}
          </select>
        </div>

        {selected && (
          <div className="bg-gray-900 rounded-2xl p-6 mb-6">
            <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">{selected.matchday}</p>
            <p className="text-gray-400 text-sm mb-6">{selected.venue} · {selected.time}</p>

            <div className="flex items-center justify-between mb-8">
              <div className="text-center flex-1">
                <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🏳️</span>
                </div>
                <p className="font-semibold text-lg">{selected.home}</p>
                <p className="text-gray-500 text-xs mt-1">Home</p>
              </div>

              <div className="text-center px-4">
                <p className="text-gray-600 text-2xl font-bold">vs</p>
              </div>

              <div className="text-center flex-1">
                <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🏳️</span>
                </div>
                <p className="font-semibold text-lg">{selected.away}</p>
                <p className="text-gray-500 text-xs mt-1">Away</p>
              </div>
            </div>

            <button
              onClick={predict}
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-400 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-black font-bold py-4 rounded-xl text-sm tracking-wide"
            >
              {loading ? "Analyzing match..." : "Predict this match →"}
            </button>
          </div>
        )}

        {prediction && (
          <div className="bg-gray-900 rounded-2xl p-6">
            <p className="text-green-400 text-xs uppercase tracking-widest mb-4">AI Prediction</p>
            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{prediction}</p>
          </div>
        )}

      </div>
    </main>
  );
}