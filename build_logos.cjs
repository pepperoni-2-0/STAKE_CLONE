const fs = require('fs');
const https = require('https');

const teams = [
  // EPL
  'Crystal Palace', 'Wolverhampton Wanderers', 'West Ham United', 'Everton', 'Brentford', 'Leeds United', 'Burnley', 'Brighton', 'Southampton', 'Leicester City', 'Nottingham Forest', 'Bournemouth', 'Fulham', 'Sheffield United', 'Luton Town', 'Chelsea', 'Arsenal', 'Manchester United', 'Manchester City', 'Liverpool', 'Tottenham Hotspur', 'Aston Villa',
  // La Liga
  'Atletico Madrid', 'Sevilla', 'Valencia', 'Real Sociedad', 'Villarreal', 'Athletic Bilbao', 'Real Betis', 'Celta Vigo', 'Osasuna', 'Girona', 'Mallorca', 'Getafe', 'Alaves', 'Las Palmas', 'Cadiz', 'Almeria', 'Granada', 'Real Madrid', 'Barcelona',
  // Serie A
  'Juventus', 'AC Milan', 'Inter Milan', 'Napoli', 'Roma', 'Lazio', 'Atalanta', 'Fiorentina', 'Torino', 'Bologna', 'Sassuolo', 'Udinese', 'Genoa', 'Monza', 'Lecce', 'Empoli', 'Verona', 'Salernitana', 'Frosinone', 'Cagliari',
  // Bundesliga
  'Borussia Dortmund', 'RB Leipzig', 'Bayer Leverkusen', 'Eintracht Frankfurt', 'Wolfsburg', 'Monchengladbach', 'Freiburg', 'Hoffenheim', 'Werder Bremen', 'Mainz 05', 'Augsburg', 'Stuttgart', 'Bochum', 'Union Berlin', 'Koln', 'Darmstadt', 'Heidenheim', 'Bayern Munich',
  // Ligue 1
  'PSG', 'Marseille', 'Lyon', 'Monaco', 'Lille', 'Nice', 'Rennes', 'Lens', 'Reims', 'Strasbourg', 'Montpellier', 'Toulouse', 'Nantes', 'Le Havre', 'Metz', 'Clermont Foot', 'Lorient', 'Brest',
  // NBA
  'Los Angeles Lakers', 'Boston Celtics', 'Golden State Warriors', 'Chicago Bulls', 'Miami Heat', 'New York Knicks', 'Denver Nuggets', 'Dallas Mavericks', 'Phoenix Suns', 'Milwaukee Bucks', 'Philadelphia 76ers', 'Brooklyn Nets', 'Los Angeles Clippers',
  // Cricket
  'Chennai Super Kings', 'Mumbai Indians', 'Royal Challengers Bengaluru', 'Kolkata Knight Riders', 'Delhi Capitals', 'Rajasthan Royals', 'Sunrisers Hyderabad', 'Punjab Kings', 'Lucknow Super Giants', 'Gujarat Titans', 'Peshawar Zalmi', 'Lahore Qalandars', 'Karachi Kings', 'Islamabad United', 'Quetta Gladiators', 'Multan Sultans'
];

function fetchLogo(team) {
  return new Promise((resolve) => {
    https.get('https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=' + encodeURIComponent(team), (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.teams && json.teams.length > 0) {
            resolve({ team, logo: json.teams[0].strBadge });
            return;
          }
        } catch(e) {}
        resolve({ team, logo: null });
      });
    }).on('error', () => resolve({ team, logo: null }));
  });
}

async function build() {
  const map = {};
  for (const team of teams) {
    const result = await fetchLogo(team);
    if (result.logo) {
      map[result.team] = result.logo;
    }
    // Sleep to avoid rate limit
    await new Promise(r => setTimeout(r, 150));
  }
  
  const fileContent = `// Auto-generated static logo map for ${Object.keys(map).length} teams\nexport const STATIC_LOGOS = ${JSON.stringify(map, null, 2)};\n`;
  fs.writeFileSync('src/services/teamLogos.js', fileContent);
  console.log('Successfully wrote teamLogos.js with ' + Object.keys(map).length + ' teams.');
}

build();
