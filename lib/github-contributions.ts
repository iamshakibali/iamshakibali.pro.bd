// Shared loader for GitHub contribution data, used by the hero graph and the
// GitHub hover card. One request per page load (the promise is shared), with a
// timeout + retry because the public API occasionally hangs, and the last good
// response kept in localStorage so returning visitors see data instantly.

export type Contribution = { date: string; count: number; level: number };
export type ContributionsPayload = {
  total: Record<string, number>;
  contributions: Contribution[];
};

const API_URL = "https://github-contributions-api.jogruber.de/v4/iamshakibali";
const CACHE_KEY = "gh-contributions-raw-v1";
const TIMEOUT_MS = 6000;

let inflight: Promise<ContributionsPayload> | null = null;

export function readCachedContributions(): ContributionsPayload | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const json = JSON.parse(raw);
    return Array.isArray(json?.contributions) ? json : null;
  } catch {
    return null;
  }
}

async function request(attempt: number): Promise<ContributionsPayload> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const r = await fetch(API_URL, { signal: ctrl.signal });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const json = await r.json();
    if (!Array.isArray(json?.contributions)) throw new Error("bad payload");
    return json;
  } catch (err) {
    if (attempt < 1) return request(attempt + 1);
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

export function fetchContributions(): Promise<ContributionsPayload> {
  if (!inflight) {
    inflight = request(0).then(
      (json) => {
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(json));
        } catch {}
        return json;
      },
      (err) => {
        inflight = null; // allow a later mount to try again
        throw err;
      },
    );
  }
  return inflight;
}
