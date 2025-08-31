const FRONTEND_KEYWORDS = ["react","javascript","typescript","html","css","frontend","vue","angular","node"];

function norm(text = "") { return (text || "").toString().toLowerCase(); }

export function computeScore(candidate = {}) {
  let score = 0;
  const exp = Number(candidate.years_experience || candidate.experience || 0);
  score += Math.min(20, exp * 3);
  const skillsText = Array.isArray(candidate.skills) ? candidate.skills.join(" ") : (candidate.skills || "");
  const st = norm(skillsText);
  let match = 0;
  FRONTEND_KEYWORDS.forEach((k) => { if (st.includes(k)) match++; });
  score += match * 4;
  if (candidate.portfolio || candidate.portfolio_link) score += 8;
  if (candidate.github) score += 6;
  if (candidate.resume || candidate.linkedin) score += 5;
  const title = norm(candidate.applied_for || candidate.title || "");
  FRONTEND_KEYWORDS.forEach((k) => { if (title.includes(k)) score += 1; });
  const edu = norm(candidate.education?.highest_level || candidate.education || "");
  if (edu.includes("b.tech") || edu.includes("bachelor")) score += 2;
  if (edu.includes("master") || edu.includes("m.tech") || edu.includes("ms")) score += 3;
  if (!candidate.email && !candidate.phone) score -= 6;
  return Math.round(Math.max(0, score));
}

export function diverseSelection(candidates = [], k = 5) {
  const buckets = { junior: [], mid: [], senior: [] };
  candidates.forEach((c) => {
    const e = Number(c.years_experience || c.experience || 0);
    if (e < 2) buckets.junior.push(c);
    else if (e < 5) buckets.mid.push(c);
    else buckets.senior.push(c);
  });
  Object.keys(buckets).forEach((b) => buckets[b].sort((a,b2) => (b2.score || 0) - (a.score || 0)));
  const selected = [];
  const seenLocations = new Set();
  for (const b of ["senior","mid","junior"]) {
    if (selected.length >= k) break;
    for (const cand of buckets[b]) {
      const loc = (cand.location || "").toLowerCase();
      if (!seenLocations.has(loc)) {
        selected.push(cand);
        seenLocations.add(loc);
        break;
      }
    }
  }
  const remaining = candidates.slice().sort((a,b) => (b.score || 0) - (a.score || 0));
  for (const c of remaining) {
    if (selected.length >= k) break;
    if (!selected.find((s) => s.id === c.id)) {
      const loc = (c.location || "").toLowerCase();
      if (!seenLocations.has(loc)) {
        selected.push(c); seenLocations.add(loc);
      }
    }
  }
  for (const c of remaining) {
    if (selected.length >= k) break;
    if (!selected.find((s) => s.id === c.id)) selected.push(c);
  }
  return selected.slice(0, k);
}
