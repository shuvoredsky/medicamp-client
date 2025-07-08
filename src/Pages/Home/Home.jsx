import { Helmet } from "react-helmet-async";
import Slider from "../../Components/Slider.jsx/Slider";

const Home = () => {
  return (
    <div className="bg-base-200 text-base-content min-h-screen">
      <Helmet>
        <title>WhereIsIt | Home</title>
      </Helmet>
      {/* <LostFoundSlider /> */}
      <Slider></Slider>
    </div>
  );
};

export default Home;
