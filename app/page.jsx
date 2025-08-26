"use client";
import React, {useEffect, useState } from "react";
import {onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/config";

import { useRouter } from "next/navigation";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonical";
import CallToAction from "@/components/CTA";
import NavigationLoader from "@/components/navigation-loader";

const page = async () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const currentUser = onAuthStateChanged(auth, async (user) => {
      setLoading(true)
      try {
        
        if (user !== null) {
          router.push("/");
        } else {
          router.push("/sign-in");
        }
      } catch (error) {
        console.log(error);
      }finally{
        setLoading(false);
      }
    });
    return () => currentUser;
  }, [router,auth]);

if (loading) {
    return <NavigationLoader />;
  
}
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
