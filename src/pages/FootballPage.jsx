import Sportsbook from '../Components/Sportsbook/Sportsbook';
import TopMatchesCarousel from '../Components/Sportsbook/TopMatchesCarousel';

const FootballPage = () => (
  <>
    <TopMatchesCarousel sport="football" />
    <Sportsbook initialSport="football" />
  </>
);
export default FootballPage;
