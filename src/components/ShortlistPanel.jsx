import React from "react";

export default function ShortlistPanel({ shortlisted = [], onRemove, scores = {} }) {
  console.log('shortlisted => ', shortlisted);
  
  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Shortlist ({shortlisted.length})</h2>
      {shortlisted.length === 0 ? (
        <div className="text-sm text-gray-500">No one shortlisted yet.</div>
      ) : (
        <ul className="space-y-2">
          {shortlisted.map((s) => (
            <li key={s.id} className="flex items-center justify-between p-2 border rounded">
              <div>
                <div className="font-medium">{s.name}</div>
                <div className="text-xs text-slate-500">{s.years_experience ?? "-"} yrs • {s.location || "-"}</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-sm px-2 py-1 border rounded">{scores[s.id] ?? s.score ?? "N/A"}</div>
                <button onClick={() => onRemove?.(s.id)} className="px-2 py-1 bg-rose-500 text-white rounded text-xs">Remove</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
