import Hero from '../Components/Hero';
import TrendingGames from '../Components/TrendingGames';
import TrendingSports from '../Components/TrendingSports';
import BetHistory from '../Components/BetHistory/BetHistory';

const LandingPage = () => {
  return (
    <>
      <Hero />
      <TrendingGames />
      <TrendingSports />
      <BetHistory />
    </>
  );
};

export default LandingPage;
