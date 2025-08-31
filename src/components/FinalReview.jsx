import React from "react";

export default function FinalReview({ shortlisted = [], scores = {} }) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Final Review</h2>
      {shortlisted.length === 0 ? (
        <div className="text-sm text-gray-500">No shortlisted candidates.</div>
      ) : (
        <ul className="space-y-2">
          {shortlisted.map((c) => (
            <li key={c.id} className="flex items-center justify-between p-2 border rounded">
              <div className="font-medium">{c.name}</div>
              <div className="text-sm">Score: <strong>{scores[c.id] ?? c.score ?? "N/A"}</strong></div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
