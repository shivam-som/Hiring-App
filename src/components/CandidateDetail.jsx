import React from "react";

export default function CandidateDetail({ candidate, onShortlist, scores = {} }) {
  if (!candidate) {
    return <div className="text-sm text-gray-500">Select a candidate to view details.</div>;
  }
  const sc = scores[candidate.id] ?? candidate.score ?? "N/A";
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">{candidate.name}</h2>
      <div className="text-sm text-slate-700 mb-1">Email: {candidate.email || "-"}</div>
      <div className="text-sm text-slate-700 mb-1">Location: {candidate.location || "-"}</div>
      <div className="text-sm text-slate-700 mb-1">Experience: {candidate.years_experience ?? candidate.experience ?? "-"}</div>
      <div className="text-sm text-slate-700 mb-3">Score: <strong>{typeof sc === "number" ? sc : sc}</strong></div>

      <h3 className="mt-2 font-semibold">Skills</h3>
      <div className="flex flex-wrap gap-2 mt-1">
        {(candidate.skills || []).map((s, i) => (
          <span key={i} className="text-xs px-2 py-1 bg-slate-100 rounded">{s}</span>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <button onClick={() => onShortlist?.(candidate)} className="px-3 py-1 bg-emerald-600 text-white rounded">Shortlist</button>
        {candidate.portfolio && <a href={candidate.portfolio} target="_blank" rel="noreferrer" className="px-3 py-1 border rounded">Portfolio</a>}
      </div>
    </div>
  );
}
