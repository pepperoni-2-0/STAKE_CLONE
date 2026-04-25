# Stake Clone — Premium Casino & Sportsbook

A modern, high-fidelity React clone of a premium online casino and sportsbook dashboard. This project features a seamless dark-themed UI with glassmorphism, dynamic animations, and real-time sports betting integration.

## 🚀 Features

### 🎰 Casino Dashboard
- Modern, responsive landing page with promotional hero banners.
- Left-hand sidebar navigation for easy access to games.
- Seamless "Dragon Tower" mini-game integration.
- Smooth CSS transitions and hover effects for a premium feel.

### ⚽ Live Sportsbook
- **Real-Time Odds:** Live and upcoming match odds fetched dynamically from [The Odds API](https://the-odds-api.com/).
- **Sports Support:** Dedicated pages and routing for Football (Soccer), Cricket, Tennis, and Basketball.
- **Top Matches Carousel:** An animated horizontal scrolling component highlighting the biggest live and upcoming matches across leagues.
- **Dynamic Team Logos:** Automatically fetches high-quality team logos. If a logo is missing, it gracefully falls back to a generated initial avatar.
- **Interactive Bet Slip:** A fully functional bet slip that slides in, calculates multi-bet odds, potential payouts, and allows users to manage their selections.
- **Smart API Caching:** Built-in 10-minute LocalStorage caching to drastically reduce API credit consumption during development and usage.

## 🛠️ Technology Stack

- **Framework:** React 18
- **Build Tool:** Vite
- **Routing:** React Router DOM
- **Animations:** Framer Motion
- **Styling:** Vanilla CSS (Flexbox, Grid, CSS Variables)
- **APIs:** The Odds API, ui-avatars

## 📦 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/pepperoni-2-0/STAKE_CLONE.git
   cd STAKE_CLONE
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add your Odds API key:
   ```env
   VITE_ODDS_API_KEY=your_api_key_here
   ```
   *(You can get a free API key from [the-odds-api.com](https://the-odds-api.com/))*

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` (or the port provided) in your browser.

## 💡 Architecture Notes
- **State Management:** React local state and Context are used to manage the Bet Slip across different sports pages.
- **Rate Limiting Protection:** The Sportsbook actively groups matches by league and caches responses locally to prevent hitting API rate limits or exhausting free credits.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.
