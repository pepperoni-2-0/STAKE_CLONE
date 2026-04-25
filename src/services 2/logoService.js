

const SPORTSDB_BASE = 'https://api.the-odds-api.com/v4/sports
const CACHE_KEY = 'sb_logo_cache';

const STATIC_LOGOS = {
  "Chennai Super Kings": "https://api.the-odds-api.com/v4/sports
  "Mumbai Indians": "https://api.the-odds-api.com/v4/sports
  "Royal Challengers Bengaluru": "https://api.the-odds-api.com/v4/sports
  "Kolkata Knight Riders": "https://api.the-odds-api.com/v4/sports
  "Delhi Capitals": "https://api.the-odds-api.com/v4/sports
  "Rajasthan Royals": "https://api.the-odds-api.com/v4/sports
  "Sunrisers Hyderabad": "https://api.the-odds-api.com/v4/sports
  "Punjab Kings": "https://api.the-odds-api.com/v4/sports
  "Lucknow Super Giants": "https://api.the-odds-api.com/v4/sports
  "Gujarat Titans": "https://api.the-odds-api.com/v4/sports
  "Arsenal": "https://api.the-odds-api.com/v4/sports
  "Manchester United": "https://api.the-odds-api.com/v4/sports
  "Liverpool": "https://api.the-odds-api.com/v4/sports
  "Chelsea": "https://api.the-odds-api.com/v4/sports
  "Manchester City": "https://api.the-odds-api.com/v4/sports
  "Tottenham Hotspur": "https://api.the-odds-api.com/v4/sports
  "Newcastle United": "https://api.the-odds-api.com/v4/sports
  "Aston Villa": "https://api.the-odds-api.com/v4/sports
  "West Ham United": "https://api.the-odds-api.com/v4/sports
  "Everton": "https://api.the-odds-api.com/v4/sports
  "Real Madrid": "https://api.the-odds-api.com/v4/sports
  "Barcelona": "https://api.the-odds-api.com/v4/sports
  "Bayern Munich": "https://api.the-odds-api.com/v4/sports
  "Los Angeles Lakers": "https://api.the-odds-api.com/v4/sports
  "Boston Celtics": "https://api.the-odds-api.com/v4/sports
  "Golden State Warriors": "https://api.the-odds-api.com/v4/sports
  "Chicago Bulls": "https://api.the-odds-api.com/v4/sports
  "Miami Heat": "https://api.the-odds-api.com/v4/sports
  "New York Knicks": "https://api.the-odds-api.com/v4/sports
  "Denver Nuggets": "https://api.the-odds-api.com/v4/sports
  "Dallas Mavericks": "https://api.the-odds-api.com/v4/sports
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


export function generateFallbackAvatar(teamName) {
  const color = getColorForTeam(teamName).replace('#', '');
  return `https://api.the-odds-api.com/v4/sports
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
    
    await new Promise(r => setTimeout(r, 100));
  }

  isProcessingQueue = false;
}


export function fetchTeamLogo(teamName) {
  
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


export function preloadLogos(teamNames) {
  return Promise.allSettled(teamNames.map(name => fetchTeamLogo(name)));
}
