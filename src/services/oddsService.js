/**
 * Odds API Service
 * Fetches real-time odds from The Odds API
 * 
 * Set your API key in .env: VITE_ODDS_API_KEY=your_key_here
 * Get a free key at: https://the-odds-api.com/
 */

const BASE_URL = 'https://api.the-odds-api.com/v4/sports';
const API_KEY = import.meta.env.VITE_ODDS_API_KEY || '';

export const SPORTS_CONFIG = {
  football: {
    label: 'Football',
    icon: '⚽',
    sportKeys: [
      'soccer_epl',
      'soccer_spain_la_liga',
      'soccer_germany_bundesliga',
      'soccer_italy_serie_a',
      'soccer_france_ligue_one',
      'soccer_uefa_champs_league',
    ],
    hasDraw: true,
  },
  cricket: {
    label: 'Cricket',
    icon: '🏏',
    sportKeys: [
      'cricket_ipl',
      'cricket_international_t20',
      'cricket_psl',
      'cricket_odi',
      'cricket_test_match',
      'cricket_big_bash',
    ],
    hasDraw: false,
  },
  tennis: {
    label: 'Tennis',
    icon: '🎾',
    sportKeys: [
      'tennis_atp_madrid_open',
      'tennis_wta_madrid_open',
      'tennis_atp_french_open',
      'tennis_atp_us_open',
      'tennis_atp_wimbledon',
      'tennis_atp_australian_open',
    ],
    hasDraw: false,
  },
  basketball: {
    label: 'Basketball',
    icon: '🏀',
    sportKeys: [
      'basketball_nba',
      'basketball_wnba',
      'basketball_euroleague',
      'basketball_nba_championship_winner',
    ],
    hasDraw: false,
  },
};
const LEAGUE_NAMES = {
  soccer_epl: { league: 'Premier League', country: 'England' },
  soccer_spain_la_liga: { league: 'La Liga', country: 'Spain' },
  soccer_germany_bundesliga: { league: 'Bundesliga', country: 'Germany' },
  soccer_italy_serie_a: { league: 'Serie A', country: 'Italy' },
  soccer_france_ligue_one: { league: 'Ligue 1', country: 'France' },
  soccer_uefa_champs_league: { league: 'Champions League', country: 'UEFA' },
  cricket_ipl: { league: 'Indian Premier League', country: 'India' },
  cricket_odi: { league: 'One Day International', country: 'International' },
  cricket_test_match: { league: 'Test Match', country: 'International' },
  cricket_big_bash: { league: 'Big Bash League', country: 'Australia' },
  tennis_atp_french_open: { league: 'French Open', country: 'ATP' },
  tennis_atp_us_open: { league: 'US Open', country: 'ATP' },
  tennis_atp_wimbledon: { league: 'Wimbledon', country: 'ATP' },
  tennis_atp_australian_open: { league: 'Australian Open', country: 'ATP' },
  basketball_nba: { league: 'NBA', country: 'USA' },
  basketball_euroleague: { league: 'EuroLeague', country: 'Europe' },
  basketball_nba_championship_winner: { league: 'NBA Championship', country: 'USA' },
};

export function getLeagueName(sportKey) {
  return LEAGUE_NAMES[sportKey] || { league: sportKey, country: '' };
}

/**
 * Parse odds from bookmaker data
 * Returns the best odds from all bookmakers for each outcome
 */
function parseOdds(event) {
  const oddsMap = {};

  if (!event.bookmakers || event.bookmakers.length === 0) {
    return null;
  }

  // Get odds from the first available bookmaker
  const bookmaker = event.bookmakers[0];
  const h2hMarket = bookmaker.markets?.find(m => m.key === 'h2h');

  if (!h2hMarket || !h2hMarket.outcomes) return null;

  const outcomes = {};
  h2hMarket.outcomes.forEach(outcome => {
    outcomes[outcome.name] = outcome.price;
  });

  return outcomes;
}

let currentQuota = null;

export function getRemainingQuota() {
  return currentQuota;
}

async function fetchOddsForSport(sportKey) {
  if (!API_KEY) {
    throw new Error('API_KEY_MISSING');
  }

  // To prevent burning 500 credits during Vite hot-reloading, cache API responses in localStorage for 10 minutes
  const CACHE_KEY = `sb_odds_cache_${sportKey}`;
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { timestamp, data, quota } = JSON.parse(cached);
      if (Date.now() - timestamp < 600000) { // 10 minutes
        if (quota !== undefined) currentQuota = quota;
        return data;
      }
    }
  } catch(e) {}

  const url = `${BASE_URL}/${sportKey}/odds/?regions=uk&markets=h2h&oddsFormat=decimal&apiKey=${API_KEY}`;

  const response = await fetch(url);

  if (response.headers.has('x-requests-remaining')) {
    currentQuota = parseInt(response.headers.get('x-requests-remaining'), 10);
  }

  if (!response.ok) {
    if (response.status === 401) {
      try {
        const errorData = await response.json();
        if (errorData.error_code === 'OUT_OF_USAGE_CREDITS' || errorData.message?.includes('quota')) {
          throw new Error('QUOTA_REACHED');
        }
      } catch (e) {}
      throw new Error('INVALID_API_KEY');
    }
    if (response.status === 429) throw new Error('RATE_LIMITED');
    throw new Error(`API_ERROR_${response.status}`);
  }

  const data = await response.json();
  
  // Save to cache
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data, quota: currentQuota }));
  } catch(e) {}

  return data;
}

/**
 * Fetch all odds for a sport category (e.g., 'football' fetches EPL, La Liga, etc.)
 */
export async function fetchOddsForCategory(categoryKey) {
  const config = SPORTS_CONFIG[categoryKey];
  if (!config) throw new Error('Invalid sport category');

  const results = [];

  // Fetch all sport keys in parallel
  const promises = config.sportKeys.map(async (sportKey) => {
    try {
      const events = await fetchOddsForSport(sportKey);
      return events.map(event => ({
        id: event.id,
        sportKey: event.sport_key,
        sportTitle: event.sport_title,
        leagueInfo: getLeagueName(event.sport_key),
        commenceTime: event.commence_time,
        homeTeam: event.home_team,
        awayTeam: event.away_team,
        odds: parseOdds(event),
        isLive: new Date(event.commence_time) <= new Date(),
      }));
    } catch (err) {
      // If individual sport key fails, return empty (might not have events)
      if (err.message === 'API_KEY_MISSING' || err.message === 'INVALID_API_KEY') {
        throw err;
      }
      console.warn(`No data for ${sportKey}:`, err.message);
      return [];
    }
  });

  const allResults = await Promise.all(promises);
  return allResults.flat().filter(e => e.odds !== null);
}

/**
 * Group events by league
 */
export function groupByLeague(events) {
  const grouped = {};

  events.forEach(event => {
    const key = event.sportKey;
    if (!grouped[key]) {
      grouped[key] = {
        leagueInfo: event.leagueInfo,
        sportKey: key,
        events: [],
      };
    }
    grouped[key].events.push(event);
  });

  return Object.values(grouped);
}

export function hasApiKey() {
  return !!API_KEY;
}
