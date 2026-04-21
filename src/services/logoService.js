/**
 * Logo Service
 * Fetches team logos from TheSportsDB API with in-memory caching
 */

const SPORTSDB_BASE = 'https://www.thesportsdb.com/api/v1/json/3';
const CACHE_KEY = 'sb_logo_cache';

const STATIC_LOGOS = {
  "Chennai Super Kings": "https://r2.thesportsdb.com/images/media/team/badge/okceh51487601098.png",
  "Mumbai Indians": "https://r2.thesportsdb.com/images/media/team/badge/l40j8p1487678631.png",
  "Royal Challengers Bengaluru": "https://r2.thesportsdb.com/images/media/team/badge/kynj5v1588331757.png",
  "Kolkata Knight Riders": "https://r2.thesportsdb.com/images/media/team/badge/ows99r1487678296.png",
  "Delhi Capitals": "https://r2.thesportsdb.com/images/media/team/badge/dg4g0z1587334054.png",
  "Rajasthan Royals": "https://r2.thesportsdb.com/images/media/team/badge/lehnfw1487601864.png",
  "Sunrisers Hyderabad": "https://r2.thesportsdb.com/images/media/team/badge/sc7m161487419327.png",
  "Punjab Kings": "https://r2.thesportsdb.com/images/media/team/badge/r1tcie1630697821.png",
  "Lucknow Super Giants": "https://r2.thesportsdb.com/images/media/team/badge/4tzmfa1647445839.png",
  "Gujarat Titans": "https://r2.thesportsdb.com/images/media/team/badge/6qw4r71654174508.png",
  "Arsenal": "https://r2.thesportsdb.com/images/media/team/badge/uyhbfe1612467038.png",
  "Manchester United": "https://r2.thesportsdb.com/images/media/team/badge/xzqdr11517660252.png",
  "Liverpool": "https://r2.thesportsdb.com/images/media/team/badge/kfaher1737969724.png",
  "Chelsea": "https://r2.thesportsdb.com/images/media/team/badge/yvwvtu1448813215.png",
  "Manchester City": "https://r2.thesportsdb.com/images/media/team/badge/vwpvry1467462651.png",
  "Tottenham Hotspur": "https://r2.thesportsdb.com/images/media/team/badge/dfyfhl1604094109.png",
  "Newcastle United": "https://r2.thesportsdb.com/images/media/team/badge/lhwuiz1621593302.png",
  "Aston Villa": "https://r2.thesportsdb.com/images/media/team/badge/jykrpv1717309891.png",
  "West Ham United": "https://r2.thesportsdb.com/images/media/team/badge/yutyxs1467459956.png",
  "Everton": "https://r2.thesportsdb.com/images/media/team/badge/eqayrf1523184794.png",
  "Real Madrid": "https://r2.thesportsdb.com/images/media/team/badge/vwvwrw1473502969.png",
  "Barcelona": "https://r2.thesportsdb.com/images/media/team/badge/wq9sir1639406443.png",
  "Bayern Munich": "https://r2.thesportsdb.com/images/media/team/badge/01ogkh1716960412.png",
  "Los Angeles Lakers": "https://r2.thesportsdb.com/images/media/team/badge/d8uoxw1714254511.png",
  "Boston Celtics": "https://r2.thesportsdb.com/images/media/team/badge/4j85bn1667936589.png",
  "Golden State Warriors": "https://r2.thesportsdb.com/images/media/team/badge/irobi61565197527.png",
  "Chicago Bulls": "https://r2.thesportsdb.com/images/media/team/badge/yk7swg1547214677.png",
  "Miami Heat": "https://r2.thesportsdb.com/images/media/team/badge/5v67x51547214763.png",
  "New York Knicks": "https://r2.thesportsdb.com/images/media/team/badge/wyhpuf1511810435.png",
  "Denver Nuggets": "https://r2.thesportsdb.com/images/media/team/badge/8o8j5k1546016274.png",
  "Dallas Mavericks": "https://r2.thesportsdb.com/images/media/team/badge/yqrxrs1420568796.png"
};

let initialCache = {};
try {
  initialCache = JSON.parse(localStorage.getItem(CACHE_KEY)) || {};
} catch (e) {}

const logoCache = new Map(Object.entries(initialCache));
const pendingRequests = new Map();

function saveCache() {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(Object.fromEntries(logoCache)));
  } catch (e) {}
}

// Color palette for fallback avatars
const AVATAR_COLORS = [
  '#1e88e5', '#e53935', '#43a047', '#fb8c00',
  '#8e24aa', '#00acc1', '#f4511e', '#3949ab',
  '#00897b', '#c62828', '#6a1b9a', '#00838f',
  '#2e7d32', '#ef6c00', '#4527a0', '#d81b60',
];

function getColorForTeam(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitials(name) {
  return name
    .split(/[\s\-]+/)
    .filter(w => w.length > 0)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('');
}

/**
 * Generate a fallback SVG avatar for a team
 */
export function generateFallbackAvatar(teamName) {
  const color = getColorForTeam(teamName).replace('#', '');
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(teamName)}&background=${color}&color=fff&size=40&bold=true&rounded=true`;
}

const queue = [];
let isProcessingQueue = false;

async function processQueue() {
  if (isProcessingQueue) return;
  isProcessingQueue = true;

  while (queue.length > 0) {
    const { teamName, resolve } = queue.shift();
    try {
      const response = await fetch(
        `${SPORTSDB_BASE}/searchteams.php?t=${encodeURIComponent(teamName)}`
      );

      if (!response.ok) {
        // e.g. 429 Rate Limit
        resolve(generateFallbackAvatar(teamName));
      } else {
        const data = await response.json();
        if (data.teams && data.teams.length > 0) {
          const logoUrl = data.teams[0].strBadge || data.teams[0].strTeamBadge;
          if (logoUrl) {
            logoCache.set(teamName, logoUrl);
            saveCache();
            resolve(logoUrl);
          } else {
            const fallback = generateFallbackAvatar(teamName);
            logoCache.set(teamName, fallback);
            saveCache();
            resolve(fallback);
          }
        } else {
          const fallback = generateFallbackAvatar(teamName);
          logoCache.set(teamName, fallback);
          saveCache();
          resolve(fallback);
        }
      }
    } catch (err) {
      resolve(generateFallbackAvatar(teamName));
    } finally {
      pendingRequests.delete(teamName);
    }
    // Wait 100ms between requests to speed up UX while respecting limits
    await new Promise(r => setTimeout(r, 100));
  }

  isProcessingQueue = false;
}

/**
 * Fetch team logo from TheSportsDB
 * Implements caching and request deduplication with a queue
 */
export function fetchTeamLogo(teamName) {
  // Check static mappings first
  const staticMatch = Object.keys(STATIC_LOGOS).find(k => k.toLowerCase() === teamName.toLowerCase());
  if (staticMatch) {
    return Promise.resolve(STATIC_LOGOS[staticMatch]);
  }

  if (logoCache.has(teamName)) {
    return Promise.resolve(logoCache.get(teamName));
  }

  if (pendingRequests.has(teamName)) {
    return pendingRequests.get(teamName);
  }

  const promise = new Promise((resolve) => {
    queue.push({ teamName, resolve });
    processQueue();
  });

  pendingRequests.set(teamName, promise);
  return promise;
}

export function getCachedLogo(teamName) {
  const staticMatch = Object.keys(STATIC_LOGOS).find(k => k.toLowerCase() === teamName.toLowerCase());
  if (staticMatch) {
    return STATIC_LOGOS[staticMatch];
  }
  return logoCache.get(teamName) || generateFallbackAvatar(teamName);
}

/**
 * Preload logos for a list of team names
 */
export function preloadLogos(teamNames) {
  return Promise.allSettled(teamNames.map(name => fetchTeamLogo(name)));
}
