import React from "react";

export default function ScorePanel({ candidates = [], scores = {}, onScoreChange }) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Score Panel</h2>
      {candidates.length === 0 ? (
        <div className="text-sm text-gray-500">No candidates to score.</div>
      ) : (
        <ul className="space-y-2 max-h-[36vh] overflow-auto">
          {candidates.map((c) => {
            const value = scores[c.id] ?? c.score ?? "";
            return (
              <li key={c.id} className="flex items-center justify-between p-2 border rounded">
                <div className="truncate mr-2">{c.name}</div>
                <input
                  className="w-16 p-1 border rounded text-center"
                  type="number"
                  min="0"
                  max="100"
                  value={value}
                  onChange={(e) => onScoreChange?.(c.id, e.target.value)}
                  placeholder="0-100"
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
