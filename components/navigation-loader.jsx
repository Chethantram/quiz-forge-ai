"use client";

import { BarLoader } from "react-spinners";

const NavigationLoader = () => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <BarLoader 
        color="#4F46E5" 
        height={4}
        width="100%"
        speedMultiplier={1}
      />
    </div>
  );
};

export default NavigationLoader;
