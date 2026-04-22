import Sportsbook from '../Components/Sportsbook/Sportsbook';
import TopMatchesCarousel from '../Components/Sportsbook/TopMatchesCarousel';

const CricketPage = () => (
  <>
    <TopMatchesCarousel sport="cricket" />
    <Sportsbook initialSport="cricket" />
  </>
);
export default CricketPage;
