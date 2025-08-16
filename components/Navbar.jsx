import React from 'react'
import {auth} from '../app/firebase/config'
import {signOut} from 'firebase/auth'
import { Button } from './ui/button'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'


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
    <div>
        <Button onClick={logout}>Logout</Button>
    </div>
  )
}

export default Navbar