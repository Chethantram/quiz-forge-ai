'use client'
import { ModeToggle } from '@/components/dark-mode'
import React, { useEffect } from 'react'
import {getAuth, onAuthStateChanged} from 'firebase/auth'
import { auth } from './firebase/config'

import { useRouter } from 'next/navigation'
import { connectDb } from '@/lib/db'
import Navbar from '@/components/Navbar'

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
    <div>hi <ModeToggle/>
    <Navbar/>
    </div>
  )
}

export default page