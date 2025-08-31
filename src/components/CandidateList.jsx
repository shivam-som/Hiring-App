import React from "react";

export default function CandidateList({
  candidates = [],
  onSelect,
  onShortlist,
  scores = {},
}) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">All Candidates</h2>
      {candidates.length === 0 ? (
        <div className="text-sm text-gray-500">No candidates found.</div>
      ) : (
        <ul className="space-y-2 max-h-[60vh] overflow-auto">
          {candidates.map((c) => {
            const sc = scores[c.id] ?? c.score ?? "N/A";
            const experience = c.work_experiences
              ? c.work_experiences.length
              : 0;
            return (
              <li
                key={c.id}
                className="flex items-center justify-between p-2 border rounded"
              >
                <div onClick={() => onSelect?.(c)} className="cursor-pointer">
                  <div className="font-medium">{c.name}</div>
                  <div className="text-xs text-slate-500">
                    {c.location || "-"}
                  </div>
                  <div className="text-xs text-gray-600">
                    Experience: {experience} yrs
                  </div>{" "}
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-sm px-2 py-1 border rounded text-center min-w-[48px]">
                    {typeof sc === "number" ? sc : sc}
                  </div>
                  <button
                    onClick={() => onShortlist?.(c)}
                    className="px-2 py-1 bg-blue-600 text-white rounded"
                  >
                    Shortlist
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
