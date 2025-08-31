// src/App.jsx
import React, { useEffect, useMemo, useState } from "react";
import CandidateList from "./components/CandidateList";
import CandidateDetail from "./components/CandidateDetail";
import ScorePanel from "./components/ScorePanel";
import ShortlistPanel from "./components/ShortlistPanel";
import FinalReview from "./components/FinalReview";
import { computeScore, diverseSelection } from "./utils/scoring";

export default function App() {
  const [rawCandidates, setRawCandidates] = useState([]);
  const [selected, setSelected] = useState(null);
  const [shortlist, setShortlist] = useState([]);
  const [scores, setScores] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/form-submissions.json");
        if (!res.ok) throw new Error(`fetch failed: ${res.status}`);
        const data = await res.json();
        const arr = Array.isArray(data) ? data : data.submissions || [];

        // compute score for each and ensure stable id
        const normalized = arr.map((c, i) => {
          const id = c.id ?? c.email ?? c.name ?? `c_${i}`;
          const base = { ...c, id: String(id) };
          base.score = computeScore(base);
          return base;
        });

        // initial scores map
        const initialScores = Object.fromEntries(normalized.map((c) => [c.id, Number(c.score) || 0]));

        // sort by initial score
        normalized.sort((a, b) => (initialScores[b.id] || 0) - (initialScores[a.id] || 0));

        setRawCandidates(normalized);
        setScores(initialScores);
      } catch (err) {
        console.error("Failed to load submissions:", err);
        setRawCandidates([]);
      }
    })();
  }, []);

  // Helper: compute ordering using the current scores map (so manual edits matter)
  const topCandidates = useMemo(() => {
    return rawCandidates
      .slice()
      .sort((a, b) => (scores[b.id] ?? b.score ?? 0) - (scores[a.id] ?? a.score ?? 0));
  }, [rawCandidates, scores]);

  // pick best by current score
  function autoPickBest(k = 5) {
    setShortlist(topCandidates.slice(0, k));
  }

  // pick diverse using diverseSelection but feed it the scored ordering
  function autoPickDiverse(k = 5) {
    const pick = diverseSelection(topCandidates, k);
    setShortlist(pick);
  }

  function toggleShortlist(candidate) {
    setShortlist((prev) => {
      if (prev.find((p) => p.id === candidate.id)) return prev.filter((p) => p.id !== candidate.id);
      if (prev.length >= 5) return prev;
      return [...prev, candidate];
    });
  }

  function removeFromShortlist(id) {
    setShortlist((prev) => prev.filter((p) => p.id !== id));
  }

  // when a score changes from ScorePanel
  function onScoreChange(id, value) {
    const num = Number(value) || 0;
    setScores((prev) => ({ ...prev, [id]: num }));
    setRawCandidates((prev) => prev.map((c) => (c.id === id ? { ...c, score: num } : c)));
  }

  // report download (unchanged)
  function downloadReport() {
    const now = new Date().toISOString();
    const text = shortlist
      .map((c, i) => {
        const sc = scores[c.id] ?? c.score ?? "N/A";
        return `${i + 1}. ${c.name} (id:${c.id}) — score: ${sc} — location: ${c.location || "-"} — exp: ${c.years_experience || "-"}`;
      })
      .join("\n");
    const blob = new Blob([`Shortlist report ${now}\n\n${text}`], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `shortlist-${now.slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="container p-6">
      <header className="mb-4">
        <h1 className="text-3xl font-bold">Hiring Helper — Frontend</h1>
        <p className="text-slate-600">Auto pick Best / Diverse and shortlist up to 5 candidates.</p>
      </header>

      <div className="mb-4 flex gap-2 items-center">
        <button onClick={() => autoPickBest(5)} className="px-3 py-2 rounded bg-sky-600 text-white">Auto pick: Best 5</button>
        <button onClick={() => autoPickDiverse(5)} className="px-3 py-2 rounded bg-emerald-600 text-white">Auto pick: Diverse 5</button>
        <button onClick={() => setShortlist([])} className="px-3 py-2 rounded border">Clear shortlist</button>
        <div className="ml-auto text-sm text-slate-500">Total applicants: {rawCandidates.length}</div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-4">
          <div className="card mb-4">
            <ScorePanel candidates={rawCandidates} scores={scores} onScoreChange={onScoreChange} />
          </div>

          <div className="card">
            <CandidateList candidates={topCandidates} onSelect={setSelected} onShortlist={toggleShortlist} scores={scores} />
          </div>
        </div>

        <div className="col-span-4">
          <div className="card">
            <CandidateDetail candidate={selected} scores={scores} onShortlist={toggleShortlist} />
          </div>

          <div className="mt-4 card">
            <FinalReview shortlisted={shortlist} scores={scores} />
          </div>
        </div>

        <div className="col-span-4">
          <div className="card mb-4">
            <ShortlistPanel shortlisted={shortlist} onRemove={removeFromShortlist} scores={scores} />
          </div>

          <div className="card">
            <h3 className="font-semibold mb-2">Why these candidates?</h3>
            {shortlist.length === 0 ? (
              <div className="text-sm text-slate-500">No shortlist yet. Use Auto pick or manually shortlist candidates.</div>
            ) : (
              <div className="space-y-3">
                {shortlist.map((c) => (
                  <div key={c.id} className="p-2 border rounded">
                    <div className="font-medium">{c.name} <span className="text-xs text-slate-500">({c.location || "—"})</span></div>
                    <div className="text-sm text-slate-700 mt-1">
                      Score: <strong>{scores[c.id] ?? c.score ?? "N/A"}</strong>
                      {c.skills && <span> • {Array.isArray(c.skills) ? c.skills.slice(0, 6).join(", ") : c.skills}</span>}
                    </div>
                  </div>
                ))}
                <div className="mt-3 flex gap-2">
                  <button onClick={downloadReport} className="px-3 py-2 border rounded">Download report</button>
                  <button
                    onClick={() => {
                      const json = JSON.stringify(shortlist.map(s => ({ ...s, score: scores[s.id] ?? s.score })), null, 2);
                      const blob = new Blob([json], { type: "application/json" });
                      const a = document.createElement("a");
                      a.href = URL.createObjectURL(blob);
                      a.download = `shortlist.json`;
                      a.click();
                    }}
                    className="px-3 py-2 rounded bg-sky-600 text-white"
                  >
                    Export JSON
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
