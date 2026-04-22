import Sportsbook from '../Components/Sportsbook/Sportsbook';
import TopMatchesCarousel from '../Components/Sportsbook/TopMatchesCarousel';

const BasketballPage = () => (
  <>
    <TopMatchesCarousel sport="basketball" />
    <Sportsbook initialSport="basketball" />
  </>
);
export default BasketballPage;
