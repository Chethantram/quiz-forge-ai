'use client';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function EditProfile({ children,user}) {
    const [name, setName] = useState("" || user?.name);
    const [email, setEmail] = useState(user?.email);
    const [difficulty, setDifficulty] = useState("" || user?.difficulty);
    const [loading, setLoading] = useState(false)

    console.log(name,difficulty);
    
    const handleUpdate = async()=>{
        setLoading(true);
        try {
            const user = {
                email:email,
                name:name,
                difficulty:difficulty
            }
            const res = await axios.post('/api/user/update',user);
            console.log("User updated successfully:", res.data);
            if(res?.status === 200){
                toast.success(res?.data?.message ||"Profile updated successfully");
                window.location.reload();
            }else{
                toast.error(res?.data?.message ||"Something went wrong");
            }
            
        } catch (error) {
            console.log(error);

            
        }finally{
            setLoading(false);
        }
    }
return (
    <Dialog>
        <form>
            <DialogTrigger asChild>
                <Button className={'bg-indigo-500 text-white hover:bg-indigo-600 hover:text-white  dark:bg-indigo-500 dark:text-white dark:hover:bg-indigo-600 dark:hover:text-white'} variant="outline">Edit</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] dark:bg-gray-900 bg-gray-100 border border-indigo-500 dark:border-indigo-500">
                <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>
                        Make changes to your profile here. Click save when you&apos;re
                        done.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                    <div className="grid gap-3">
                        <Label htmlFor="name-1">Name</Label>
                        <Input value={name} onChange={(e)=>setName(e.target.value)} id="name-1" name="name" defaultValue={user?.name} />
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="difficulty">Difficulty Level</Label>
                        <Select onValueChange={(value)=>setDifficulty(value)} value={difficulty}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select Difficulty" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="easy">Easy</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="hard">Hard</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleUpdate} disabled={loading} className={'bg-indigo-500 text-white hover:bg-indigo-600 hover:text-white  dark:bg-indigo-500 dark:text-white dark:hover:bg-indigo-600 dark:hover:text-white'} type="submit">{loading? <><Loader2 className="mr-2 animate-spin h-4 w-4"/>updating...</>:"Save changes"}</Button>
                </DialogFooter>
            </DialogContent>
        </form>
    </Dialog>
);
}
