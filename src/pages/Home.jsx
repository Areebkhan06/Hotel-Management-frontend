import React, { Suspense, lazy } from "react";
import HeroSlider from "../Components/HeroSlider";

// Lazy load heavy components
const BestSeller = lazy(() => import("../Components/BestSeller"));
const Reviews = lazy(() => import("../Components/Reviews"));

const Home = () => {
  return (
    <div>
      {/* Hero loads immediately */}
      <HeroSlider />

      {/* Below-the-fold components load lazily */}
      <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
        <BestSeller />
      </Suspense>
      <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
        <Reviews />
      </Suspense>
    </div>
  );
};

export default Home;
