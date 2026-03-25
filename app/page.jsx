"use client";
import React from "react";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonical";
import CallToAction from "@/components/CTA";

const page = () => {
  // Home page is public - no authentication required
  // Users can view all features and content without signing in

  return (
    <div className="lg:px-20 md:px-5 px-4">      
      {/* Hero Section */}
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <div className="p-0">
        <CallToAction />
      </div>
    </div>
  );
};

export default page;
