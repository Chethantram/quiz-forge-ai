'use client'
import React from 'react'
import {auth} from '../app/firebase/config'
import {signOut} from 'firebase/auth'
import { Button } from './ui/button'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ModeToggle } from './dark-mode'


const Navbar = () => {
    const router = useRouter();
    const logout = async () => {
        try {
            await signOut(auth);
            router.push("/sign-in");
            toast.success("Logout Successfully");

        } catch (error) {
            console.log(error);
            
        }
    }   

  return (
    <nav className='flex justify-between items-center py-3'>
        <div className='flex items-center'>
            <Image src={'/logo.png'} width={40} height={40} alt='logo' className='mr-2'/>
            <p className='text-xl font-semibold pt-1'>QuizForge <span className='text-[#4F46E5]'>AI</span></p>
        </div>
        <div>
            <ul className='md:space-x-10'>
                <Link href={'/'} className='font-mono'>Home</Link>
                <Link href={'/'} className='font-mono'>GenerateQuiz</Link>
                <Link href={'/'} className='font-mono'>MyQuiz</Link>
                <Link href={'/'} className='font-mono'>About</Link>
                
            </ul>
        </div>

        <div className='flex items-center gap-3'>
            <Button className={'border-2 border-indigo-600/30 px-6 py-2 rounded-full bg-transparent text-gray-800 dark:text-gray-100 hover:bg-indigo-50'}>
                Login
            </Button>
            <ModeToggle/>
        </div>
    </nav>
  )
}

export default Navbar