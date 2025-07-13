import { Helmet } from "react-helmet-async";
import Slider from "../../Components/Slider.jsx/Slider";
import CampSection from "../../Components/CampCardSection/CampSection";
import FeedBacksSection from "../../Components/FeedBacksSection/FeedBacksSection";

const Home = () => {
  return (
    <div className="bg-base-200 text-base-content min-h-screen">
      <Helmet>
        <title>WhereIsIt | Home</title>
      </Helmet>
      {/* <LostFoundSlider /> */}
      <Slider></Slider>
      <CampSection></CampSection>
      <FeedBacksSection></FeedBacksSection>
    </div>
  );
};

export default Home;
