(function () {
  "use strict";

  const KEY = "phishguard.searchHistory.v1";
  const LIMIT = 20;

  function normalize(query) {
    return query.toLowerCase().replace(/\s+/g, " ").trim();
  }

  function read() {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item) => item
        && typeof item.query === "string"
        && item.query.length > 0
        && item.query.length <= 120
        && Number.isFinite(item.searchedAt)
        && Math.abs(item.searchedAt) <= 8.64e15)
      .slice(0, LIMIT);
  }

  function add(query) {
    const value = String(query || "").replace(/\s+/g, " ").trim().slice(0, 120);
    if (!value) return;
    const searches = read().filter((item) => normalize(item.query) !== normalize(value));
    searches.unshift({ query: value, searchedAt: Date.now() });
    localStorage.setItem(KEY, JSON.stringify(searches.slice(0, LIMIT)));
  }

  function clear() {
    localStorage.removeItem(KEY);
  }

  window.PG = window.PG || {};
  window.PG.SearchHistory = { read, add, clear };
})();
