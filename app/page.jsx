'use client'
import { ModeToggle } from '@/components/dark-mode'
import React, { useEffect } from 'react'
import {getAuth, onAuthStateChanged} from 'firebase/auth'
import { auth } from './firebase/config'

import { useRouter } from 'next/navigation'
import { connectDb } from '@/lib/db'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import HowItWorks from '@/components/HowItWorks'
import Testimonials from '@/components/Testimonical'
import CallToAction from '@/components/CTA'

const page = async() => {
  const router = useRouter();
  useEffect(() => {
    const currentUser = onAuthStateChanged(auth,async(user)=>{      
      if(user !== null) {
        router.push("/");
      }else{
        router.push("/sign-in");
      }
    });
    return ()=> currentUser;    
  }, [router]);

  return (
    <div className='md:px-20 px-6'>
      <Hero/>
      <Features/>
      <HowItWorks/>
      <Testimonials/>
      {/* <div className='px-0'><CallToAction/></div> */}
      
    </div>
  )
}

export default page