import Sportsbook from '../Components/Sportsbook/Sportsbook';
import TopMatchesCarousel from '../Components/Sportsbook/TopMatchesCarousel';

const TennisPage = () => (
  <>
    <TopMatchesCarousel sport="tennis" />
    <Sportsbook initialSport="tennis" />
  </>
);
export default TennisPage;
