import { Helmet } from "react-helmet-async";
import Slider from "../../Components/Slider.jsx/Slider";
import CampSection from "../../Components/CampCardSection/CampSection";
import FeedBacksSection from "../../Components/FeedBacksSection/FeedBacksSection";
import SuccessStory from "../../Components/SuccessStory/SuccessStory";
import AboutUs from "../../Components/AboutUs/AboutUs";
import HealthTips from "../../Components/HealthTips/HealthTips";

const Home = () => {
  return (
    <div className="bg-base-200 text-base-content min-h-screen">
      <Helmet>
        <title>Medicamp | Home</title>
      </Helmet>
      {/* <LostFoundSlider /> */}
      <Slider></Slider>
      <CampSection></CampSection>
      <SuccessStory></SuccessStory>
      <HealthTips></HealthTips>
      <FeedBacksSection></FeedBacksSection>
      <AboutUs></AboutUs>
    </div>
  );
};

export default Home;
